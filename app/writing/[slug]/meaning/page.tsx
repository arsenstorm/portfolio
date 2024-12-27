// Next
import { notFound } from "next/navigation";

// Design
import { EscapeTitle } from "@/components/design/escape";
import WritingPageClient from "../page.client";

// Utils
import { readWriting } from "@/mdx/compile";
import { getAllWriting } from "@/utils/get-all-writing";

export default async function MeaningPage({
	params,
}: Readonly<{
	params: Promise<{ slug: string }>;
}>) {
	const { slug } = await params;
	const [writings] = await Promise.all([getAllWriting()]);

	const index = writings.findIndex((w) => w.slug === slug);

	const writing = writings[index];

	if (!writing) {
		return notFound();
	}

	const markdown =
		((await readWriting(writing.slug)) ?? "")
			.replace(/---[\s\S]*?---\s*/, "")
			.split(/---\s*/)[1] ??
		`I haven’t written about the meaning of **${writing?.title ?? "Untitled."}** yet.`;

	return (
		<main className="prose dark:prose-invert">
			<EscapeTitle
				title={`The meaning of ${writing?.title ?? "Untitled."}`}
				//audioUrl={`/writing/${slug}/meaning/audio`} // TODO: Add audio for the meaning
				extraLink={`/writing/${slug}`}
				extraLinkHint={{
					action: "Go back to",
					this: writing?.title ?? "Untitled.",
				}}
			/>
			<WritingPageClient markdown={markdown} />
		</main>
	);
}

export async function generateStaticParams() {
	const writings = await getAllWriting();

	return writings.map((writing) => ({
		slug: writing.slug,
	}));
}
