"use client";

// React
import { useEffect, useRef } from "react";

// Globe
import createGlobe from "cobe";
import { useSpring } from "react-spring";

// Hooks
import { useTheme } from "next-themes";

// Types
import type { VisitorLog } from "@/app/api/track/route";

export default function Globe({
	visitors,
	lastUpdated,
}: {
	readonly visitors: VisitorLog[];
	readonly lastUpdated: number;
}) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pointerInteracting = useRef<number | null>(null);
	const pointerInteractionMovement = useRef(0);
	const [{ r }, api] = useSpring(() => ({
		r: 0,
		config: {
			mass: 1,
			tension: 280,
			friction: 40,
			precision: 0.001,
		},
	}));

	const { resolvedTheme } = useTheme();

	useEffect(() => {
		let width = 0;
		const onResize = () => {
			if (canvasRef.current) {
				width = canvasRef.current.offsetWidth;
			}
		};
		window.addEventListener("resize", onResize);
		onResize();

		let rotation = 0;
		if (!canvasRef.current) return;

		const globe = createGlobe(canvasRef.current, {
			devicePixelRatio: 2,
			width: width * 2,
			height: width * 2,
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
							location: [visitor.latitude, visitor.longitude],
							size: 0.05,
						}))
					: [],
			onRender: (state) => {
				if (!pointerInteracting.current) {
					rotation += 0.005;
				}
				state.phi = rotation + r.get();
				state.width = width * 2;
				state.height = width * 2;
			},
		});

		setTimeout(() => {
			if (canvasRef.current) canvasRef.current.style.opacity = "1";
		}, 100);

		return () => {
			globe.destroy();
			window.removeEventListener("resize", onResize);
		};
	}, [visitors, resolvedTheme, r.get]);

	return (
		<div className="relative mx-auto aspect-square w-full max-w-[600px]">
			<canvas
				ref={canvasRef}
				onPointerDown={(e) => {
					pointerInteracting.current =
						e.clientX - pointerInteractionMovement.current;
					if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
				}}
				onPointerUp={() => {
					pointerInteracting.current = null;
					if (canvasRef.current) canvasRef.current.style.cursor = "grab";
				}}
				onPointerOut={() => {
					pointerInteracting.current = null;
					if (canvasRef.current) canvasRef.current.style.cursor = "grab";
				}}
				onMouseMove={(e) => {
					if (pointerInteracting.current !== null) {
						const delta = e.clientX - pointerInteracting.current;
						pointerInteractionMovement.current = delta;
						api.start({
							r: delta / 200,
						});
					}
				}}
				onTouchMove={(e) => {
					if (pointerInteracting.current !== null && e.touches[0]) {
						const delta = e.touches[0].clientX - pointerInteracting.current;
						pointerInteractionMovement.current = delta;
						api.start({
							r: delta / 100,
						});
					}
				}}
				style={
					{
						width: "100%",
						height: "100%",
						cursor: "grab",
						contain: "layout paint size",
						opacity: 0,
						transition: "opacity 1s ease",
						"--stagger-index": 2,
					} as React.CSSProperties
				}
			/>
		</div>
	);
}
