// Node
import path from "node:path";
import { readFile } from "node:fs/promises";

// S3
import {
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";

// ElevenLabs
import { ElevenLabsClient } from "elevenlabs";

// Next
import { type NextRequest, NextResponse } from "next/server";
import { getAllWriting } from "@/utils/get-all-writing";

const VOICE_IDS = {
	1: "1dNax2RqtrIkgRHBEqia",
	2: "3rWBcFHu7rpPUEJQYEqD",
};

const s3Client = new S3Client({
	endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: `${process.env.CLOUDFLARE_TOKEN_ID}`,
		secretAccessKey: `${process.env.CLOUDFLARE_TOKEN_SECRET}`,
	},
	region: "auto",
});

const elevenlabs = new ElevenLabsClient({
	apiKey: process.env.ELEVENLABS_API_KEY,
});

const getWriting = async (slug: string) => {
	let writing = await readFile(
		path.resolve(path.join(process.cwd(), "writings", `${slug}.mdx`)),
		"utf8",
	);

	if (!writing) {
		throw new Error("This writing does not exist.");
	}

	const parts = writing.split("---");

	const frontmatter = parts[1].trim();

	const titleLine = frontmatter
		.split("\n")
		.find((line) => line.startsWith("title:"));

	const title = titleLine ? titleLine.replace("title:", "").trim() : "Untitled";

	writing = parts[2].trim();

	writing = writing
		.replaceAll(">\n", "> \n")
		.replace(
			/(^>(?:[^\n]+)(?:\n>(?:[^\n]+))*)/gm,
			(match) => `“${match.replace(/^> ?/gm, "").trim()}”`,
		);

	writing = writing.replace(/\[(.*?)\]\([^)]+\)/g, "$1");
	writing = writing.replace(/\*\*([\s\S]*?)\*\*/g, "$1");

	writing = writing
		.replace(/\r\n/g, "\n")
		.replace(/\n\n+/g, '\n<break time="0.2s" />\n')
		.trim();

	writing = writing
		.replaceAll(">\n", "> \n")
		.replace(
			/(^>(?:[^\n]+)(?:\n>(?:[^\n]+))*)/gm,
			(match) => `1: "${match.replace(/^> ?/gm, "").trim()}"`,
		);

	writing = writing.replace(/(?<!1: )“(?!:)/g, "1: “");

	writing = writing.replace(/\*/g, "");

	let speakers = 1;

	if ((writing.match(/1: /g) || []).length >= 2) {
		const lines = writing.split("\n");
		const dialogueLines = lines.filter((line) => line.startsWith("1: "));
		const isOdd = dialogueLines.length % 2 !== 0;
		let speakerNumber = isOdd ? 1 : 2;

		writing = lines
			.map((line) => {
				if (line.startsWith("1: ")) {
					const prefix = `${speakerNumber}: `;
					speakerNumber = speakerNumber === 1 ? 2 : 1;
					return line.replace("1: ", prefix);
				}
				return line;
			})
			.join("\n");

		speakers = 2;
	}

	return {
		title,
		writing,
		speakers,
	};
};

async function generateAudio(text: string, speakers: number): Promise<Buffer> {
	if (speakers === 1) {
		const response = await elevenlabs.textToSpeech.convert(VOICE_IDS[1], {
			model_id: "eleven_flash_v2_5",
			output_format: "mp3_44100_128",
			text: text.replace(/1: /g, ""),
			voice_settings: {
				stability: 1,
				similarity_boost: 0.5,
			},
		});

		const chunks = [];
		for await (const chunk of response) {
			chunks.push(chunk);
		}

		return Buffer.concat(chunks);
	}

	try {
		const segments = text.split("\n").filter((line) => line.trim());
		const audioChunks: Buffer[] = [];

		for (const segment of segments) {
			if (segment.includes("<break")) {
				const timeRegex = /time="([\d.]+)s"/;
				const timeMatch = timeRegex.exec(segment);
				if (timeMatch) {
					const SAMPLES_PER_SECOND = 44100;
					const pauseDuration = Number.parseFloat(timeMatch[1]);
					const silenceLength = Math.floor(SAMPLES_PER_SECOND * pauseDuration);

					audioChunks.push(Buffer.from(new Uint8Array(silenceLength)));
					continue;
				}
			}

			const breakRegex = /<break[^>]*>/g;
			const [speakerNum, ...textParts] = segment
				.replace(breakRegex, "")
				.split(": ");
			const speaker = Number.parseInt(speakerNum);
			const line = textParts.join(": ").trim();

			console.log(speaker, line, "started");

			if (!line) continue;

			const response = await elevenlabs.textToSpeech.convert(
				VOICE_IDS[speaker as keyof typeof VOICE_IDS] ?? VOICE_IDS[1],
				{
					model_id: "eleven_flash_v2_5",
					output_format: "mp3_44100_128",
					text: line,
					voice_settings: {
						stability: 1,
						similarity_boost: 0.5,
					},
				},
			);

			const chunks = [];
			for await (const chunk of response) {
				chunks.push(chunk);
			}
			audioChunks.push(Buffer.concat(chunks));

			console.log(speaker, line, "finished");
		}

		return Buffer.concat(audioChunks);
	} catch (error) {
		console.error("ElevenLabs API error:", error);
		throw error;
	}
}

export async function GET(
	request: NextRequest,
	{
		params,
	}: Readonly<{
		params: Promise<{
			slug: string;
		}>;
	}>,
) {
	const { slug } = await params;
	let audioData: Buffer;

	try {
		const response = await s3Client.send(
			new GetObjectCommand({
				Bucket: "portfolio",
				Key: `${slug}.mp3`,
			}),
		);

		if (!response.Body) {
			throw new Error("No response body received from S3");
		}

		const chunks = [];
		for await (const chunk of response.Body as any) {
			chunks.push(chunk);
		}
		audioData = Buffer.concat(chunks);
	} catch (error) {
		console.warn(`An audio file for ${slug} does not exist.`);
		const { title, writing, speakers } = await getWriting(slug);

		if (!writing) {
			return NextResponse.json(
				{ error: "This writing does not exist." },
				{ status: 404 },
			);
		}

		if (writing.includes("audio: false")) {
			return NextResponse.json(
				{ error: "This writing does not have audio." },
				{ status: 400 },
			);
		}

		const text = `1: "${title}"\n<break time="1.0s" />\n${writing}`;
		console.warn(text);

		audioData = await generateAudio(text, speakers);

		await s3Client.send(
			new PutObjectCommand({
				Bucket: "portfolio",
				Key: `${slug}.mp3`,
				Body: audioData,
			}),
		);
	}

	return new NextResponse(audioData, {
		headers: {
			"Content-Type": "audio/mpeg",
			"Content-Length": audioData.length.toString(),
		},
	});
}

export async function generateStaticParams() {
	const writings = await getAllWriting();

	return writings.map((writing) => ({
		slug: writing.slug,
	}));
}
