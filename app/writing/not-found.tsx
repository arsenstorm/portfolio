// Design
import { EscapeTitle } from "@/components/design/escape";

// UI
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import clsx from "clsx";

export default function NotFound() {
	return (
		<main
			className={clsx(
				// Animations
				"orchestration",
				// Remove gap
				"-mt-4",
				// Base
				"prose dark:prose-invert",
				// Headings
				"prose-h1:text-2xl/8 prose-h1:font-semibold prose-h1:text-zinc-950 prose-h1:sm:text-xl/8 prose-h1:dark:text-white",
				// Subheadings
				"prose-h2:text-base/7 prose-h2:font-semibold prose-h2:text-zinc-950 prose-h2:sm:text-sm/6 prose-h2:dark:text-white",
				// Text
				"prose-p:text-base/6 prose-p:text-zinc-500 prose-p:sm:text-sm/6 prose-p:dark:text-zinc-400",
				// Links
				"prose-a:text-zinc-950 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-zinc-950/50",
				"prose-a:data-[hover]:decoration-zinc-950 prose-a:dark:text-white prose-a:dark:decoration-white/50 prose-a:dark:data-[hover]:decoration-white",
				// Strong
				"prose-strong:font-medium prose-strong:text-zinc-950 prose-strong:dark:text-white",
				// Code
				"prose-code:rounded prose-code:border prose-code:border-zinc-950/10 prose-code:bg-zinc-950/[2.5%]",
				"prose-code:px-0.5 prose-code:text-sm prose-code:font-medium prose-code:text-zinc-950 prose-code:sm:text-[0.8125rem]",
				"prose-code:dark:border-white/20 prose-code:dark:bg-white/5 prose-code:dark:text-white",
				// Blockquotes
				"prose-blockquote:border-l-0 prose-blockquote:pl-0",
				"prose-blockquote:italic prose-blockquote:font-medium",
				"prose-blockquote:text-zinc-950 dark:prose-blockquote:text-zinc-50",
				// Dividers
				"prose-hr:my-8 prose-hr:border-zinc-950/10 prose-hr:dark:border-white/10",
			)}
		>
			<EscapeTitle title="Not Found." />
			<Text
				style={
					{
						"--stagger-index": 2,
					} as React.CSSProperties
				}
			>
				Well, this is <strong>awkward</strong>.
			</Text>
			<Text
				style={
					{
						"--stagger-index": 3,
					} as React.CSSProperties
				}
			>
				You’re probably lost... especially if you’ve got a{" "}
				<strong>time machine</strong>!
			</Text>
			<Text
				style={
					{
						"--stagger-index": 4,
					} as React.CSSProperties
				}
			>
				<Link href="/writing">See what I’ve written</Link>
			</Text>
		</main>
	);
}