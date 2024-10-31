"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";

type VisitorContextType = {
	lastVisitor: string;
	currentVisitor: string;
};

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export function VisitorProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
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

	const contextValue = useMemo(
		() => ({ lastVisitor, currentVisitor }),
		[lastVisitor, currentVisitor],
	);

	return (
		<VisitorContext.Provider value={contextValue}>
			{children}
		</VisitorContext.Provider>
	);
}

export function useVisitor() {
	const context = useContext(VisitorContext);
	if (context === undefined) {
		throw new Error("useVisitor must be used within a VisitorProvider");
	}
	return context;
}
