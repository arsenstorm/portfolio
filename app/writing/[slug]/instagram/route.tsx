// Next
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Node
import path from "node:path";
import fs from "node:fs/promises";

const getWriting = async (slug: string) => {
	const filePath = path.resolve(
		path.join(process.cwd(), "writings", `${slug}.mdx`),
	);

	const file = await fs.readFile(filePath, "utf8");

	return file;
};

const getInterMedium = async () => {
	const filePath = path.resolve(
		path.join(process.cwd(), "fonts", "Inter-Medium.ttf"),
	);

	const buffer = await fs.readFile(filePath);

	return buffer;
};

const getInterLight = async () => {
	const filePath = path.resolve(
		path.join(process.cwd(), "fonts", "Inter-Light.otf"),
	);

	const buffer = await fs.readFile(filePath);

	return buffer;
};

const getInterItalics = async () => {
	const filePath = path.resolve(
		path.join(process.cwd(), "fonts", "Inter-Italic.otf"),
	);

	const buffer = await fs.readFile(filePath);

	return buffer;
};

const getInterMediumItalics = async () => {
	const filePath = path.resolve(
		path.join(process.cwd(), "fonts", "Inter-MediumItalic.otf"),
	);

	const buffer = await fs.readFile(filePath);

	return buffer;
};

