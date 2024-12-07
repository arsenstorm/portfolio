// Next
import { NextResponse } from "next/server";

// Vercel
import { kv } from "@vercel/kv";

// Types
import type { VisitorLog } from "@/app/api/track/route";

export async function GET() {
	const visitors = (await kv.get("visitors")) as VisitorLog[];

	return NextResponse.json(
		{
			visitors: visitors ?? [],
			lastUpdated: Date.now() - 10000,
		},
		{
			headers: {
				"Cache-Control": "public, max-age=1800, stale-while-revalidate=3600",
			},
		},
	);
}
