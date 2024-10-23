import { ipAddress } from "@vercel/functions";
import { headers } from "next/headers";
import { kv } from "@vercel/kv";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
	const ip = ipAddress(req) ?? "";
	const _headers = headers();
	const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
	const defaultUnknown = "Somewhere else in the world";

	if (process.env.NODE_ENV === "development") {
		return NextResponse.json({
			lastVisitor: defaultUnknown,
			currentVisitor: defaultUnknown,
		});
	}

	let setLastVisitor = "";
	let lastVisitor = "";

	const countryCode = _headers.get("x-vercel-ip-country") ?? "";
	const city = _headers.get("x-vercel-ip-city") ?? "";
	const countryName = regionNames.of(countryCode);

	if (city && countryCode) {
		setLastVisitor = `${city}, ${countryName}`;
	} else if (!city && countryCode) {
		setLastVisitor = `Somewhere in ${["GB", "US", "AE"].includes(countryCode) ? "the " : ""}${countryName}`;
	} else {
		setLastVisitor = defaultUnknown;
	}

	lastVisitor = (await kv.get("last-visitor")) ?? defaultUnknown;

	await kv.set("last-visitor", setLastVisitor);

	if (ip !== "") {
		console.warn("ip: ", ip, "last-visitor: ", setLastVisitor);
		await kv.set("last-visitor", setLastVisitor);
	}

	return NextResponse.json(
		{
			lastVisitor:
				typeof lastVisitor === "string"
					? decodeURIComponent(lastVisitor)
					: defaultUnknown,
			currentVisitor: decodeURIComponent(setLastVisitor),
		},
		{
			status: 200,
		},
	);
}
