import type { styleObjectType } from './elements';

export const styleObjectToCSS = (styleObject: styleObjectType): string => {
	let css = '';
	for (const [key, value] of Object.entries(styleObject)) {
		if (typeof value === 'object') css += `${key} { ${styleObjectToCSS(value)} }`;
		else css += `${key}: ${value};`;
	}
	return css;
};
export const styleObjectToVariableBasedCss = (styleObject: styleObjectType, prefix: string) => {
	let css = '';
	let variables = '';
	for (const [key, value] of Object.entries(styleObject)) {
		if (typeof value === 'object') {
			css += styleObjectToVariableBasedCss(value, `${prefix}-${key}`);
		} else {
			css += `${key}: var(--${prefix}-${key});`;
			variables += `--${prefix}-${key}: ${value};`;
		}
	}
	return { css, variables };
};
export const styleObjectToCssVariables = (styleObject: styleObjectType, prefix: string) => {
	let variables = '';
	for (const [key, value] of Object.entries(styleObject)) {
		if (typeof value === 'object') styleObjectToCssVariables(value, `${prefix}-${key}`);
		else variables += `--${prefix}-${key}: ${value};`;
	}
	return variables;
};
