<script lang="ts">
	import {
		type elementType,
		type hierarchyType,
		type elementsKeyListType,
		addElement,
		getSelectedElement,
		type styleObjectType
	} from '$lib/utils/elements';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import * as _ from 'lodash';
	import { styleObjectToVariableBasedCss } from '$lib/utils/styleCompiler';

	import { cloneDeep } from 'lodash';

	let selectedElement = getSelectedElement();
	export let element: elementType;
	export let components: HTMLElement[];
	let {
		name,
		Component,
		id,
		elementId,
		style,
		classname,
		childEnabled,
		hierarchy,
		children,
		content
	} = element;

	let customStyleContext = getContext('custom-style') as Writable<{
		style: styleObjectType;
		id: string;
	}>;
	let device = getContext('active-device-size') as Writable<'desktop' | 'mobile' | 'tablet'>;

	let containerWidth: number, containerHeight: number;
	let desktopStyler: HTMLElement;
	let elementComponent: HTMLElement;
	let editor: HTMLTextAreaElement;
	let canvas: HTMLElement;
	let canvasRect: DOMRect;
	let isCtrlPressed = getContext('is-ctrl-pressed') as any;
	onMount(() => {
		editor = document.getElementById(`textarea_${id}`) as HTMLTextAreaElement;
		canvas = document.getElementById(`canvas`) as HTMLElement;
		canvasRect = canvas.getBoundingClientRect();

		elementComponent = document.getElementById(id) as HTMLElement;
		containerWidth = elementComponent.getBoundingClientRect().width;
		containerHeight = elementComponent.getBoundingClientRect().height;
		desktopStyler = document.getElementById(`style_desktop_${id}`) as HTMLElement;

		updateDeviceStyles();
		document.addEventListener('trix-change', (e: any) => {
			element.content = e.target.innerHTML;
		});
	});

	let varStyle = '';
	const updateStyle = (css: string, device: any) => {
		let deviceElement = desktopStyler;
		if (deviceElement) {
			let tag = `< style>
						.${id}{
							${css}
						}
					</style >`;
			if (deviceElement.innerHTML !== tag && css.length > 0) {
				deviceElement.innerHTML = tag;
			}
		}
	};
	const updateDeviceStyles = () => {
		varStyle = '';
		const { css, variables } = styleObjectToVariableBasedCss(style, id);

		varStyle += variables;
		updateStyle(css, device);
	};
	$: {
		if (style) updateDeviceStyles();
	}
	$: active = $selectedElement.includes(id);
	let movingElement = getContext('moving-element') as Writable<hierarchyType>;
	const contentfulElement = ['heading', 'paragraph'];
	let tool = getContext('active-tool-drawer') as Writable<string | null>;

	let isHovering = false;
	let childMoving = false;
	const checkArrayEquals = (arr1: any[], arr2: any[]) => {
		return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
	};
	const checkChildMoving = (val: hierarchyType) => {
		const droppedHierarchy = cloneDeep(val);
		droppedHierarchy.pop();
		if (droppedHierarchy.length === 0) {
			childMoving = false;
			return;
		}
		console.log(droppedHierarchy, hierarchy);

		childMoving = checkArrayEquals(droppedHierarchy, hierarchy);
	};
	movingElement.subscribe((val) => {
		checkChildMoving(val);
	});
	let edit = false;
	$: {
		if (!$selectedElement.includes(id)) {
			edit = false;
		}
	}

	import Moveable from 'svelte-moveable';
	let target: HTMLElement;
	type frameType = {
		translate?: [number, number];
		rotate?: number;
	};
	let frame = {
		translate: [0, 0],
		rotate: 0
	} as frameType;
	$: {
		if (elementComponent) {
			elementComponent.style.outline = isHovering ? '1px solid #000' : 'none';
		}
	}
	$: {
		if (elementComponent) {
			elementComponent.style.userSelect = edit ? 'auto' : 'none';
		}
	}
	const setTranslate = ({ translate, rotate }: frameType) => {
		translate = translate || frame.translate;
		rotate = rotate || frame.rotate;

		return translate ? `translate(${translate[0]}px, ${translate[1]}px) rotate(${rotate}deg)` : '';
	};
	const onClick = (e: Event) => {
		if (active) {
			edit = true;
		}
		if (isCtrlPressed.get()) {
			$selectedElement = [...$selectedElement, id];
		} else {
			$selectedElement = [id];
		}
		customStyleContext.set({ style, id });
		e.stopPropagation();
	};
	const isIcon = elementId == 'icon';
