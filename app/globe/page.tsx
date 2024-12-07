// Actions
import { getVisitors } from "@/actions/get-visitors";

// Components
import Globe from "./page.client";

export default async function GlobePage() {
	const { visitors, lastUpdated } = await getVisitors();

	return <Globe visitors={visitors} lastUpdated={lastUpdated} />;
}
