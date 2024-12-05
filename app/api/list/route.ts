import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET() {
	const visitors = await kv.get("visitors");

	return NextResponse.json(visitors);
}
