// Components
import Globe from "./page.client";

// Design
import { EscapeTitle } from "@/components/design/escape";
import { Text } from "@/components/ui/text";

// Time
import { formatDistanceToNow } from "date-fns";

// Types
import type { VisitorLog } from "@/app/api/track/route";

export const dynamic = "force-dynamic";

export default async function GlobePage() {
	const url = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: "http://localhost:3000";

	let visitors: VisitorLog[] = [];
	let lastUpdated = 0;

	try {
		const data = await fetch(new URL(`${url}/api/list`)).then((res) =>
			res.json(),
		);
		visitors = data.visitors;
		lastUpdated = data.lastUpdated;
	} catch {
		console.warn("Error fetching data");
		return null;
	}

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
