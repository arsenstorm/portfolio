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

export type ImportWritingOption = "writings" | "writings-future";

async function importWriting(filename: string, type?: ImportWritingOption) {
	const filePath = path.join(process.cwd(), type ?? "writings", filename);
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
	const [writingFilenames, futureWritingFilenames] = await Promise.all([
		glob("*.mdx", { cwd: "./writings" }),
		process.env.NODE_ENV === "production"
			? []
			: glob("*.mdx", { cwd: "./writings-future" }),
	]);

	let writings = await Promise.all([
		...writingFilenames.map((filename) => importWriting(filename)),
		...(process.env.NODE_ENV === "production"
			? []
			: futureWritingFilenames.map((filename) =>
					importWriting(filename, "writings-future"),
				)),
	]);

	writings = writings.filter((writing) => writing.slug !== "template");

	writings = writings.sort((a, z) => +new Date(z.date) - +new Date(a.date));

	return writings;
}
