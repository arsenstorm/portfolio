// Types
import type { MetadataRoute } from "next";

// Utils
import { getAllWriting } from "@/utils/get-all-writing";

export async function generateSitemaps() {
	return [{ id: 0 }];
}

export default async function sitemap({
	id,
}: {
	id: number;
}): Promise<MetadataRoute.Sitemap> {
	const start = id * 50000;
	const end = start + 50000;
	const writings = await getAllWriting();
	const writingSitemap = writings.slice(start, end).map((writing) => ({
		url: `https://arsenstorm.com/writing/${writing.slug}`,
		lastModified: new Date(writing.date).toISOString(),
	}));

	const pages = {
		home: {
			url: "https://arsenstorm.com",
			lastModified: new Date().toISOString(),
		},
		writing: {
			url: "https://arsenstorm.com/writing",
			lastModified: new Date().toISOString(),
		},
	};

	const sitemap = [...Object.values(pages), ...writingSitemap];

	return sitemap;
}
