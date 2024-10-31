"use client";

// Components
import Portfolio from "@/components/portfolio/main";
import { CursorsProvider } from "@/components/cursors/cursors";
import { ByeBye } from "@/components/portfolio/bye-bye";
import { EscapeTitle } from "@/components/design/escape";
import { useVisitor } from "@/components/cursors/visitor-context";

export default function PortfolioPage() {
	const { lastVisitor } = useVisitor();

	return (
		<>
			<EscapeTitle title="Arsen Shkrumelyak" />
			<CursorsProvider>
				<Portfolio lastVisitor={lastVisitor} />
				<ByeBye />
			</CursorsProvider>
		</>
	);
}
