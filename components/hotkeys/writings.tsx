"use client";

// View Transitions
import { useTransitionRouter } from "next-view-transitions";

// Hooks
import { useHotkeys } from "@mantine/hooks";

export function Hotkeys({
	previous,
	next,
}: Readonly<{
	previous: string | false;
	next: string | false;
}>) {
	const router = useTransitionRouter();

	useHotkeys([
		// switch to previous writing (if exists)
		[
			"ArrowLeft",
			() => {
				if (previous) {
					router.push(`/writing/${previous}`);
				}
			},
		],
		// switch to next writing (if exists)
		[
			"ArrowRight",
			() => {
				if (next) {
					router.push(`/writing/${next}`);
				}
			},
		],
	]);

	return null;
}
