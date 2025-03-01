"use client";

// UI
import clsx from "clsx";
import { Link } from "@/components/ui/link";
import { Subheading } from "@/components/ui/heading";
import { Code, Strong, Text, TextLink } from "@/components/ui/text";

// Icons
import OpenInNewTab from "@/icons/open-in-new-tab.svg";

// Components
import { Divider } from "@/components/ui/divider";
import { WhereIsLastVisitor } from "./where-is-last-visitor";
import { EmailMe } from "./email-me";
import { VisitorsGlobe } from "./visitors-globe";

// Functions
import { useCommandKey } from "@/utils/get-command-key";

export default function Portfolio({
	lastVisitor,
}: {
	readonly lastVisitor?: string;
}) {
	const { device } = useCommandKey();
	let indexCount = 2;

	return (
		<div className="orchestration flex flex-col gap-y-4">
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
						<li
							key={project.id}
							style={
								{
									"--stagger-index": indexCount,
								} as React.CSSProperties
							}
						>
							<Card className="h-full">
								{project.link ? (
									<Text className="inline-flex items-center">
										<TextLink
											href={project.link}
											target="_blank"
											rel="noopener noreferrer"
											mouse={{ action: "Visit", this: project.title }}
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
						</li>
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
				If you’re fortunate enough to stumble across my site when others are
				around, you’ll see <Strong>everyone else’s</Strong> cursor flying
				around!
			</Text>
			<WhereIsLastVisitor
				lastVisitor={lastVisitor}
				style={
					{
						"--stagger-index": indexCount + 4,
					} as React.CSSProperties
				}
			/>
			<VisitorsGlobe
				style={
					{
						"--stagger-index": indexCount + 5,
					} as React.CSSProperties
				}
			/>
			<EmailMe
				style={
					{
						"--stagger-index": indexCount + 6,
					} as React.CSSProperties
				}
			/>
			<Divider
				className="my-4"
				style={
					{
						"--stagger-index": indexCount + 7,
					} as React.CSSProperties
				}
			/>
			<Subheading
				level={2}
				style={
					{
						"--stagger-index": indexCount + 8,
					} as React.CSSProperties
				}
			>
				Writing
			</Subheading>
			<Text
				style={
					{
						"--stagger-index": indexCount + 9,
					} as React.CSSProperties
				}
			>
				I sometimes write stuff. You can find it{" "}
				<TextLink href="/writing">on this page</TextLink>
				{device === "desktop" ? (
					<>
						{" "}
						or hit{" "}
						<Link
							href="/writing"
							mouse={{ action: "Read", this: "my writings" }}
						>
							<Code>W</Code>
						</Link>
					</>
				) : null}
				.
			</Text>
			<Divider
				className="my-4"
				style={
					{
						"--stagger-index": indexCount + 10,
					} as React.CSSProperties
				}
			/>
			<Subheading
				level={2}
				style={
					{
						"--stagger-index": indexCount + 11,
					} as React.CSSProperties
				}
			>
				Connect
			</Subheading>
			<Text
				style={
					{
						"--stagger-index": indexCount + 12,
					} as React.CSSProperties
				}
			>
				I’m on{" "}
				<TextLink
					href="https://twitter.com/arsenstorm"
					target="_blank"
					rel="noopener noreferrer"
					mouse={{ action: "Connect", this: "on Twitter" }}
				>
					Twitter
				</TextLink>{" "}
				and{" "}
				<TextLink
					href="https://www.linkedin.com/in/arsenstorm"
					target="_blank"
					rel="noopener noreferrer"
					mouse={{ action: "Connect", this: "on LinkedIn" }}
				>
					LinkedIn
				</TextLink>
				.
			</Text>
		</div>
	);
}

function Card({
	children,
	className,
	...props
}: {
	readonly children: React.ReactNode;
	readonly className?: string;
	readonly style?: React.CSSProperties;
}): JSX.Element {
	return (
		<div
			className={clsx(
				"bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg",
				"ring-2 ring-zinc-200 dark:ring-zinc-800",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

const intro = [
	<Text key="1">
		<Strong>I’m Arsen.</Strong> I build products to{" "}
		<span className="italic">dominate</span> the market and <Code>help</Code>{" "}
		people.
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
		link: "https://amazonomics.com",
	},
	{
		id: 6,
		title: "Sotsial",
		description: "API-first content publishing.",
		link: "https://sotsial.com",
	},
	{
		id: 7,
		title: "Threat Intelligence",
		description: "Monitoring terrorism around the world.",
		link: "https://terrorwatch.org",
	},
	{
		id: 8,
		title: "Community Notes",
		description: "Tackling misinformation via the community.",
		link: "https://communitynotes.dev",
	},
	{
		id: 9,
		title: "Rosel",
		description: "A helpful voice assistant for the web.",
	},
];
