import { cloneDeep } from 'lodash';
import { getContext, setContext } from 'svelte';
import { SvelteElement } from 'svelte/internal';
import { get, writable, type Writable } from 'svelte/store';
import {
	IconContainer,
	IconCursorText,
	IconHeading,
	IconIcons,
	IconLayoutGrid,
	IconLetterP
} from '@tabler/icons-svelte';
import * as Icons from '@tabler/icons-svelte';
export const elementsList = [
	{ Icon: IconHeading, name: 'Headline', id: 'heading' },
	{ Icon: IconLetterP, name: 'Sub-Heading', id: 'paragraph' },
	{
		Icon: IconIcons,
		name: 'Icon',
		id: 'icon',
		open: true
	}
] as { Icon: any; name: string; id: elementsKeyListType; open?: boolean }[];

export type elementsKeyListType = 'heading' | 'paragraph' | 'icon';
export type hierarchyType = string[];
export type styleObjectType = {
	[key: string]: string | styleObjectType;
};
export type elementType = {
	name: string;
	Component: any;
	id: string;
	elementId: string;
	classname?: string;
	style: styleObjectType;
	content?: string;
	hierarchy: hierarchyType;
	children?: elementType[];
	childEnabled: boolean;
	ComponentProvider?: any;
};
export type elementsType = Writable<elementType[]>;
const elements = writable<elementType[]>([]);
const selectedElement = writable<string[]>([]);
export const setSelectedElement = () => setContext('selected-element', selectedElement);
export const getSelectedElement: () => Writable<string[]> = () => getContext('selected-element');
type elementMapType = {
	[key in elementsKeyListType]: {
		name: string;
		Component: any;
		content?: string;
		style?: styleObjectType;
		classname?: string;
		childEnabled: boolean;
	};
};
const elementsMap = {
	heading: {
		name: 'Headline',
		Component: 'h1',
		content: 'This is a headline',
		childEnabled: false
	},
	paragraph: {
		name: 'Sub-Heading',
		Component: 'div',
		childEnabled: false,
		content: 'This is a sub headline. It is used to write large chunks of text.'
	},
	icon: {
		name: 'Icon',
		childEnabled: false
	}
} as elementMapType;

const usedIds = [] as string[];
type getUsedIdContextType = () => { get: () => string[] };
export const getUsedIds: getUsedIdContextType = () => getContext('used-ids');
export const getElements = () => getContext('elements');
export const setElements = () => {
	setContext('elements', elements);
	setContext('used-ids', {
		get() {
			return usedIds;
		}
	});
};

export const getElement = ({
	elements,
	hierarchy = []
}: {
	elements: elementType[];
	hierarchy: hierarchyType;
}) => {
	console.log(elements);
};
const generateID = (elementID: string): string => {
	let id = Math.random().toString(36).substring(2, 9);
	id = `${elementID}_${id}`;
	if (usedIds.includes(id)) id = generateID(elementID);
	usedIds.push(id);
	return id;
};
export const addElement = ({
	elementID,
	hierarchy = [],
	style,
	component
}: {
	elementID: elementsKeyListType;
	hierarchy?: hierarchyType;
	style?: styleObjectType;
	component?: any;
}) => {
	const element = { ...elementsMap[elementID] } as elementType;
	element.id = generateID(elementID);
	element.elementId = elementID;
	element.hierarchy = [element.id];
	if (component) element.Component = component;
	if (!element.style) element.style = {};
	else element.style = cloneDeep(element.style);
	if (style) {
		element.style = { ...element.style, ...style };
	}
	elements.update((elements) => {
		if (hierarchy.length == 0) return [...elements, element];
		else {
			const elementHierarchy = [...hierarchy, element.id];
			element.hierarchy = elementHierarchy;
			const foundElement = traverseElements(elements, hierarchy);

			if (foundElement)
				if (foundElement.children) foundElement.children.push(element);
				else foundElement.children = [element];
			console.log(elements);
			return elements;
		}
	});
};

const traverseElements = (elements: elementType[], hierarchy: hierarchyType = []) => {
	let foundElement;
	while (hierarchy.length > 0) {
		const id = hierarchy.shift();
		if (foundElement && foundElement.children)
			foundElement = foundElement.children.find((element) => element.id == id);
		else foundElement = elements.find((element) => element.id == id);
	}
	return foundElement;
};

export const assignElement = ({
	element,
	hierarchy = []
}: {
	element: elementType;
	hierarchy: hierarchyType;
}) => {
	console.log(element);
};
export const removeElement = ({ hierarchy }: { hierarchy: hierarchyType }) => {
	elements.update((elements) => {
		usedIds.splice(usedIds.indexOf(hierarchy[hierarchy.length - 1]), 1);
		if (hierarchy.length == 1) {
			return elements.filter((element) => element.id !== hierarchy[0]);
		} else {
			const parentElement = traverseElements(elements, [...hierarchy.slice(0, -1)]);
			if (parentElement && parentElement.children && parentElement.children.length > 0) {
				parentElement.children = parentElement.children.filter(
					(element) => element.id !== hierarchy[hierarchy.length - 1]
				);
				return elements;
			}
			return elements;
		}
	});
};
