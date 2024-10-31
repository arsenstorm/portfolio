"use client";

// Components
import Portfolio from "@/components/portfolio/main";
import { ByeBye } from "@/components/portfolio/bye-bye";
import { EscapeTitle } from "@/components/design/escape";
import { useVisitor } from "@/components/cursors/visitor-context";

export default function PortfolioPage() {
	const { lastVisitor } = useVisitor();

	return (
		<>
			<EscapeTitle title="Arsen Shkrumelyak" />
			<Portfolio lastVisitor={lastVisitor} />
			<ByeBye />
		</>
	);
}
