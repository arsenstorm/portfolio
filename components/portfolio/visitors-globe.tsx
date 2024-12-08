"use client";

// UI
import { Code, Text, TextLink } from "@/components/ui/text";
import { Link } from "@/components/ui/link";

// Functions
import { useCommandKey } from "@/utils/get-command-key";

export function VisitorsGlobe({
	style,
}: { readonly style: React.CSSProperties }) {
	const { key, device } = useCommandKey();

	return (
		<Text style={style}>
			See where people are visiting from!{" "}
			{device === "desktop" ? (
				<Link href="/globe" mouse={{ action: "See", this: "where" }}>
					<Code>{key} + G</Code>
				</Link>
			) : (
				<TextLink href="/globe">Here’s a link!</TextLink>
			)}
		</Text>
	);
}
