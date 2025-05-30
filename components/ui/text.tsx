"use client";

import { clsx } from "clsx";
import { Link } from "./link";
import type React from "react";

export function Text({
	className,
	...props
}: Readonly<React.ComponentPropsWithoutRef<"p">>) {
	return (
		<p
			data-slot="text"
			{...props}
			className={clsx(
				className,
				"text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400",
			)}
		/>
	);
}

export function TextLink({
	className,
	mouse,
	...props
}: Readonly<
	React.ComponentPropsWithoutRef<typeof Link> & {
		mouse?: Record<string, string>;
	}
>) {
	return (
		<Link
			{...props}
			mouse={mouse}
			className={clsx(
				className,
				"text-zinc-950 underline underline-offset-2 decoration-zinc-950/50 data-[hover]:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:data-[hover]:decoration-white",
			)}
		/>
	);
}

export function Strong({
	className,
	...props
}: Readonly<React.ComponentPropsWithoutRef<"strong">>) {
	return (
		<strong
			{...props}
			className={clsx(className, "font-medium text-zinc-950 dark:text-white")}
		/>
	);
}

export function Code({
	className,
	...props
}: Readonly<React.ComponentPropsWithoutRef<"code">>) {
	return (
		<code
			{...props}
			className={clsx(
				className,
				"rounded border border-zinc-950/10 bg-zinc-950/[2.5%] px-0.5 text-sm font-medium text-zinc-950 sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white",
			)}
		/>
	);
}
