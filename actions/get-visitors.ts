import type { VisitorLog } from "@/app/api/track/route";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export async function getVisitors(): Promise<{
	visitors: VisitorLog[];
	lastUpdated: number;
}> {
	const visitors = (await kv.get("visitors")) as VisitorLog[];
	return { visitors: visitors ?? [], lastUpdated: Date.now() };
}
