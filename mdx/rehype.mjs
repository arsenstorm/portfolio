import { visit } from "unist-util-visit";

let staggerIndex = 0;

const rehypeStagger = () => {
	return (tree) => {
		staggerIndex = 0;
		visit(tree, "element", (node) => {
			node.properties.style = `${node.properties.style || ""} --stagger-index: ${staggerIndex};`;
			staggerIndex++;
		});
	};
};

export default rehypeStagger;
