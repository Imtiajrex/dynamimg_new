import type { customStyleType, styleObjectType } from './elements';

type variableObjectType = {
	[key: string]: string;
};
const updateVariables = (
	styleObject: styleObjectType,
	variables: variableObjectType,
	prefix: string
) => {
	for (const [key, value] of Object.entries(styleObject)) {
		if (typeof value === 'object') updateVariables(value, variables, `${prefix}-${key}`);
		else variables[`${prefix}-${key}`] = value;
	}
};
const updateCssVariables = (style: customStyleType, variables: variableObjectType, id: string) => {
	updateVariables(style.desktop, variables, id + '-desktop');
	updateVariables(style.tablet, variables, id + '-tablet');
	updateVariables(style.mobile, variables, id + '-mobile');
};
type argType = { style: customStyleType; id: string };
export function cssVariables(node: HTMLElement, { style, id }: argType) {
	const variables = {} as variableObjectType;
	updateCssVariables(style, variables, id);
	setCssVariables(node, variables);

	return {
		update({ style, id }: argType) {
			const variables = {} as variableObjectType;
			updateCssVariables(style, variables, id);

			setCssVariables(node, variables);
		}
	};
}
function setCssVariables(node: HTMLElement, variables: variableObjectType) {
	for (const name in variables) {
		if (node.style.getPropertyValue(`--${name}`) === variables[name]) continue;
		node.style.setProperty(`--${name}`, variables[name]);
	}
}
