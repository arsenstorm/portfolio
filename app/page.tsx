"use client";

// Components
import Portfolio from "@/components/portfolio/main";
import { CursorsProvider } from "@/components/cursors/cursors";
import { ByeBye } from "@/components/portfolio/bye-bye";
import { EscapeTitle } from "@/components/design/escape";

// React
import { useState, useEffect } from "react";

export default function PortfolioPage() {
	const [lastVisitor, setLastVisitor] = useState<string>("Unknown");
	const [currentVisitor, setCurrentVisitor] = useState<string>("Unknown");

	useEffect(() => {
		fetch("/api/track")
			.then((res) => res.json())
			.then((data) => {
				setLastVisitor(data.lastVisitor);
				setCurrentVisitor(data.currentVisitor);
			});
	}, []);

	return (
		<>
			<EscapeTitle title="Arsen Shkrumelyak" />
			<CursorsProvider location={currentVisitor || "Unknown"}>
				<Portfolio lastVisitor={lastVisitor || "Unknown"} />
				<ByeBye />
			</CursorsProvider>
		</>
	);
}
