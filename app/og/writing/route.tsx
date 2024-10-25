import { ImageResponse } from "next/og";

import type { NextRequest } from "next/server";

export const runtime = "edge";

const getInterMedium = async () => {
	const response = await fetch(
		new URL("@/fonts/Inter-Medium.ttf", import.meta.url),
	);
	const inter = await response.arrayBuffer();

	return inter;
};

/**
 * @name OG Template
 */
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const title = searchParams.get("title") ?? "";
	const date = searchParams.get("date") ?? "1st of January";

	return new ImageResponse(
		<div
			style={{
				backgroundColor: "#000",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				fontFamily: "Inter Medium",
			}}
		>
			<div
				style={{
					color: "#fafafa",
					fontSize: "72px",
				}}
			>
				{title}
			</div>
			<div
				style={{
					color: "#d4d4d8",
					opacity: 0.5,
					fontSize: "24px",
				}}
			>
				{date}
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			headers: {
				"Cache-Control": "public, max-age=3600, immutable",
			},
			fonts: [
				{
					name: "Inter Medium",
					data: await getInterMedium(),
				},
			],
		},
	);
}