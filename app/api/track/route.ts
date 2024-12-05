import { ipAddress } from "@vercel/functions";
import { headers } from "next/headers";
import { kv } from "@vercel/kv";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Visitor log storing non-identifiable location data
 * Only stores general location (city/country), timestamp, and approximate coordinates
 * No personal data or precise location information is retained
 */
export interface VisitorLog {
	location: string;
	timestamp: string;
	latitude: number;
	longitude: number;
}

export async function GET(req: NextRequest) {
	const ip = ipAddress(req) ?? "";
	const _headers = await headers();
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
	let visitors: VisitorLog[] = [];

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
		console.warn("IP is not empty", ip);
		// Set last visitor
		await kv.set("last-visitor", setLastVisitor);

		// get the latitude and longitude by ip address
		visitors = ((await kv.get("visitors")) as VisitorLog[]) ?? [];

		const { latitude, longitude } = await getIpLocation(ip);

		if (latitude && longitude) {
			const newVisitor: VisitorLog = {
				location: setLastVisitor,
				timestamp: new Date().toISOString(),
				latitude,
				longitude,
			};

			visitors.unshift(newVisitor);
			if (visitors.length > 100) visitors.length = 100;

			await kv.set("visitors", visitors);
		}
	}

	return NextResponse.json(
		{
			visitors,
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

async function getIpLocation(ip: string) {
	const response = await fetch(`https://ipapi.co/${ip}/json/`);
	const data = await response.json();
	console.log(data);
	return { latitude: data.latitude, longitude: data.longitude };
}
