// Node
import path from "node:path";
import fs from "node:fs/promises";

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
	let writing = await fs.readFile(
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

	writing = writing.replace(/\[(.*?)\]\([^)]+\)/g, "{{bold}}$1{{/bold}}");
	writing = writing.replace(/\*\*([\s\S]*?)\*\*/g, "{{bold}}$1{{/bold}}");

	writing = writing.replace(/\r\n/g, "\n").replace(/\n\n+/g, "\n\n").trim();

	return {
		title,
		writing,
	};
};

async function generateAudio(writing: string): Promise<Buffer> {
	try {
		const response = await elevenlabs.textToSpeech.convert(
			"L0Dsvb3SLTyegXwtm47J",
			{
				model_id: "eleven_turbo_v2",
				output_format: "mp3_44100_128",
				text: writing,
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

		return Buffer.concat(chunks);
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
		const { writing } = await getWriting(slug);

		if (!writing) {
			return NextResponse.json(
				{ error: "This writing does not exist." },
				{ status: 404 },
			);
		}

		audioData = await generateAudio(writing);

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
