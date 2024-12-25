"use client";

// Next
import { usePathname } from "next/navigation";

// React
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	useContext,
	createContext,
	useRef,
} from "react";

// UI
import clsx from "clsx";
import { toast } from "sonner";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { MouseTarget } from "@/components/ui/frost/mouse";
import { AnimatePresence, motion } from "framer-motion";

// Hooks
import { useClipboard, useHotkeys } from "@mantine/hooks";

// View Transitions
import { useTransitionRouter } from "next-view-transitions";

const TitleContext = createContext<{
	title: string;
	setTitle: (title: string) => void;
	audioUrl: string;
	setAudioUrl: (audioUrl: string) => void;
	display: "show" | "none";
	setDisplay: (display: "show" | "none") => void;
	audioPlaying: boolean;
	setAudioPlaying: (audioPlaying: boolean) => void;
	extraLink: string;
	setExtraLink: (extraLink: string) => void;
	extraLinkHint: { action: string; this: string } | null;
	setExtraLinkHint: (
		extraLinkHint: { action: string; this: string } | null,
	) => void;
	extraLinkIcon: React.ReactNode;
	setExtraLinkIcon: (extraLinkIcon: React.ReactNode) => void;
	// Current Word (i.e., the word that is currently being spoken)
	currentWord: string;
	setCurrentWord: (currentWord: string) => void;
} | null>(null);

