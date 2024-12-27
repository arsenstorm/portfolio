// UI
import { Button } from "@/components/ui/button";

// Utils
import { formatDate } from "@/utils/format-date";
import { getAllWriting } from "@/utils/get-all-writing";

// Types
import type { Metadata } from "next";

// Hotkeys
import { Hotkeys } from "@/components/hotkeys/writings";

// Components
import { Text } from "@/components/ui/text";
import { EscapeTitle } from "@/components/design/escape";

// Markdown
import { readWriting } from "@/mdx/compile";
import WritingPageClient from "./page.client";

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

	const previous = writings?.[index + 1]?.slug;
	const next = writings?.[index - 1]?.slug;
	const writing = writings[index];

	const markdown =
		((await readWriting(writing.slug)) ?? "")
			.replace(/---[\s\S]*?---\s*/, "")
			.split(/---\s*/)[0] ?? "";

	return (
		<>
			<main>
				<EscapeTitle
					title={writing?.title ?? "Untitled."}
					audioUrl={`/writing/${slug}/audio`}
					extraLink={`/writing/${slug}/meaning`}
					extraLinkHint={{
						action: "What does this",
						this: "mean?",
					}}
				/>
				<WritingPageClient markdown={markdown} />
			</main>
			<footer className="max-w-2xl mx-auto fixed bottom-0 left-0 right-0 px-4 py-8 flex flex-row justify-between items-center z-20 !animate-none !opacity-100">
				<Hotkeys previous={previous} next={next} />
				<div className="flex flex-row justify-between items-center w-full">
					<Button
						outline
						data-nosnippet
						className="!text-xs !bg-white/50 dark:!bg-zinc-950/50 w-24"
						disabled={!previous}
						href={previous ? `/writing/${previous}` : undefined}
						mouse={{ action: "Previous", this: "writing" }}
					>
						&larr; Previous
					</Button>
					<div className="flex flex-col items-center flex-1 px-4">
						<Text>{writing?.title ?? "Untitled."}</Text>
						<Text className="!text-xs opacity-50">
							{formatDate(writing?.date)}
						</Text>
					</div>
					<Button
						outline
						data-nosnippet
						className="!text-xs !bg-white/50 dark:!bg-zinc-950/50 w-24"
						disabled={!next}
						href={next ? `/writing/${next}` : undefined}
						mouse={{ action: "Next", this: "writing" }}
					>
						Next &rarr;
					</Button>
				</div>
			</footer>
		</>
	);
}
