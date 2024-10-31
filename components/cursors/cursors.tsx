"use client";

import { Cursors as InstantCursors } from "@instantdb/react";
import { room } from "./get-cursor-room";
import { useEffect, useState } from "react";
import clsx from "clsx";

// Icons
import CursorPointer from "@/icons/pointer.svg";

// Components
import { Badge } from "@/components/ui/badge";

// Colours
import { type Color, colors, cursorColors } from "./colours";

// Hooks
import { useIdle } from "@mantine/hooks";

// Contexts
import { useVisitor } from "@/components/cursors/visitor-context";

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
