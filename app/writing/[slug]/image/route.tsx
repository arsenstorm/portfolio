// Next
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// Node
import path from "node:path";
import fs from "node:fs/promises";
import { getAllWriting } from "@/utils/get-all-writing";

const getWriting = async (slug: string) => {
	return await fs.readFile(
		path.resolve(path.join(process.cwd(), "writings", `${slug}.mdx`)),
		"utf8",
	);
};

const getAllFonts = async () => {
	return {
		"Inter Medium": await fs.readFile(
			path.resolve(path.join(process.cwd(), "fonts", "Inter-Medium.ttf")),
		),
		"Inter Light": await fs.readFile(
			path.resolve(path.join(process.cwd(), "fonts", "Inter-Light.otf")),
		),
		"Inter Italics": await fs.readFile(
			path.resolve(path.join(process.cwd(), "fonts", "Inter-Italic.otf")),
		),
		"Inter Medium Italics": await fs.readFile(
			path.resolve(path.join(process.cwd(), "fonts", "Inter-MediumItalic.otf")),
		),
	};
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

function getTextStyle(
	isItalic: boolean,
	isBold: boolean,
	theme: "dark" | "light",
) {
	if (isBold) {
		return {
			fontFamily: isItalic ? "Inter Medium Italics" : "Inter Medium",
			color: theme === "dark" ? "#ffffff" : "#000",
		};
	}
	return {
		fontStyle: isItalic ? "italic" : "normal",
		fontFamily: isItalic ? "Inter Italics" : "Inter Light",
	};
}

function renderWord(
	word: string,
	lineIndex: number,
	wordIndex: number,
	random: () => number,
	isItalic: boolean,
	isBold: boolean,
	theme: "dark" | "light",
) {
	const hasItalic = word.endsWith("”");
	const hasBold = word.endsWith("{{/bold}}");
	const text = word
		.replace(/\{\{bold\}\}/, "")
		.replace(/\{\{\/bold\}\}/, "")
		.replace("”", "");

	if (isBold || hasBold || isItalic || hasItalic) {
		return (
			<span key={`word-${lineIndex}-${wordIndex}-${random() * 1000}`}>
				<span
					key={`styled-${lineIndex}-${wordIndex}-${random() * 1000}`}
					style={getTextStyle(isItalic || hasItalic, isBold || hasBold, theme)}
				>
					{text}
				</span>
				{hasItalic && (
					<span
						key={`quote-${lineIndex}-${wordIndex}-${random() * 1000}`}
						style={{
							fontStyle: "italic",
							fontFamily: "Inter Italics",
						}}
					>
						”
					</span>
				)}
			</span>
		);
	}

	return (
		<span key={`word-${lineIndex}-${wordIndex}-${random() * 1000}`}>
			<span
				style={{
					fontFamily: "Inter Light",
				}}
			>
				{text}
			</span>
		</span>
	);
}

function BackgroundDecorations({
	random,
	theme,
}: Readonly<{ random: () => number; theme: "dark" | "light" }>) {
	return (
		<>
			{[...Array(20)].map((_, i) => (
				<div
					key={`decoration-${i}-${random() * 1000}`}
					style={{
						position: "absolute",
						width: `${random() * 100 + 50}px`,
						height: `${random() * 100 + 50}px`,
						border: `1px solid ${theme === "dark" ? "#ffffff75" : "#00000075"}`,
						transform: `rotate(${random() * 360}deg) translate(${random() * 1000 - 500}px, ${random() * 600 - 300}px)`,
						opacity: 0.25,
					}}
				/>
			))}
		</>
	);
}

/**
 * @name Writing Image Template
 */
export async function GET(
	request: NextRequest,
	{
		params,
	}: Readonly<{
		params: Promise<{ slug: string }>;
	}>,
) {
	const { slug } = await params;
	const width = request.nextUrl.searchParams.get("width") ?? 1024;
	const height = request.nextUrl.searchParams.get("height") ?? 1024;
	const theme: "dark" | "light" =
		(request.nextUrl.searchParams.get("theme") as "dark" | "light") ?? "dark";

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

		writing = writing
			.replaceAll(">\n", "> \n")
			.replace(
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
				backgroundColor: theme === "dark" ? "#000" : "#fff",
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
			<BackgroundDecorations random={random} theme={theme} />
			<div
				style={{
					backgroundImage: `linear-gradient(to bottom, ${theme === "dark" ? "#ffffff" : "#000000"}, #64748b)`,
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
						color: theme === "dark" ? "#ffffff" : "#000",
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
									theme,
								);
							})}
							{lineIndex < writing.split("\n").length - 1 && "\n"}
						</span>
					))}
				</p>
			</div>
		</div>,
		{
			width: Number(width),
			height: Number(height),
			headers: {
				"Cache-Control": "public, max-age=86400, immutable",
			},
			fonts: Object.entries(await getAllFonts()).map(([fontFamily, font]) => ({
				name: fontFamily,
				data: font,
			})),
		},
	);
}

export async function generateStaticParams() {
	const writings = await getAllWriting();

	return writings.map((writing) => ({
		slug: writing.slug,
	}));
}
