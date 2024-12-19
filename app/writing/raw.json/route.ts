// Next
import { NextResponse } from "next/server";

// Utils
import { readWriting } from "@/mdx/compile";
import { getAllWriting } from "@/utils/get-all-writing";

// Config
export const dynamic = "force-static";

export async function GET() {
	const writings = await getAllWriting();

	const data = await Promise.all(
		writings.map(async (writing) => {
			let content = await readWriting(writing.slug);

			if (!content) {
				return null;
			}

			const parts = content.split("---");

			content = parts[2].trim();

			content = content
				.replaceAll(">\n", "> \n")
				.replace(
					/(^>(?:[^\n]+)(?:\n>(?:[^\n]+))*)/gm,
					(match) => `“${match.replace(/^> ?/gm, "").trim()}”`,
				);

			content = content.replace(/\[(.*?)\]\([^)]+\)/g, "$1");

			content = content.replace(/\r\n/g, "\n").replace(/\n\n+/g, "\n\n").trim();

			return {
				slug: writing.slug,
				date: writing.date,
				title: writing.title,
				content,
			};
		}),
	);

	return NextResponse.json({
		lastUpdated: new Date().toISOString(),
		data,
	});
}
