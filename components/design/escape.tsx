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
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";

// Hooks
import { useHotkeys, useClipboard } from "@mantine/hooks";

// View Transitions
import { useTransitionRouter } from "next-view-transitions";
import clsx from "clsx";
import { MouseTarget } from "../ui/frost/mouse";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

const TitleContext = createContext<{
	title: string;
	setTitle: (title: string) => void;
	audioUrl: string;
	setAudioUrl: (audioUrl: string) => void;
	display: "show" | "none";
	setDisplay: (display: "show" | "none") => void;
	audioPlaying: boolean;
	setAudioPlaying: (audioPlaying: boolean) => void;
	pageLink: string;
	setPageLink: (pageLink: string) => void;
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
	const [pageLink, setPageLink] = useState("");

	const returnTo = useMemo(() => {
		if (pathname.startsWith("/writing/")) return "/writing";
		return "/";
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
			pageLink,
			setPageLink,
		}),
		[title, display, audioUrl, audioPlaying, pageLink, currentWord],
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
		clipboard.copy(pageLink);
		toast.success("Copied link to clipboard!");
	}, [pageLink, clipboard]);

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
							mouse={{ action: "Go", this: "back home" }}
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
							{title}
							<div className="flex flex-row items-center gap-x-2">
								{pageLink && (
									<MouseTarget
										data={{ action: "Copy", this: "page link" }}
										className="rounded-full overflow-hidden"
									>
										<button
											type="button"
											onClick={copyPageLink}
											className={clsx(
												"rounded-full p-2.5 transition-all active:scale-95 flex flex-row items-center justify-center",
												clipboard.copied
													? "bg-green-100 dark:bg-green-900/50"
													: "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800",
											)}
											aria-label="Copy Page Link"
										>
											<AnimatePresence mode="wait">
												{clipboard.copied ? (
													<motion.svg
														key="check"
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
														<title>Copied!</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M4.5 12.75l6 6 9-13.5"
														/>
													</motion.svg>
												) : (
													<motion.svg
														key="link"
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
														<title>Copy Link</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
														/>
													</motion.svg>
												)}
											</AnimatePresence>
										</button>
									</MouseTarget>
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
	pageLink,
}: Readonly<{
	title?: string;
	display?: "show" | "none";
	audioUrl?: string;
	pageLink?: string;
}> &
	({ display?: "show"; title: string } | { display: "none"; title?: string })) {
	const context = useTitleContext();

	useEffect(() => {
		if (!context) return;
		context.setTitle(title ?? "");
		context.setDisplay(display ?? "show");
		context.setAudioUrl(audioUrl ?? "");
		context.setPageLink(pageLink ?? "");
	}, [title, context, display, audioUrl, pageLink]);

	return null;
}
