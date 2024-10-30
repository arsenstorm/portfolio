import { visit } from "unist-util-visit";

let staggerIndex = 2; // Start from 2 to account for the heading and divider

const rehypeStagger = () => {
	return (tree) => {
		staggerIndex = 2;
		visit(tree, "element", (node) => {
			if (node.tagName === "a") {
				return;
			}
			if (node.tagName === "blockquote") {
				node.properties.className = "orchestration";
				return;
			}
			node.properties.style = `${node.properties.style || ""} --stagger-index: ${staggerIndex};`;
			staggerIndex++;
		});
	};
};

export default rehypeStagger;
