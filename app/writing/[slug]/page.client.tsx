"use client";

// Markdown
import Markdown from "react-markdown";
import rehypeStagger from "@/mdx/rehype.mjs";

// React
import type { ComponentProps } from "react";

// Components
import { Link } from "next-view-transitions";

export const MDXLink = ({ href, ...props }: ComponentProps<"a">) => {
	return <Link href={href ?? "#"} {...props} />;
};

export default function WritingPageClient({
	markdown,
}: Readonly<{
	markdown: string;
}>) {
	return (
		<Markdown
			rehypePlugins={[rehypeStagger]}
			components={{
				a: MDXLink,
			}}
		>
			{markdown}
		</Markdown>
	);
}
