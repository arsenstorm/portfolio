import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "selector",
	theme: {},
	plugins: [require("@tailwindcss/typography")],
};

export default config;
