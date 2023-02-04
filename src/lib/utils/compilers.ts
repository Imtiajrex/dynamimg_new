import type { elementType } from './elements';

export const htmlCompiler = ({ elements }: { elements: elementType[] }) => {
	let code = '';
	let style = '<style>';
	elements.forEach((element) => {
		code += `<${element.Component} class="${element.id}" id="${element.id}">\n`;
		if (element.content) code += `\t` + element.content;
		code += `\n`;
		code += `</${element.Component}>\n`;
	});

	elements.forEach((element) => {
		style += `\n\t`;
		style += `.${element.id} {\n`;
		for (const [key, value] of Object.entries(element.style)) {
			style += `\t\t${key}: ${value};\n`;
		}
		style += '\t}\n';
	});
	style += '</style>';

	let svelte = code + `\n` + style;
	console.log(svelte);
	return svelte;
};