export function EscapeProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const clipboard = useClipboard({
		timeout: 1000,
	});
	const router = useTransitionRouter();
	const [title, setTitle] = useState("");
	const [display, setDisplay] = useState<"show" | "none">("show");

	// Audio
	const [audioUrl, setAudioUrl] = useState("");
	const [audioPlaying, setAudioPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [currentWord, setCurrentWord] = useState("");

	// Page Link
	const [extraLink, setExtraLink] = useState("");
	const [extraLinkIcon, setExtraLinkIcon] = useState<React.ReactNode>(null);
	const [extraLinkHint, setExtraLinkHint] = useState<{
		action: string;
		this: string;
	} | null>(null);

	const returnTo = useMemo(() => {
		if (pathname === "/") return "/";
		const segments = pathname.split("/").filter(Boolean);
		return segments.length > 1 ? `/${segments.slice(0, -1).join("/")}` : "/";
	}, [pathname]);

	const handleBack = useCallback(() => {
		router.push(returnTo);
	}, [returnTo, router]);

	useHotkeys([["Escape", handleBack]]);

	const contextValue = useMemo(
		() => ({
			title,
			setTitle,
			display,
			setDisplay,
			audioUrl,
			setAudioUrl,
			audioPlaying,
			setAudioPlaying,
			currentWord,
			setCurrentWord,
			extraLink,
			setExtraLink,
			extraLinkIcon,
			setExtraLinkIcon,
			extraLinkHint,
			setExtraLinkHint,
		}),
		[
			title,
			display,
			audioUrl,
			audioPlaying,
			currentWord,
			extraLink,
			extraLinkIcon,
			extraLinkHint,
		],
	);

	const playAudio = useCallback(
		(url: string) => {
			if (audioRef.current) {
				// If audio is currently playing, stop it completely
				if (audioPlaying) {
					audioRef.current.pause();
					audioRef.current.currentTime = 0; // Reset to beginning
					audioRef.current = null;
					setAudioPlaying(false);
					return;
				}
				// Start playing
				audioRef.current.play();
				setAudioPlaying(true);
				return;
			}

			// If no audio exists, create and play it
			setAudioPlaying(true);
			const audio = new Audio(url);
			audioRef.current = audio;
			audio.play();
			audio.addEventListener("ended", () => {
				setAudioPlaying(false);
				audioRef.current = null;
			});
		},
		[audioPlaying],
	);

	const copyPageLink = useCallback(() => {
		clipboard.copy(`https://arsenstorm.com/${pathname.replaceAll("//", "/")}`);
		toast.success("Copied link to clipboard!");
	}, [clipboard, pathname]);

	useEffect(() => {
		if (audioRef.current && audioUrl) {
			audioRef.current.pause();
			audioRef.current = null;
			setAudioPlaying(false);
		}
	}, [audioUrl]);

	useEffect(() => {
		if (display === "show") setTitle("Arsen Shkrumelyak");
	}, [display]);

	return (
		<TitleContext.Provider value={contextValue}>
			<div className="relative max-w-2xl mx-auto">
				<div className="absolute top-0 left-0 px-4 py-8">
					{pathname !== "/" ? (
						<Link
							href={returnTo}
							mouse={{ action: "Go", this: "back" }}
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
							className={clsx(
								display === "none"
									? "hidden"
									: "w-full flex flex-row justify-between items-center",
							)}
						>
							<MouseTarget
								data={{ action: "Copy", this: "page link" }}
								onClick={copyPageLink}
							>
								{title}
							</MouseTarget>
							<div className="flex flex-row items-center gap-x-2">
								{extraLink && (
									<Link
										href={extraLink}
										mouse={{
											action: extraLinkHint?.action ?? "Go",
											this: extraLinkHint?.this ?? "somewhere",
										}}
										className="rounded-full p-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-all active:scale-95 flex flex-row items-center justify-center"
									>
										{extraLinkIcon ?? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												className="size-5"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<title>{/* extra link */}</title>
												<circle cx="12" cy="12" r="10" />
												<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
												<path d="M12 17h.01" />
											</svg>
										)}
									</Link>
								)}
								{audioUrl && (
									<MouseTarget
										data={{ action: "Play", this: "audio" }}
										className="rounded-full overflow-hidden"
									>
										<button
											type="button"
											onClick={() => playAudio(audioUrl)}
											className="rounded-full p-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-all active:scale-95 flex flex-row items-center justify-center"
											aria-label={audioPlaying ? "Pause Audio" : "Play Audio"}
										>
											<AnimatePresence mode="wait">
												{audioPlaying ? (
													<motion.svg
														key="pause"
														initial={{ opacity: 0, scale: 0.3 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.3 }}
														transition={{ duration: 0.1 }}
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														className="w-5 h-5"
													>
														<title>Pause Audio</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
														/>
													</motion.svg>
												) : (
													<motion.svg
														key="play"
														initial={{ opacity: 0, scale: 0.3 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.3 }}
														transition={{ duration: 0.1 }}
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														className="w-5 h-5"
													>
														<title>Play Audio</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z"
														/>
													</motion.svg>
												)}
											</AnimatePresence>
										</button>
									</MouseTarget>
								)}
							</div>
						</Heading>
						<Divider
							className={clsx(display === "none" && "hidden", "my-4")}
							style={
								{
									"--stagger-index": 2,
								} as React.CSSProperties
							}
						/>
						{children}
					</div>
					<div
						// Top Gradient
						className={clsx(
							// Base
							"fixed top-0 left-0 right-0 no-orchestration z-10 h-8 pointer-events-none",

							// Gradient
							"bg-gradient-to-t from-transparent to-zinc-50 dark:to-zinc-950",
						)}
					/>
					<div
						// Bottom Gradient
						className={clsx(
							// Base
							"fixed bottom-0 left-0 right-0 no-orchestration z-10 h-16 pointer-events-none",

							// Gradient
							"bg-gradient-to-b from-transparent to-zinc-50 dark:to-zinc-950",
						)}
					/>
				</div>
			</div>
		</TitleContext.Provider>
	);
}

export function useTitleContext() {
	return useContext(TitleContext);
}

export function EscapeTitle({
	title,
	display = "show",
	audioUrl,
	extraLink,
	extraLinkIcon,
	extraLinkHint,
}: Readonly<{
	title?: string;
	display?: "show" | "none";
	audioUrl?: string;
	extraLink?: string;
	extraLinkIcon?: React.ReactNode;
	extraLinkHint?: { action: string; this: string } | null;
}> &
	({ display?: "show"; title: string } | { display: "none"; title?: string })) {
	const context = useTitleContext();

	useEffect(() => {
		if (!context) return;
		context.setTitle(title ?? "");
		context.setDisplay(display ?? "show");
		context.setAudioUrl(audioUrl ?? "");
		context.setExtraLink(extraLink ?? "");
		context.setExtraLinkIcon(extraLinkIcon ?? null);
		context.setExtraLinkHint(extraLinkHint ?? null);
	}, [
		title,
		context,
		display,
		audioUrl,
		extraLink,
		extraLinkIcon,
		extraLinkHint,
	]);

	return null;
}
