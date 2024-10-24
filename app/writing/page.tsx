// UI
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text, TextLink } from "@/components/ui/text";

// Utils
import { getAllWriting } from "@/utils/get-all-writing";

function WritingItem({
	href,
	title,
	index,
}: Readonly<{ href: string; title: string; index: number }>) {
	return (
		<Text
			style={{ "--stagger-index": index } as React.CSSProperties}
			className="!my-0"
		>
			<TextLink href={href}>{title}</TextLink>
		</Text>
	);
}

export default async function WritingPage() {
	const writings = await getAllWriting();

	return (
		<div className="orchestration flex flex-col">
			<Heading
				style={
					{
						"--stagger-index": 1,
					} as React.CSSProperties
				}
			>
				I write stuff.
			</Heading>
			<Text
				style={
					{
						"--stagger-index": 2,
					} as React.CSSProperties
				}
			>
				I do it when I get bored—otherwise, I’m building cool stuff.
			</Text>
			<Divider
				className="my-4"
				style={
					{
						"--stagger-index": 3,
					} as React.CSSProperties
				}
			/>
			<div className="flex flex-col orchestration gap-y-4 mt-2">
				{writings.map((item, index) => (
					<WritingItem
						key={item.slug}
						href={`/writing/${item.slug}`}
						title={item.title}
						index={index + 4}
					/>
				))}
			</div>
		</div>
	);
}
