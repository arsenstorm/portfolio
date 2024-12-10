// UI
import clsx from "clsx";
import { Button } from "@/components/ui/button";

// Utils
import { formatDate } from "@/utils/format-date";
import { getAllWriting } from "@/utils/get-all-writing";

// MDX
import WritingsPage, { readWriting } from "@/mdx/compile";

// Types
import type { Metadata } from "next";
import { EscapeTitle } from "@/components/design/escape";

// Hotkeys
import { Hotkeys } from "@/components/hotkeys/writings";

export async function generateStaticParams() {
	const writings = await getAllWriting();

	return writings.map((writing) => ({
		slug: writing.slug,
	}));
}

export async function generateMetadata({
	params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const [writings] = await Promise.all([getAllWriting()]);

	const { slug } = await params;

	const writing = writings.find((w) => w.slug === slug);

	if (!writing) {
		return {};
	}

	let content: string | null = (
		(await readWriting(writing.slug)) ?? ""
	).replace(/---[\s\S]*?---\s*/, "");

	const regex = /^[^.!?]*[.!?]/;
	const match = regex.exec(content);
	content = match ? match[0] : content;

	if (content.startsWith(">")) {
		content = content.slice(1).trim();
	}

	content = content.replace(/\[/g, "").replace(/\]/g, "");

	if (content.trim() === "") {
		content = null;
	}

	return {
		title: writing?.title,
		openGraph: {
			type: "website",
			url: `https://arsenstorm.com/writing/${writing?.slug}`,
			description:
				content ?? "I’m Arsen, a builder, philosopher, and tinkerer.",
			siteName: "Arsen Shkrumelyak",
			images: [
				{
					url: `/og/writing/?title=${encodeURIComponent(writing?.title)}&date=${encodeURIComponent(
						formatDate(writing?.date),
					)}`,
					width: 1200,
					height: 630,
				},
			],
		},
	};
}

export default async function WritingPage({
	params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
	const { slug } = await params;
	const [writings] = await Promise.all([getAllWriting()]);

	const index = writings.findIndex((w) => w.slug === slug);

	const previous = writings?.[index - 1]?.slug;
	const next = writings?.[index + 1]?.slug;
	const writing = writings[index];

	const content = await WritingsPage({ slug });

	return (
		<>
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
				<EscapeTitle title={writing?.title ?? "Untitled."} />
				{content}
			</main>
			<footer className="max-w-2xl mx-auto fixed bottom-0 left-0 right-0 px-4 py-8 flex flex-row justify-between items-center z-20 !animate-none !opacity-100">
				<Hotkeys previous={previous} next={next} />
				<Button
					outline
					data-nosnippet
					className="!text-xs !bg-white/50 dark:!bg-zinc-950/50"
					disabled={!previous}
					href={previous ? `/writing/${previous}` : undefined}
				>
					&larr; Previous
				</Button>
				<Button
					outline
					data-nosnippet
					className="!text-xs !bg-white/50 dark:!bg-zinc-950/50"
					disabled={!next}
					href={next ? `/writing/${next}` : undefined}
				>
					Next &rarr;
				</Button>
			</footer>
		</>
	);
}
