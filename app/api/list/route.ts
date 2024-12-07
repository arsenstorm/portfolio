import { NextResponse } from "next/server";
import { getVisitors } from "@/actions/get-visitors";

export async function GET() {
	const visitors = await getVisitors();

	return NextResponse.json(visitors ?? [], {
		headers: {
			"Cache-Control": "public, max-age=1800, stale-while-revalidate=3600",
		},
	});
}
