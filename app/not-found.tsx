"use client";

// Components
import { Orbit, Satellite } from "@/components/ui/frost/orbit";

// UI
import clsx from "clsx";
import { Link } from "@/components/ui/link";

export default function NotFound() {
	let indexCount = 2;

	return (
		<main
			className={clsx(
				// Animations
				"orchestration",
				// Base
				"prose dark:prose-invert text-center",
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
				// Images
				"prose-img:mx-auto prose-img:w-1/2 prose-img:rounded-2xl prose-img:shadow-2xl",
			)}
		>
			<div className="relative h-[300px] w-[300px] flex items-center justify-center mx-auto">
				<Orbit className="absolute h-[300px] w-[100px] rounded-full rotate-[0deg]">
					<Satellite
						duration={18000}
						direction="counterclockwise"
						className="bg-[rgb(167,139,250)] w-[300px] h-[300px] rounded-full opacity-40 blur-[56px]"
					/>
				</Orbit>
				<Orbit className="absolute h-[300px] w-[100px] rounded-full rotate-[60deg]">
					<Satellite
						duration={25000}
						className="bg-[rgb(251,146,60)] w-[300px] h-[300px] rounded-full opacity-40 blur-[56px]"
					/>
				</Orbit>
				<Orbit className="absolute h-[300px] w-[100px] rounded-full rotate-[-60deg]">
					<Satellite
						duration={32000}
						className="bg-[rgb(236,72,153)] w-[300px] h-[300px] rounded-full opacity-40 blur-[56px]"
					/>
				</Orbit>
			</div>
			<p style={{ "--stagger-index": indexCount++ } as React.CSSProperties}>
				So it seems you’re an adventurer.
			</p>
			<p style={{ "--stagger-index": indexCount++ } as React.CSSProperties}>
				You’ve come to a place that doesn’t exist.
			</p>
			<p style={{ "--stagger-index": indexCount++ } as React.CSSProperties}>
				Perhaps I can entice you to visit <Link href="/globe">the globe</Link>?
			</p>
			<p style={{ "--stagger-index": indexCount++ } as React.CSSProperties}>
				Or perhaps some of <Link href="/writing">my writings</Link>?
			</p>
			<p style={{ "--stagger-index": indexCount++ } as React.CSSProperties}>
				<Link href="/">Go back home.</Link>
			</p>
		</main>
	);
}
