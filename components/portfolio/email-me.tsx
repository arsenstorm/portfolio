"use client";

// UI
import { Code, Text, TextLink } from "@/components/ui/text";
import { Link } from "@/components/ui/link";

// Functions
import { useCommandKey } from "@/utils/get-command-key";

export function EmailMe({ style }: { readonly style: React.CSSProperties }) {
	const { key, device } = useCommandKey();

	return (
		<Text style={style}>
			Want to book a call?{" "}
			{device === "desktop" ? (
				<Link href="https://arsen.dev/time">
					<Code>{key} + B</Code>
				</Link>
			) : (
				<TextLink href="https://arsen.dev/time">Here’s a link!</TextLink>
			)}
		</Text>
	);
}
