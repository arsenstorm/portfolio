import { visit } from "unist-util-visit";

let staggerIndex = 0;

const rehypeStagger = () => {
	return (tree) => {
		staggerIndex = 0;
		visit(tree, "element", (node) => {
			console.log(node);
			/*
			{
				type: 'element',
				tagName: 'h1',
				properties: {},
				children: [
					{
						type: 'mdxTextExpression',
						value: 'writing.title',
						position: [Object],
						data: [Object]
					}
				],
				position: {
					start: { line: 10, column: 1, offset: 122 },
					end: { line: 10, column: 18, offset: 139 }
				}
			}
			*/

			node.properties.style = `${node.properties.style || ""} --stagger-index: ${staggerIndex};`;
			console.log(node);

			staggerIndex++;
		});
	};
};

export default rehypeStagger;
