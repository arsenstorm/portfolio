// Glob
import glob from "fast-glob";

// Node
import path from "node:path";
import { readFile } from "node:fs/promises";

// MDX
import { compileMDX } from "next-mdx-remote/rsc";

export type WritingType = "writing" | "example";

export interface Writing {
	slug: string;
	title: string;
	date: string;
	type: WritingType;
}

async function importWriting(filename: string) {
	const filePath = path.join(process.cwd(), "writings", filename);
	const markdown = await readFile(filePath, { encoding: "utf8" });

	// Parse the file with compileMDX to extract frontmatter
	const { frontmatter } = await compileMDX({
		source: markdown,
		options: { parseFrontmatter: true },
	});

	return {
		slug: filename.replace(/(\/page)?\.mdx$/, ""),
		...frontmatter,
		type: frontmatter?.type ?? "writing",
	} as Writing;
}

export async function getAllWriting() {
	const writingFilenames = await glob("*.mdx", {
		cwd: "./writings",
	});

	let writings = await Promise.all(writingFilenames.map(importWriting));

	writings = writings.filter((writing) => writing.slug !== "template");

	writings = writings.sort((a, z) => +new Date(z.date) - +new Date(a.date));

	return writings;
}
