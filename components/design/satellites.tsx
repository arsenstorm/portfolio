"use client";

// Components
import { Orbit, Satellite } from "@/components/ui/frost/orbit";

export function Satellites({ index }: { readonly index: number }) {
	return (
		<div
			className="relative h-[300px] w-[300px] flex items-center justify-center mx-auto"
			style={{ "--stagger-index": index } as React.CSSProperties}
		>
			<Orbit className="absolute h-[300px] w-[100px] rounded-full rotate-[0deg]">
				<Satellite
					duration={18000}
					direction="counterclockwise"
					className="bg-[rgb(167,139,250)] w-[300px] h-[300px] rounded-full opacity-40 blur-[56px]"
				/>
			</Orbit>
			<Orbit className="absolute h-[300px] w-[100px] rounded-full rotate-[60deg]">
				<Satellite
					duration={25000}
					className="bg-[rgb(251,146,60)] w-[300px] h-[300px] rounded-full opacity-40 blur-[56px]"
				/>
			</Orbit>
			<Orbit className="absolute h-[300px] w-[100px] rounded-full rotate-[-60deg]">
				<Satellite
					duration={32000}
					className="bg-[rgb(236,72,153)] w-[300px] h-[300px] rounded-full opacity-40 blur-[56px]"
				/>
			</Orbit>
		</div>
	);
}
