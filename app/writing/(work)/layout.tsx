"use client";

import clsx from "clsx";

export default function WritingLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div
			className={clsx(
				// Animations
				"orchestration",
				// Base
				"prose dark:prose-invert",
				// Headings
				"prose-h1:text-2xl/8 prose-h1:font-semibold prose-h1:text-zinc-950 prose-h1:sm:text-xl/8 prose-h1:dark:text-white",
				// Subheadings
				"prose-h2:text-base/7 prose-h2:font-semibold prose-h2:text-zinc-950 prose-h2:sm:text-sm/6 prose-h2:dark:text-white",
				// Text
				"prose-p:text-base/6 prose-p:text-zinc-500 prose-p:sm:text-sm/6 prose-p:dark:text-zinc-400",
				// Links
				"prose-a:text-zinc-950 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-zinc-950/50 prose-a:data-[hover]:decoration-zinc-950 prose-a:dark:text-white prose-a:dark:decoration-white/50 prose-a:dark:data-[hover]:decoration-white",
				// Strong
				"prose-strong:font-medium prose-strong:text-zinc-950 prose-strong:dark:text-white",
				// Code
				"prose-code:rounded prose-code:border prose-code:border-zinc-950/10 prose-code:bg-zinc-950/[2.5%] prose-code:px-0.5 prose-code:text-sm prose-code:font-medium prose-code:text-zinc-950 prose-code:sm:text-[0.8125rem] prose-code:dark:border-white/20 prose-code:dark:bg-white/5 prose-code:dark:text-white",
				// Blockquotes
				"prose-blockquote:border-l-2 prose-blockquote:border-zinc-300 prose-blockquote:dark:border-zinc-700",
				"prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:font-medium",
				"prose-blockquote:text-zinc-950 dark:prose-blockquote:text-zinc-50",
				// Dividers
				"prose-hr:my-8 prose-hr:border-zinc-950/10 prose-hr:dark:border-white/10",
			)}
		>
			{children}
		</div>
	);
}
