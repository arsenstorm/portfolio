import glob from "fast-glob";

async function importWriting(filename: string) {
	const { writing } = await import(`../app/writing/(work)/${filename}`);

	return {
		slug: filename.replace(/(\/page)?\.mdx$/, ""),
		...writing,
	};
}

export async function getAllWriting() {
	const writingFilenames = await glob("*/page.mdx", {
		cwd: "./app/writing/(work)",
	});

	let writings = await Promise.all(writingFilenames.map(importWriting));

	writings = writings.filter((writing) => writing.slug !== "template");

	writings = writings.sort((a, z) => +new Date(z.date) - +new Date(a.date));

	return writings;
}
