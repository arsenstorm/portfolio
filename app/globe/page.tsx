// Components
import Globe from "./page.client";

// Design
import { EscapeTitle } from "@/components/design/escape";
import { Text } from "@/components/ui/text";

// Time
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function GlobePage() {
	const url = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: "http://localhost:3000";

	const { visitors = [], lastUpdated = Date.now() - 10000 } = await fetch(
		new URL(`${url}/api/list`),
		{ cache: "no-cache", next: { revalidate: 3600 } },
	).then((res) => res.json());

	return (
		<div className="orchestration">
			<EscapeTitle title="The Globe." />
			<Globe visitors={visitors} lastUpdated={lastUpdated} />
			<Text
				className="text-center"
				style={
					{
						"--stagger-index": 3,
					} as React.CSSProperties
				}
			>
				A globe of visitors from around the world.
			</Text>
			<p
				className="text-center text-xs text-zinc-500/50 dark:text-zinc-400/50"
				style={{ "--stagger-index": 4 } as React.CSSProperties}
			>
				Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
			</p>
		</div>
	);
}
