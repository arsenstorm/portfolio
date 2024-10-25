"use client";

import { useDocumentTitle, useDocumentVisibility } from "@mantine/hooks";

export function ByeBye() {
	const documentState = useDocumentVisibility();
	useDocumentTitle(
		documentState === "visible"
			? "Arsen Shkrumelyak - I build things."
			: "I guess this is goodbye",
	);

  return null;
}
