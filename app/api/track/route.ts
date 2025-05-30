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

async function determineVisitorLocation(
	headers: Headers,
	regionNames: Intl.DisplayNames,
	defaultUnknown: string,
) {
	const countryCode = headers.get("x-vercel-ip-country") ?? "";
	const city = headers.get("x-vercel-ip-city") ?? "";
	const countryName = regionNames.of(countryCode);

	if (city && countryCode) {
		return `${city}, ${countryName}`;
	}
	if (!city && countryCode) {
		return `Somewhere in ${["GB", "US", "AE"].includes(countryCode) ? "the " : ""}${countryName}`;
	}
	return defaultUnknown;
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

	const setLastVisitor = await determineVisitorLocation(
		_headers,
		regionNames,
		defaultUnknown,
	);
	const lastVisitor = (await kv.get("last-visitor")) ?? defaultUnknown;
	let visitors: VisitorLog[] = [];

	await kv.set("last-visitor", setLastVisitor);

	if (ip !== "") {
		console.warn("IP is not empty", ip);
		// Set last visitor
		await kv.set("last-visitor", setLastVisitor);

		// get the latitude and longitude by ip address
		visitors = ((await kv.get("visitors")) as VisitorLog[]) ?? [];

		const { latitude, longitude } = await getLocation(setLastVisitor);

		if (latitude && longitude) {
			const newVisitor: VisitorLog = {
				location: setLastVisitor,
				timestamp: new Date().toISOString(),
				latitude,
				longitude,
			};

			visitors.unshift(newVisitor);

			// remove duplicates by location
			const uniqueVisitors = new Set();
			visitors = visitors.filter((visitor) => {
				const decodedLocation = decodeURIComponent(visitor.location);
				if (uniqueVisitors.has(decodedLocation)) return false;
				uniqueVisitors.add(decodedLocation);
				return true;
			});

			// limit to 500 visitors
			if (visitors.length > 500) visitors.length = 500;

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

async function getLocation(location: string) {
	const response = await fetch(
		`https://api.geoapify.com/v1/geocode/search?text=${location}&apiKey=${process.env.GEOAPIFY_API_KEY}`,
	);
	const data = await response.json();
	return {
		latitude: data.features[0].properties.lat,
		longitude: data.features[0].properties.lon,
	};
}
