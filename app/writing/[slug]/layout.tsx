// UI
import { Button } from "@/components/ui/button";

// Functions
import { getAllWriting } from "@/utils/get-all-writing";

export default async function WritingLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}>) {
	const { slug } = await params;
	const [writings] = await Promise.all([getAllWriting()]);

	const index = writings.findIndex((w) => w.slug === slug);

	const previous = writings?.[index - 1]?.slug;
	const next = writings?.[index + 1]?.slug;

	return (
		<>
			{children}
			<div className="max-w-2xl mx-auto fixed bottom-0 left-0 right-0 px-4 py-8 flex flex-row justify-between items-center z-20 !animate-none !opacity-100">
				<Button
					outline
					className="!text-xs !bg-white/50 dark:!bg-zinc-950/50"
					disabled={!previous}
					href={previous ? `/writing/${previous}` : undefined}
				>
					&larr; Previous
				</Button>
				<Button
					outline
					className="!text-xs !bg-white/50 dark:!bg-zinc-950/50"
					disabled={!next}
					href={next ? `/writing/${next}` : undefined}
				>
					Next &rarr;
				</Button>
			</div>
		</>
	);
}
