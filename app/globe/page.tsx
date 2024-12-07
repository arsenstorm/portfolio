// Actions
import { getVisitors } from "@/actions/get-visitors";

// Components
import Globe from "./page.client";

// Design
import { EscapeTitle } from "@/components/design/escape";
import { Text } from "@/components/ui/text";

// Time
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function GlobePage() {
	const { visitors, lastUpdated } = await getVisitors();

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
