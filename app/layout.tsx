// Functions
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Styles
import clsx from "clsx";
import "@/styles/globals.css";

// Analytics
import { Analytics } from "@vercel/analytics/react";

// Theme
import { ThemeProvider } from "next-themes";

// View Transitions
import { ViewTransitions } from "next-view-transitions";

// Escape
import { EscapeProvider } from "@/components/design/escape";

// Cursors
import { CursorsProvider } from "@/components/cursors/cursors";
import { VisitorProvider } from "@/components/cursors/visitor-context";

// Hotkeys
import { Hotkeys } from "@/components/hotkeys/main";

// Noise
import { Noise } from "@/components/ui/frost/noise";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Arsen Shkrumelyak - I build things.",
		template: "%s | Arsen Shkrumelyak",
	},
	description: "I’m Arsen, a builder, philosopher, and tinkerer.",
	metadataBase: new URL("https://arsenstorm.com"),
	openGraph: {
		type: "website",
		url: "https://arsenstorm.com",
		description: "I’m Arsen, a builder, philosopher, and tinkerer.",
		siteName: "Arsen Shkrumelyak",
		images: [
			{
				url: "/og",
				width: 1200,
				height: 630,
			},
		],
	},
	verification: {
		yandex: "9ac810b78b189227",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ViewTransitions>
			<html lang="en" suppressHydrationWarning>
				<body
					className={clsx(
						inter.className,
						"bg-zinc-50 dark:bg-zinc-950 min-h-screen",
					)}
				>
					<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
						<VisitorProvider>
							<CursorsProvider>
								<EscapeProvider>{children}</EscapeProvider>
							</CursorsProvider>
						</VisitorProvider>
						<Hotkeys />
					</ThemeProvider>
					<Analytics />
					<Noise
						blendMode="soft-light"
						opacity={1}
						grainSize={1.5}
						className="fixed z-20"
					/>
				</body>
			</html>
		</ViewTransitions>
	);
}
