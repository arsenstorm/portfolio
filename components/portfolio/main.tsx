"use client";

import { Heading, Subheading } from "@/components/ui/heading";
import { Code, Strong, Text, TextLink } from "@/components/ui/text";
import clsx from "clsx";

import OpenInNewTab from "@/icons/open-in-new-tab.svg";
import { Divider } from "@/components/ui/divider";
import { WhereIsLastVisitor } from "./where-is-last-visitor";
import { EmailMe } from "./email-me";

export default function Portfolio({
	lastVisitor,
}: {
	readonly lastVisitor?: string;
}) {
	let indexCount = 0;

	return (
		<div className="orchestration flex flex-col gap-y-4">
			<Heading>Arsen Shkrumelyak</Heading>
			<Divider className="my-4" />
			{intro.map((item) => {
				indexCount++;

				return (
					<div
						key={item.key}
						style={
							{
								"--stagger-index": indexCount,
							} as React.CSSProperties
						}
					>
						{item}
					</div>
				);
			})}
			<Divider
				className="my-4"
				style={
					{
						"--stagger-index": indexCount + 1,
					} as React.CSSProperties
				}
			/>
			<Subheading
				level={2}
				style={
					{
						"--stagger-index": indexCount + 2,
					} as React.CSSProperties
				}
			>
				Building
			</Subheading>
			<Text
				style={
					{
						"--stagger-index": indexCount + 3,
					} as React.CSSProperties
				}
			>
				I build a lot of things; here’s a few:
			</Text>
			<ul
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 orchestration"
				style={
					{
						"--stagger-index": indexCount + 4,
					} as React.CSSProperties
				}
			>
				{projects.map((project) => {
					indexCount++;

					return (
						<Card
							key={project.id}
							style={
								{
									"--stagger-index": indexCount,
								} as React.CSSProperties
							}
						>
							{project.link ? (
								<Text className="inline-flex items-center">
									<TextLink
										href={project.link}
										target="_blank"
										rel="noopener noreferrer"
										className="underline"
									>
										{project.title}
									</TextLink>
									<OpenInNewTab className="size-4 ml-1" />
								</Text>
							) : (
								<Text>
									<Strong>{project.title}</Strong>
								</Text>
							)}
							<Text>{project.description}</Text>
						</Card>
					);
				})}
			</ul>
			<Divider
				className="my-4"
				style={
					{
						"--stagger-index": indexCount + 1,
					} as React.CSSProperties
				}
			/>
			<Subheading
				level={2}
				style={
					{
						"--stagger-index": indexCount + 2,
					} as React.CSSProperties
				}
			>
				Experiments
			</Subheading>
			<Text
				style={
					{
						"--stagger-index": indexCount + 3,
					} as React.CSSProperties
				}
			>
				If you’re unfortunate enough to stumble across my site when no one is
				around, you’ll only see one cursor—<Strong>yours</Strong>. Otherwise,
				you’ll see <Strong>everyone</Strong> else’s (and they’ll see yours)!
			</Text>
			<WhereIsLastVisitor
				lastVisitor={lastVisitor}
				style={
					{
						"--stagger-index": indexCount + 4,
					} as React.CSSProperties
				}
			/>
			<EmailMe
				style={
					{
						"--stagger-index": indexCount + 5,
					} as React.CSSProperties
				}
			/>
			<Divider
				className="my-4"
				style={
					{
						"--stagger-index": indexCount + 6,
					} as React.CSSProperties
				}
			/>
			<Subheading
				level={2}
				style={
					{
						"--stagger-index": indexCount + 7,
					} as React.CSSProperties
				}
			>
				Connect
			</Subheading>
			<Text
				style={
					{
						"--stagger-index": indexCount + 8,
					} as React.CSSProperties
				}
			>
				I’m on{" "}
				<TextLink
					href="https://twitter.com/arsenstorm"
					target="_blank"
					rel="noopener noreferrer"
				>
					Twitter
				</TextLink>{" "}
				and{" "}
				<TextLink
					href="https://www.linkedin.com/in/arsenstorm"
					target="_blank"
					rel="noopener noreferrer"
				>
					LinkedIn
				</TextLink>
				.
			</Text>
			<Divider
				className="my-4"
				style={
					{
						"--stagger-index": indexCount + 9,
					} as React.CSSProperties
				}
			/>
			<Subheading
				level={2}
				style={
					{
						"--stagger-index": indexCount + 10,
					} as React.CSSProperties
				}
			>
				Writing
			</Subheading>
			<Text
				style={
					{
						"--stagger-index": indexCount + 11,
					} as React.CSSProperties
				}
			>
				I sometimes write stuff. You can find it{" "}
				<TextLink href="/writing">on this page</TextLink>.
			</Text>
		</div>
	);
}

function Card({
	children,
	...props
}: {
	readonly children: React.ReactNode;
	readonly style?: React.CSSProperties;
}): JSX.Element {
	return (
		<div
			className={clsx(
				"bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg",
				"ring-2 ring-zinc-200 dark:ring-zinc-800",
			)}
			{...props}
		>
			{children}
		</div>
	);
}

const intro = [
	<Text key="1">
		<Strong>I’m Arsen.</Strong> I like to <Code>code</Code>. And I like to build
		things.
	</Text>,
	<Text key="2">
		I live in <Strong>London</Strong>, so if you’re around, you{" "}
		<span className="italic">might</span> see me.
	</Text>,
];

const projects = [
	{
		id: 1,
		title: "Kayle",
		description: "An open-source content moderation platform.",
		link: "https://kayle.ai",
	},
	{
		id: 2,
		title: "Request Directory",
		description: "A curated open-source API directory.",
		link: "https://request.directory",
	},
	{
		id: 3,
		title: "Socrasica",
		description: "Helping students apply to university.",
		link: "https://socrasica.com",
	},
	{
		id: 4,
		title: "NerveRift",
		description: "Connecting the human mind to machine.",
		link: "https://nerverift.com",
	},
	{
		id: 5,
		title: "Amazonomics",
		description: "Sell more on Amazon by seeing the trends.",
		link: "https://beta.amazonomics.com",
	},
	{
		id: 6,
		title: "Rosel",
		description: "A helpful voice assistant for the web.",
	},
];
