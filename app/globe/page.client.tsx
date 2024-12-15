"use client";

// React
import { useEffect, useRef, useState } from "react";

// Globe
import createGlobe from "cobe";
import { useSpring } from "react-spring";

// Hooks
import { useTheme } from "next-themes";

// Types
import type { VisitorLog } from "@/app/api/track/route";

// Components
import { Text } from "@/components/ui/text";

// Time
import { formatDistanceToNow } from "date-fns";
import { EscapeTitle } from "@/components/design/escape";

export default function GlobeClient() {
	const [data, setData] = useState<{
		visitors: VisitorLog[];
		lastUpdated: number;
	}>({
		visitors: [],
		lastUpdated: Date.now() - 10000,
	});

	useEffect(() => {
		fetch("/api/list")
			.then((res) => res.json())
			.then((data) => setData(data));
	}, []);

	return (
		<div className="orchestration">
			<EscapeTitle title="The Globe." />
			<Globe visitors={data.visitors} />
			<Text
				className="text-center"
				style={
					{
						"--stagger-index": 3,
					} as React.CSSProperties
				}
			>
				A globe of visitors from around the world.
			</Text>
			<p
				className="text-center text-xs text-zinc-500/50 dark:text-zinc-400/50"
				style={{ "--stagger-index": 4 } as React.CSSProperties}
			>
				Last updated{" "}
				{formatDistanceToNow(data.lastUpdated, { addSuffix: true })}
			</p>
		</div>
	);
}

export function Globe({
	visitors,
}: {
	readonly visitors: VisitorLog[];
}) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pointerInteracting = useRef<number | null>(null);
	const pointerInteractionMovement = useRef(0);
	const rotationRef = useRef(0);
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
					rotationRef.current += 0.005;
				}
				state.phi = rotationRef.current + r.get();
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
	}, [visitors, resolvedTheme, r]);

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
