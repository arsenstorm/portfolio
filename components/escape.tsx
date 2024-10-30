"use client";

// Next
import { Badge } from "./ui/badge";
import { usePathname } from "next/navigation";

// React
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	useContext,
	createContext,
} from "react";

// UI
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";

// Hooks
import { useHotkeys } from "@mantine/hooks";

// View Transitions
import { useTransitionRouter } from "next-view-transitions";

// Add title context
const TitleContext = createContext<{
	title: string;
	setTitle: (title: string) => void;
} | null>(null);

export function EscapeProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const router = useTransitionRouter();
	const [title, setTitle] = useState("Arsen Shkrumelyak");

	const returnTo = useMemo(() => {
		if (pathname.startsWith("/writing/")) return "/writing";
		return "/";
	}, [pathname]);

	const handleBack = useCallback(() => {
		router.push(returnTo);
	}, [returnTo, router]);

	useHotkeys([["Escape", handleBack]]);

	const contextValue = useMemo(() => ({ title, setTitle }), [title]);

	return (
		<TitleContext.Provider value={contextValue}>
			<div className="relative max-w-2xl mx-auto">
				<div className="absolute top-0 left-0 px-4 py-8">
					{pathname !== "/" ? (
						<Link
							href={returnTo}
							className="orchestration flex flex-row items-center gap-x-2"
						>
							<Badge className="!text-xs">Esc</Badge>
							<Text className="!text-xs">Go back.</Text>
						</Link>
					) : null}
				</div>
				<div className="max-w-2xl mx-auto text-zinc-950 dark:text-zinc-50 py-24 px-4">
					<div className="orchestration flex flex-col gap-y-4">
						<Heading
							style={
								{
									"--stagger-index": 1,
								} as React.CSSProperties
							}
						>
							{title}
						</Heading>
						<Divider
							className="my-4"
							style={
								{
									"--stagger-index": 2,
								} as React.CSSProperties
							}
						/>
						{children}
					</div>
				</div>
			</div>
		</TitleContext.Provider>
	);
}

export function EscapeTitle({ title }: Readonly<{ title: string }>) {
	const context = useContext(TitleContext);

	useEffect(() => {
		if (!context) return;
		context.setTitle(title);
	}, [title, context]);

	return null;
}
