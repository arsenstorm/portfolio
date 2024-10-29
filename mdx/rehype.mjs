import { visit } from "unist-util-visit";

let staggerIndex = 0;

const rehypeStagger = () => {
	return (tree) => {
		staggerIndex = 0;
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
