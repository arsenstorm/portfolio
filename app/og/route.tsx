import { ImageResponse } from "next/og";

export const runtime = "edge";

const getInterLight = async () => {
	const response = await fetch(
		new URL("@/fonts/Inter-Light.ttf", import.meta.url),
	);
	const inter = await response.arrayBuffer();

	return inter;
};

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
export async function GET() {
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
			}}
		>
			<div
				style={{
					color: "#fafafa",
					fontSize: "72px",
					fontFamily: "Inter Medium",
				}}
			>
				Arsen Shkrumelyak.
			</div>
			<div
				style={{
					color: "#d4d4d8",
					opacity: 0.5,
					fontSize: "24px",
					fontFamily: "Inter Light",
				}}
			>
				I build things.
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
					name: "Inter Light",
					data: await getInterLight(),
				},
				{
					name: "Inter Medium",
					data: await getInterMedium(),
				},
			],
		},
	);
}
