"use client";

// React
import { useState, useEffect, useRef } from "react";

// Globe
import createGlobe from "cobe";

// Escape
import { EscapeTitle } from "@/components/design/escape";

// Hooks
import { useTheme } from "next-themes";

// Types
import type { VisitorLog } from "@/app/api/track/route";

export default function GlobePage() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const { resolvedTheme } = useTheme();
	const [visitors, setVisitors] = useState<VisitorLog[]>([]);

	useEffect(() => {
		const fetchVisitors = async () => {
			const response = await fetch("/api/list");
			const data = await response.json();
			setVisitors(data.visitors);
		};

		fetchVisitors();
	}, []);

	useEffect(() => {
		let phi = 0;

		if (!canvasRef.current) return;

		const globe = createGlobe(canvasRef.current, {
			devicePixelRatio: 2,
			width: 600 * 2,
			height: 600 * 2,
			phi: 0,
			theta: 0,
			dark: resolvedTheme === "dark" ? 1 : 0,
			diffuse: 1.2,
			mapSamples: 16000,
			mapBrightness: resolvedTheme === "dark" ? 6 : 10,
			baseColor: resolvedTheme === "dark" ? [0.3, 0.3, 0.3] : [0.9, 0.9, 0.9],
			markerColor: [1, 0.5, 0],
			glowColor: [1, 1, 1],
			markers:
				visitors?.length > 0
					? visitors.map((visitor) => ({
							location: [visitor.longitude, visitor.latitude],
							size: 0.05,
						}))
					: [],
			onRender: (state) => {
				// Called on every animation frame.
				// `state` will be an empty object, return updated params.
				state.phi = phi;
				phi += 0.01;
			},
		});

		return () => {
			globe.destroy();
		};
	}, [visitors, resolvedTheme]);

	return (
		<div className="orchestration">
			<EscapeTitle title="The Globe." />
			<canvas
				ref={canvasRef}
				style={
					{
						width: 600,
						height: 600,
						maxWidth: "100%",
						aspectRatio: 1,

						"--stagger-index": 2,
					} as React.CSSProperties
				}
			/>
		</div>
	);
}
