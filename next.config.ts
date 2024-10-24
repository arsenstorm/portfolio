import createMDX from "@next/mdx";

import rehypeStagger from "@/mdx/rehype.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	webpack(config: any) {
		config.module.rules.push({
			test: /\.svg$/i,
			use: ["@svgr/webpack"],
		});

		return config;
	},
	experimental: {
		turbo: {
			rules: {
				"*.svg": {
					loaders: ["@svgr/webpack"],
					as: "*.js",
				},
			},
		},
	},
};

export const withMDX = createMDX({
	options: {
		rehypePlugins: [rehypeStagger],
	},
});

export default withMDX(nextConfig);
