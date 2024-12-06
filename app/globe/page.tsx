// Types
import type { VisitorLog } from "@/app/api/track/route";

// Actions
import { getVisitors } from "@/actions/get-visitors";

// Components
import Globe from "./page.client";

const filterUniqueLocations = (visitors: VisitorLog[]) =>
	visitors.filter(
		(visitor, index, self) =>
			index === self.findIndex((t) => t.location === visitor.location),
	);

export default async function GlobePage() {
	const visitors = filterUniqueLocations(await getVisitors());

	return <Globe visitors={visitors} />;
}
