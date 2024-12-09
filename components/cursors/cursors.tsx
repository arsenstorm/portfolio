"use client";

import { Cursors as InstantCursors } from "@instantdb/react";
import { room } from "./get-cursor-room";
import { useEffect, useState } from "react";
import clsx from "clsx";

// Icons
import CursorPointer from "@/icons/pointer.svg";

// Components
import { Text, TextLink } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";

// Colours
import { type Color, colors, cursorColors } from "./colours";

// Hooks
import { useIdle } from "@mantine/hooks";

// Contexts
import { useVisitor } from "@/components/cursors/visitor-context";

// Mouse
import {
	MouseFollower,
	MouseSmoothing,
	useMouse,
} from "@/components/ui/frost/mouse";
import { motion } from "framer-motion";

// Springs
import { springs } from "@/utils/springs";
import { useCommandKey } from "@/utils/get-command-key";

export function CursorsProvider({
	children,
}: { readonly children: React.ReactNode }) {
	const { currentVisitor } = useVisitor();

	return <Cursors currentVisitor={currentVisitor}>{children}</Cursors>;
}

export function Cursors({
	children,
	currentVisitor = "Unknown",
}: {
	readonly children: React.ReactNode;
	readonly currentVisitor: string;
}) {
	const mouseIdle = useIdle(30000, {
		events: ["mousemove"],
	});

	const [color, setColor] = useState<Color>("red");

	useEffect(() => {
		setColor(colors[Math.floor(Math.random() * colors.length)]);
	}, []);

	room.useSyncPresence({
		location: currentVisitor,
		color,
		idle: mouseIdle,
	});

	return (
		<InstantCursors
			room={room}
			renderCursor={(props) => (
				<CustomCursor
					color={props.presence.color}
					location={props.presence.location}
					hidden={props.presence.idle}
				/>
			)}
		>
			{children}
		</InstantCursors>
	);
}

function CustomCursor({
	location,
	color,
	hidden,
}: Readonly<{
	location: string;
	color: Color;
	hidden: boolean;
}>) {
	return (
		<div className={clsx("relative", hidden && "hidden")}>
			<div className="absolute top-0 left-0">
				<CursorPointer
					className={clsx("size-5 rotate-12", cursorColors[color])}
				/>
			</div>
			<Badge color={color} className="absolute top-2 left-2">
				{location}
			</Badge>
		</div>
	);
}

export function SelfCursor() {
	const { activeTarget } = useMouse();
	const { device } = useCommandKey();

	if (device === "mobile") {
		return null;
	}

	return (
		<MouseSmoothing
			position={{ mass: 0.2, damping: 12 }}
			velocity={{ mass: 0.15, damping: 20 }}
		>
			<MouseFollower className="relative h-[200px] w-[200px] !flex !items-center !justify-center rounded-full">
				<motion.div
					className="absolute bg-black/75 dark:bg-white/75 size-5 rounded-full"
					animate={{ scale: activeTarget ? 1 : 0.33 }}
					transition={springs.slow()}
				/>
				{activeTarget?.data?.writing && (
					<motion.div
						className="absolute ml-80"
						initial={{ opacity: 0 }}
						animate={{ opacity: activeTarget ? 1 : 0 }}
						exit={{ opacity: 0 }}
						transition={springs.xfast()}
					>
						<Text className="w-48">
							Read <TextLink href={"#"}>{activeTarget.data.writing}</TextLink>
						</Text>
					</motion.div>
				)}
				{activeTarget?.data?.action && (
					<motion.div
						className="absolute ml-80"
						initial={{ opacity: 0 }}
						animate={{ opacity: activeTarget ? 1 : 0 }}
						exit={{ opacity: 0 }}
						transition={springs.xfast()}
					>
						<Text className="w-48">
							{activeTarget?.data?.action}{" "}
							<TextLink href={"#"}>{activeTarget.data?.this}</TextLink>
						</Text>
					</motion.div>
				)}
			</MouseFollower>
		</MouseSmoothing>
	);
}