function mulberry32(a: number) {
	return () => {
		// biome-ignore lint/style/noParameterAssign: this is fine
		a += 0x6d2b79f5;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function hashCode(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash = hash & hash;
	}
	return hash;
}

// Extract word rendering logic into separate function
function renderWord(
	word: string,
	lineIndex: number,
	wordIndex: number,
	random: () => number,
	isItalic: boolean,
	isBold: boolean,
) {
	const parts = [word];

	return (
		<span key={`word-${lineIndex}-${wordIndex}-${random() * 1000}`}>
			{parts.map((part, partIndex) => {
				if (isBold && (isItalic || part.endsWith("”"))) {
					const text = part
						.replace(/\{\{bold\}\}/, "")
						.replace(/\{\{\/bold\}\}/, "");

					return renderBoldInItalic(
						text,
						lineIndex,
						wordIndex,
						partIndex,
						random,
						true,
					);
				}
				if (isBold || part.endsWith("{{/bold}}")) {
					const text = part
						.replace(/\{\{bold\}\}/, "")
						.replace(/\{\{\/bold\}\}/, "");

					return (
						<span
							key={`bold-${lineIndex}-${wordIndex}-${partIndex}-${random() * 1000}`}
							style={{
								fontFamily: "Inter Medium",
								color: "#ffffff",
							}}
						>
							{text}
						</span>
					);
				}
				if (isItalic || part.endsWith("”")) {
					return renderItalicPart(
						part,
						lineIndex,
						wordIndex,
						partIndex,
						random,
					);
				}
				return (
					<span
						key={`text-${lineIndex}-${wordIndex}-${partIndex}-${random() * 1000}`}
						style={{
							fontFamily: "Inter Light",
						}}
					>
						{part}
					</span>
				);
			})}
		</span>
	);
}

function renderItalicPart(
	part: string,
	lineIndex: number,
	wordIndex: number,
	partIndex: number,
	random: () => number,
) {
	return (
		<span
			key={`italic-${lineIndex}-${wordIndex}-${partIndex}-${random() * 1000}`}
			style={{
				fontStyle: "italic",
				fontFamily: "Inter Italics",
			}}
		>
			{renderBoldInItalic(part, lineIndex, wordIndex, partIndex, random, false)}
		</span>
	);
}

function renderBoldInItalic(
	text: string,
	lineIndex: number,
	wordIndex: number,
	partIndex: number,
	random: () => number,
	isBold: boolean,
) {
	return text.split(/(\{\{bold\}\}.*?\{\{\/bold\}\})/g).map((part, index) => {
		if (isBold) {
			// if the part endswith ”, we need to remove it and return it sepearetly
			const hasItalic = part.endsWith("”");

			const text = hasItalic ? part.replace("”", "") : part;

			return (
				<>
					<span
						key={`bold-${lineIndex}-${wordIndex}-${partIndex}-${index}-${random() * 1000}`}
						style={{
							fontFamily: "Inter Medium Italics",
							color: "#ffffff",
						}}
					>
						{text}
					</span>
					{hasItalic && (
						<span
							key={`italic-${lineIndex}-${wordIndex}-${partIndex}-${index}-${random() * 1000}`}
							style={{
								fontStyle: "italic",
								fontFamily: "Inter Italics",
							}}
						>
							”
						</span>
					)}
				</>
			);
		}
		return part;
	});
}

/**
 * @name OG Template
 */
export async function GET(
	_: NextRequest,
	{ params }: Readonly<{ params: Promise<{ slug: string }> }>,
) {
	const { slug } = await params;

	let title: string | null = null;
	let writing: string | null = null;

	try {
		writing = await getWriting(slug);

		if (!writing) {
			return new Response("This writing does not exist.", { status: 404 });
		}

		const parts = writing.split("---");

		const frontmatter = parts[1].trim();

		const titleLine = frontmatter
			.split("\n")
			.find((line) => line.startsWith("title:"));

		title = titleLine ? titleLine.replace("title:", "").trim() : "Untitled";

		writing = parts[2].trim();

		writing = writing.replace(
			/(^>(?:[^\n]+)(?:\n>(?:[^\n]+))*)/gm,
			(match) => `“${match.replace(/^> ?/gm, "").trim()}”`,
		);

		writing = writing.replace(/\[(.*?)\]\([^)]+\)/g, "{{bold}}$1{{/bold}}");
		writing = writing.replace(/\*\*([\s\S]*?)\*\*/g, "{{bold}}$1{{/bold}}");

		writing = writing.replace(/\r\n/g, "\n").replace(/\n\n+/g, "\n\n").trim();
	} catch (error) {
		console.error("This writing does not exist.");
	}

	const random = mulberry32(hashCode(slug));

	let isItalic = false;
	let isBold = false;

	return new ImageResponse(
		<div
			style={{
				backgroundColor: "#000",
				backgroundImage: `radial-gradient(circle at 0% 0%, #ffffff05 0%, transparent 50%),
				                 radial-gradient(circle at 100% 0%, #ffffff05 0%, transparent 50%),
				                 radial-gradient(circle at 100% 100%, #ffffff05 0%, transparent 50%),
				                 radial-gradient(circle at 0% 100%, #ffffff05 0%, transparent 50%)`,
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				fontFamily: "Inter Light",
				overflow: "hidden",
				padding: "128px",
			}}
		>
			{[...Array(20)].map((_, i) => (
				<div
					key={`decoration-${i}-${random() * 1000}`}
					style={{
						position: "absolute",
						width: `${random() * 100 + 50}px`,
						height: `${random() * 100 + 50}px`,
						border: "1px solid #ffffff75",
						transform: `rotate(${random() * 360}deg) translate(${random() * 1000 - 500}px, ${random() * 600 - 300}px)`,
						opacity: 0.25,
					}}
				/>
			))}
			<div
				style={{
					backgroundImage: "linear-gradient(to bottom, #ffffff, #64748b)",
					WebkitBackgroundClip: "text",
					color: "transparent",
					backgroundClip: "text",
					display: "flex",
					flexDirection: "column",
					width: "100%",
				}}
			>
				<h1
					style={{
						fontFamily: "Inter Medium",
						color: "#ffffff",
						fontSize: "64px",
					}}
				>
					{title}
				</h1>
				<p
					style={{
						fontSize: "32px",
						textWrap: "balance",
						whiteSpace: "pre-wrap",
						display: "flex",
						flexDirection: "column",
						gap: "8px",
					}}
				>
					{writing?.split("\n").map((line, lineIndex) => (
						<span
							key={`line-${lineIndex}-${random() * 1000}`}
							style={{
								display: "flex",
								flexWrap: "wrap",
								gap: "8px",
							}}
						>
							{line.split(" ").map((word, wordIndex) => {
								if (word.startsWith("“")) {
									isItalic = true;
								}
								if (word.endsWith("”")) {
									isItalic = false;
								}
								if (word.startsWith("{{bold}}")) {
									isBold = true;
								}
								if (word.endsWith("{{/bold}}")) {
									isBold = false;
								}
								return renderWord(
									word,
									lineIndex,
									wordIndex,
									random,
									isItalic,
									isBold,
								);
							})}
							{lineIndex < writing.split("\n").length - 1 && "\n"}
						</span>
					))}
				</p>
			</div>
		</div>,
		{
			width: 1024,
			height: 1024,
			headers: {
				"Cache-Control": "public, max-age=3600, immutable",
			},
			fonts: [
				{
					name: "Inter Light",
					data: await getInterLight(),
				},
				{
					name: "Inter Medium",
					data: await getInterMedium(),
				},
				{
					name: "Inter Italics",
					data: await getInterItalics(),
				},
				{
					name: "Inter Medium Italics",
					data: await getInterMediumItalics(),
				},
			],
		},
	);
}
