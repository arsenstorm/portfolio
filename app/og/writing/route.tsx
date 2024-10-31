import { ImageResponse } from "next/og";

import type { NextRequest } from "next/server";

export const runtime = "edge";

const getInterMedium = async () => {
	const response = await fetch(
		new URL("@/fonts/Inter-Medium.ttf", import.meta.url),
	);
	return await response.arrayBuffer();
};

function mulberry32(a: number) {
	return () => {
		// biome-ignore lint/style/noParameterAssign: this is fine
		a += 0x6d2b79f5;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function hashCode(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash = hash & hash;
	}
	return hash;
}

/**
 * @name OG Template
 */
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const title = decodeURIComponent(searchParams.get("title") ?? "");
	const date = decodeURIComponent(searchParams.get("date") ?? "1st of January");

	const random = mulberry32(hashCode(title));

	return new ImageResponse(
		<div
			style={{
				backgroundColor: "#000",
				backgroundImage: `radial-gradient(circle at 0% 0%, #ffffff05 0%, transparent 50%),
				                 radial-gradient(circle at 100% 0%, #ffffff05 0%, transparent 50%),
				                 radial-gradient(circle at 100% 100%, #ffffff05 0%, transparent 50%),
				                 radial-gradient(circle at 0% 100%, #ffffff05 0%, transparent 50%)`,
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
				height: "100%",
				fontFamily: "Inter Medium",
				overflow: "hidden",
			}}
		>
			{[...Array(20)].map((_, i) => (
				<div
					key={`decoration-${i}-${random() * 1000}`}
					style={{
						position: "absolute",
						width: `${random() * 100 + 50}px`,
						height: `${random() * 100 + 50}px`,
						border: "1px solid #ffffff30",
						transform: `rotate(${random() * 360}deg) translate(${random() * 1000 - 500}px, ${random() * 600 - 300}px)`,
						opacity: 0.25,
					}}
				/>
			))}
			<div
				style={{
					fontSize: "72px",
					backgroundImage: "linear-gradient(to bottom, #ffffff, #64748b)",
					WebkitBackgroundClip: "text",
					color: "transparent",
					backgroundClip: "text",
				}}
			>
				{title}
			</div>
			<div
				style={{
					backgroundImage: "linear-gradient(to bottom, #ffffff, #9ca3af)",
					WebkitBackgroundClip: "text",
					color: "transparent",
					backgroundClip: "text",
					fontSize: "24px",
					opacity: 0.5,
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
