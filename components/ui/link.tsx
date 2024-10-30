"use client";

// React
import React from "react";

// Headless UI
import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";

// Link
import type { LinkProps } from "next/link";
import {
	Link as ViewTransitionLink,
	useTransitionRouter,
} from "next-view-transitions";

export const Link = React.forwardRef(function Link(
	props: LinkProps & React.ComponentPropsWithoutRef<"a">,
	ref: React.ForwardedRef<HTMLAnchorElement>,
) {
	const router = useTransitionRouter();

	return (
		<HeadlessDataInteractive>
			<ViewTransitionLink
				ref={ref}
				onMouseEnter={(e) => {
					const href = typeof props.href === "string" ? props.href : null;
					if (href) {
						router.prefetch(href);
					}
					return props.onMouseEnter?.(e);
				}}
				{...props}
			/>
		</HeadlessDataInteractive>
	);
});
