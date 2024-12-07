import * as React from "react";
import {
	type HTMLMotionProps,
	type MotionValue,
	motion,
	useAnimationFrame,
	useMotionTemplate,
	useMotionValue,
	useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/utils/cn";

interface OrbitContextApi {
	orbitRef: React.RefObject<SVGRectElement>;
}

const OrbitContext = React.createContext<OrbitContextApi | null>(null);

const useOrbit = () => {
	const orbit = React.useContext(OrbitContext);
	if (!orbit) {
		throw new Error("Cannot call useOrbit outside of Orbit");
	}
	return orbit;
};

export interface OrbitProps extends HTMLMotionProps<"div"> {
	children: React.ReactNode;
}

export const Orbit = ({ children, ...props }: OrbitProps) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const pathRef = useRef<SVGRectElement>(null);

	const [orbitRadius, setOrbitRadius] = React.useState("0px");

	const orbitRef = React.useMemo(() => ({ orbitRef: pathRef }), []);

	React.useEffect(() => {
		const r = getComputedStyle(svgRef.current!).getPropertyValue(
			"border-radius",
		);
		setOrbitRadius(r);
	}, []);

	return (
		<OrbitContext.Provider value={orbitRef}>
			<motion.div {...props} className={cn("relative", props.className)}>
				<svg
					ref={svgRef}
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
					style={{
						position: "absolute",
						width: "100%",
						height: "100%",
						borderRadius: "inherit",
					}}
				>
					<title>{/* Orbit */}</title>
					<rect
						ref={pathRef}
						rx={orbitRadius}
						ry={orbitRadius}
						fill="none"
						width="100%"
						height="100%"
					/>
				</svg>
				{children}
			</motion.div>
		</OrbitContext.Provider>
	);
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

export interface SatelliteProps extends HTMLMotionProps<"div"> {
	// Position in degrees around the orbit. 360 degrees is one full revolution.
	duration?: number;
	direction?: "clockwise" | "counterclockwise";
	position?: number | MotionValue<number>;
}

export const Satellite = ({
	position = 0,
	duration = 10000,
	direction = "clockwise",
	...props
}: SatelliteProps) => {
	const orbit = useOrbit();
	const progress = useMotionValue(0);
	const [ready, setReady] = React.useState(false);

	React.useEffect(() => {
		// this timeout is required for Firefox to have a path length ready
		setTimeout(() => {
			setReady(true);
		}, 0);
	}, []);

	useAnimationFrame((time) => {
		const length = orbit.orbitRef.current?.getTotalLength();
		if (length) {
			const pxPerMillisecond = length / duration;
			const directionMultiplier = direction === "counterclockwise" ? -1 : 1;
			progress.set(mod(directionMultiplier * time * pxPerMillisecond, length));
		}
	});

	const x = useTransform(
		progress,
		(val) => orbit.orbitRef.current?.getPointAtLength(val).x,
	);
	const y = useTransform(
		progress,
		(val) => orbit.orbitRef.current?.getPointAtLength(val).y,
	);

	const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

	return (
		<motion.div
			{...props}
			style={{
				transform,
				visibility: ready ? "visible" : "hidden",
				...props.style,
			}}
			className={cn("absolute top-0 left-0 inline-block", props.className)}
		/>
	);
};
