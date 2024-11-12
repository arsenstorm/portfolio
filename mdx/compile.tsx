// Node
import path from "node:path";
import { readFile, access } from "node:fs/promises";

// MDX
import { compileMDX } from "next-mdx-remote/rsc";

// Next
import { notFound } from "next/navigation";
import rehypeStagger from "./rehype.mjs";
import { Link } from "@/components/ui/link";

// React
import type { ComponentProps } from "react";

export async function readWriting(slug: string) {
	const filePath = path.resolve(
		path.join(process.cwd(), "writings", `${slug}.mdx`),
	);

	try {
		await access(filePath);
	} catch (err) {
		if (process.env.NODE_ENV !== "production") {
			const futureFilePath = path.resolve(
				path.join(process.cwd(), "writings-future", `${slug}.mdx`),
			);

			try {
				await access(futureFilePath);
			} catch (err) {
				return null;
			}

			return await readFile(futureFilePath, { encoding: "utf8" });
		}

		return null;
	}

	return await readFile(filePath, { encoding: "utf8" });
}

const MDXLink = ({ href, ...props }: ComponentProps<"a">) => {
	return <Link href={href ?? "#"} {...props} />;
};

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
		components: {
			a: MDXLink,
		},
	});

	return content;
}
