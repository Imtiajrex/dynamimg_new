<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { asDraggable, asDropZone } from 'svelte-drag-and-drop-actions';
	import type { DropOperation } from 'svelte-drag-and-drop-actions';
	import {
		addElement,
		getElements,
		getSelectedElement,
		type elementsKeyListType,
		type elementsType,
		type hierarchyType
	} from '$lib/utils/elements';
	import type { styleObjectType as objectStyleType } from '$lib/utils/elements';

	import { onMount } from 'svelte';
	import ElementRenderer from './element-renderer.svelte';
	import Trix from 'trix';
	let tool = getContext('active-tool-drawer') as Writable<string | null>;
	let customStyleContext = getContext('custom-style') as Writable<objectStyleType | null>;

	function onDrop(x: number, y: number, Operation: DropOperation, DataOffered: any) {
		if ($movingElement.length == 1) return;
		addElement({
			elementID: DataOffered.element as elementsKeyListType,
			style: {
				position: 'absolute',
				top: (y - canvasSize.top) / canvasSize.top + '%',
				left: (x - canvasSize.left) / canvasSize.left + '%',
				'max-width': '500px'
			}
		});
		tool.set(null);
		return DataOffered.element;
	}
	let canvas;
	let canvasSize = {
		width: 0,
		height: 0,
		top: 0,
		left: 0
	};
	onMount(() => {
		canvas = document.getElementById('canvas') as HTMLElement;
		canvasSize = {
			width: canvas.getBoundingClientRect().width,
			height: canvas.getBoundingClientRect().height,
			top: canvas.getBoundingClientRect().top,
			left: canvas.getBoundingClientRect().left
		};
		document.addEventListener('trix-before-initialize', () => {
			Trix.config.textAttributes.underline = {
				style: { textDecoration: 'underline' },
				parser: function (element: HTMLElement) {
					return element.style.textDecoration === 'underline';
				},
				inheritable: 1
			};
			Trix.config.textAttributes.orderedList = {
				parser: function (element: HTMLElement) {
					return element.tagName === 'OL';
				},
				inheritable: 1
			};
		});
		document.addEventListener('trix-initialize', () => {
			const toolbar = document.querySelector('trix-toolbar') as HTMLElement;
			if (toolbar) toolbar.style.display = 'none';
		});
	});
	const elements = getElements() as elementsType;
	let selectedElement = getSelectedElement();
	let movingElement = writable<hierarchyType>([]);
	let isCtrlPressed = false;
	setContext('moving-element', movingElement);
	setContext('is-ctrl-pressed', {
		get: () => isCtrlPressed
	});
	function onKeyDown(e: KeyboardEvent) {
		if (e.key == 'Control') {
			isCtrlPressed = true;
		}
	}
	function onKeyUp(e: KeyboardEvent) {
		if (e.key == 'Control') {
			isCtrlPressed = false;
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	use:asDropZone={{
		TypesToAccept: { element: 'copy' },
		onDrop
	}}
	draggable="false"
	on:dragstart|preventDefault
	on:click={(e) => {
		$selectedElement = [];
		customStyleContext.set(null);
		e.stopPropagation();
	}}
	id="canvas"
	class={`canvas overflow-hidden relative w-full h-full bg-white border-2 border-primary mx-auto rounded-md`}
	style={`max-width: 800px;`}
>
	<ElementRenderer bind:elements={$elements} />
</div>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<style>
	.canvas {
		container-type: inline-size;
		container-name: canvas;
		user-select: auto;
	}
</style>
