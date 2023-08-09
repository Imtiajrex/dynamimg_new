<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import {
		getElements,
		getSelectedElement,
		type elementsType,
		type hierarchyType
	} from '$lib/utils/elements';
	import type { styleObjectType as objectStyleType } from '$lib/utils/elements';

	import { onMount } from 'svelte';
	import ElementRenderer from './element-renderer.svelte';
	// import Trix from 'trix';
	let customStyleContext = getContext('custom-style') as Writable<objectStyleType | null>;

	onMount(() => {
		document.addEventListener('trix-before-initialize', () => {
			Trix.config.textAttributes.underline = {
				style: { textDecoration: 'underline' },
				parser: function (element: HTMLElement) {
					return element.style.textDecoration === 'underline';
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
	let isCtrlPressed = writable<boolean>(false);
	setContext('moving-element', movingElement);
	setContext('is-ctrl-pressed', isCtrlPressed);
	function onKeyDown(e: KeyboardEvent) {
		if (e.key == 'Control') {
			$isCtrlPressed = true;
		}
	}
	function onKeyUp(e: KeyboardEvent) {
		if (e.key == 'Control') {
			$isCtrlPressed = false;
		}
	}
	const onmousedown = () => {
		$selectedElement = [];
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	id="canvas"
	class={`canvas overflow-hidden relative w-full h-full bg-white border-2 border-primary mx-auto rounded-md`}
	style={`max-width: 800px;`}
>
	<ElementRenderer bind:elements={$elements} />
</div>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} on:click={onmousedown} />

<style>
	.canvas {
		container-type: inline-size;
		container-name: canvas;
		user-select: auto;
	}
</style>