</script>

<span class="h-0 opacity-0 absolute">
	<span id={`style_desktop_${id}`} />
</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
{#if typeof Component === 'string'}
	<svelte:element
		this={Component}
		bind:this={target}
		on:click={onClick}
		on:mouseover|stopPropagation={() => (isHovering = true)}
		on:mouseout|stopPropagation={() => (isHovering = false)}
		class={`${classname} ${id} element`}
		{id}
	>
		<slot />
		{#if contentfulElement.includes(elementId)}
			{#if !edit}
				{@html element.content}
			{:else}
				<trix-editor
					style={`width:100%;height:100%;position:absolute;top:0;left:0;${
						edit ? '' : 'display: none;'
					}`}
					toolbar="toolbar"
					contenteditable
					bind:innerHTML={element.content}
				/>
			{/if}
		{/if}
	</svelte:element>
{:else}
	<div
		bind:this={target}
		class={`${classname} ${id} element`}
		on:click={onClick}
		on:mouseover={() => (isHovering = true)}
		on:mouseout={() => (isHovering = false)}
		{id}
	>
		<svelte:component this={Component} class="w-full h-full" />
	</div>
{/if}
{#if active && canvasRect}
	<Moveable
		{target}
		resizable={true}
		keepRatio={isIcon}
		throttleResize={1}
		renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
		edge={false}
		zoom={1}
		origin={true}
		padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
		draggable={!edit}
		throttleDrag={0}
		snappable={true}
		verticalGuidelines={[0, canvasRect.height / 2, canvasRect.height]}
		horizontalGuidelines={[0, canvasRect.width / 2, canvasRect.width]}
		snapThreshold={1}
		elementGuidelines={components.filter((c) => c != elementComponent)}
		isDisplaySnapDigit={true}
		snapGap={true}
		snapDirections={{
			top: true,
			right: true,
			bottom: true,
			left: true,
			center: true,
			middle: true
		}}
		elementSnapDirections={{
			top: true,
			right: true,
			bottom: true,
			left: true,
			center: true,
			middle: true
		}}
		snapDigit={0}
		on:dragStart={({ detail: e }) => {
			e.set(frame.translate);
		}}
		on:drag={({ detail: e }) => {
			frame.translate = e.beforeTranslate;
			style['top'] = `${e.beforeTranslate[1]}px`;
			style['left'] = `${e.beforeTranslate[0]}px`;
			e.target.style.transform = setTranslate({ translate: e.beforeTranslate });
		}}
		on:resizeStart={({ detail: e }) => {
			e.setOrigin(['%', '%']);
			e.dragStart && e.dragStart.set(frame.translate);
		}}
		on:resize={({ detail: e }) => {
			const beforeTranslate = e.drag.beforeTranslate;
			frame.translate = beforeTranslate;
			target.style.width = `${e.width}px`;
			target.style.height = `${e.height}px`;
			style['width'] = `${e.width}px!important`;
			style['height'] = `${e.height}px!important`;
			target.style.transform = setTranslate({ translate: beforeTranslate });
		}}
		rotatable={true}
		throttleRotate={0}
		rotationPosition={'top'}
		on:rotateStart={({ detail: e }) => {
			e.set(frame.rotate);
		}}
		on:rotate={({ detail: { beforeRotate } }) => {
			frame.rotate = beforeRotate;
			style['rotate'] = `${beforeRotate}deg`;
			target.style.transform = setTranslate({ rotate: beforeRotate });
		}}
	/>
{/if}

<style>
	textarea {
		position: absolute !important;
		border: none;
		width: 100%;
		height: 100%;
		resize: none;
		overflow: hidden;
		background-color: transparent;
		transform: translate(0, 0);
	}
	textarea:focus {
		outline: none;
	}
	.element {
		container-type: inline-size;
		container-name: element;
		transition: 0.2s ease-in-out outline;
		outline: 1px solid transparent;
		width: 100%;
		position: absolute;
		user-select: auto;
	}
</style>
