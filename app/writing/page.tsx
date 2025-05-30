// UI
import { Divider } from "@/components/ui/divider";
import { Code, Strong, Text, TextLink } from "@/components/ui/text";

// Utils
import { formatDate } from "@/utils/format-date";
import { getAllWriting } from "@/utils/get-all-writing";

// Types
import type { Metadata } from "next";
import { metadata as layoutMetadata } from "@/app/layout";

// Components
import { EscapeTitle } from "@/components/design/escape";

export const metadata: Metadata = {
	title: "Writing",
	openGraph: {
		...layoutMetadata.openGraph,
		url: "https://arsenstorm.com/writing",
	},
};

function WritingItem({
	slug,
	title,
	date,
	index,
}: Readonly<{ slug: string; title: string; date: string; index: number }>) {
	return (
		<div
			style={{ "--stagger-index": index } as React.CSSProperties}
			className="!my-0 flex items-center"
		>
			<Text>
				<TextLink
					href={`/writing/${slug}`}
					mouse={{ writing: title, writingId: slug }}
				>
					{title}
				</TextLink>
			</Text>

			<span className="flex-grow mx-4 border-dotted border-t border-zinc-200 dark:border-zinc-900" />

			<Text className="font-mono">
				<time dateTime={date}>{formatDate(date)}</time>
			</Text>
		</div>
	);
}

export default async function WritingPage() {
	const writings = await getAllWriting();

	return (
		<>
			<EscapeTitle title="I write stuff." />
			<Text
				style={
					{
						"--stagger-index": 2,
					} as React.CSSProperties
				}
			>
				I write when I’m <Code>bored</Code>.
			</Text>
			<Text
				style={
					{
						"--stagger-index": 3,
					} as React.CSSProperties
				}
			>
				Otherwise, I’m <Strong>building</Strong> cool stuff.
			</Text>
			<Divider
				className="my-4"
				style={
					{
						"--stagger-index": 4,
					} as React.CSSProperties
				}
			/>
			<div className="flex flex-col orchestration gap-y-4 mt-2">
				{writings.map((item, index) => (
					<WritingItem
						key={item.slug}
						slug={item.slug}
						title={item.title}
						date={item.date}
						index={index + 5}
					/>
				))}
			</div>
		</>
	);
}
