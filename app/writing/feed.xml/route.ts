import { Feed } from "feed";
import { getAllWriting } from "@/utils/get-all-writing";
import { readWriting } from "@/mdx/compile";

export async function GET(req: Request) {
	const siteUrl = new URL(req.url).origin;

	const author = {
		name: "Arsen Shkrumelyak",
		email: "arsen@shkrumelyak.com",
	};

	const feed = new Feed({
		title: "Writings.",
		description: "I write stuff.",
		author,
		id: siteUrl,
		link: siteUrl,
		image: `${siteUrl}/favicon.ico`,
		favicon: `${siteUrl}/favicon.ico`,
		copyright: `All rights reserved ${new Date().getFullYear()}`,
		feedLinks: {
			rss2: `${siteUrl}/writing/feed.xml`,
		},
	});

	const writings = await getAllWriting();

	for (const writing of writings) {
		const content = ((await readWriting(writing.slug)) ?? "").replace(
			/---[\s\S]*?---\s*/,
			"",
		);

		feed.addItem({
			title: writing.title,
			id: `${siteUrl}/writing/${writing.slug}`,
			link: `${siteUrl}/writing/${writing.slug}`,
			content: content ?? "",
			author: [author],
			contributor: [author],
			date: new Date(writing.date),
		});
	}

	return new Response(feed.rss2(), {
		status: 200,
		headers: {
			"content-type": "application/xml",
			"cache-control": "s-maxage=31556952",
		},
	});
}
