"use client";

// UI
import { Code, Text, TextLink } from "@/components/ui/text";

// Functions
import { getCommandKey } from "@/utils/get-command-key";

export function VisitorsGlobe({
	style,
}: { readonly style: React.CSSProperties }) {
	const { key, device } = getCommandKey();

	return (
		<Text style={style}>
			See where people are visiting from!{" "}
			{device === "desktop" ? (
				<Code>{key} + G</Code>
			) : (
				<TextLink href="/globe">Here’s a link!</TextLink>
			)}
		</Text>
	);
}