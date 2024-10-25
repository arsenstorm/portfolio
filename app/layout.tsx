// Functions
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Styles
import "@/styles/globals.css";

// Analytics
import { Analytics } from "@vercel/analytics/react";

// Theme
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Arsen Shkrumelyak - I build things.",
		template: "%s | Arsen Shkrumelyak",
	},
	description: "I’m Arsen, a philosopher, tinkerer, and builder.",
	metadataBase: new URL("https://arsenstorm.com"),
	openGraph: {
		type: "website",
		description: "I’m Arsen, a philosopher, tinkerer, and builder.",
		siteName: "Arsen Shkrumelyak",
		images: [
			{
				url: "/og",
				width: 1200,
				height: 630,
			},
		],
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950`}>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					<div className="max-w-2xl mx-auto text-zinc-950 dark:text-zinc-50 py-24 px-4">
						{children}
					</div>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	);
}
