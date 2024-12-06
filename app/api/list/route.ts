import { NextResponse } from "next/server";
import { getVisitors } from "@/actions/get-visitors";

export async function GET() {
	const visitors = await getVisitors();

	return NextResponse.json(visitors ?? []);
}
