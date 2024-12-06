import type { VisitorLog } from "@/app/api/track/route";
import { kv } from "@vercel/kv";

export async function getVisitors(): Promise<VisitorLog[]> {
	const visitors = (await kv.get("visitors")) as VisitorLog[];
	return visitors ?? [];
}
