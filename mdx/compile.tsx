// Node
import path from "node:path";
import { readFile, access } from "node:fs/promises";

// MDX
import { compileMDX } from "next-mdx-remote/rsc";

// Next
import { notFound } from "next/navigation";
import rehypeStagger from "./rehype.mjs";

async function readWriting(slug: string) {
	const filePath = path.resolve(
		path.join(process.cwd(), "writings", `${slug}.mdx`),
	);

	try {
		await access(filePath);
	} catch (err) {
		return null;
	}

	return await readFile(filePath, { encoding: "utf8" });
}

export default async function WritingsPage({
	slug,
}: Readonly<{
	slug: string;
}>) {
	const markdown = await readWriting(slug);

	if (!markdown) {
		notFound();
	}

	const { content } = await compileMDX({
		source: markdown,
		options: {
			parseFrontmatter: true,
			mdxOptions: {
				rehypePlugins: [rehypeStagger],
			},
		},
	});

	return content;
}
