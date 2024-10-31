"use client";

// View Transitions
import { useTransitionRouter } from "next-view-transitions";

// Hooks
import { useHotkeys } from "@mantine/hooks";

export function Hotkeys() {
	const router = useTransitionRouter();

	useHotkeys([
		// open link to book a call in new tab
		[
			"mod+b",
			() => {
				window.open("https://arsen.dev/time", "_blank");
			},
		],
		// switch user to /writing
		[
			"w",
			() => {
				router.push("/writing");
			},
		],
	]);

	return null;
}
