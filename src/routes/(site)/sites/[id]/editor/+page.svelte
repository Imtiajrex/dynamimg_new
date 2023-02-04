<script lang="ts">
	import ToolsDrawer from '$lib/components/editor/tools-drawer.svelte';
	import Tools from '$lib/components/editor/tools.svelte';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import type { toolType } from '$lib/components/types/editor/toolType';
	import Canvas from '$lib/components/editor/canvas.svelte';
	import {
		getElements,
		setElements,
		type elementsType,
		setSelectedElement,
		type styleObjectType
	} from '$lib/utils/elements';
	import { onDestroy } from 'svelte';

	import Trix from 'trix';
	type deviceSizesType = 'desktop' | 'tablet' | 'mobile';
	setContext('active-tool-drawer', writable<toolType>(null));
	setContext('active-device-size', writable<deviceSizesType>('desktop'));
	setContext('custom-style', writable<styleObjectType | null>(null));
	setContext('adjustments-active', writable(false));
	setElements();
	setSelectedElement();
	let elements = getElements() as elementsType;
	onDestroy(() => {
		$elements = [];
	});
</script>

<div class="p-2">
	<!-- <Header editor /> -->
	<Tools />
</div>
<div class="relative w-full h-full  p-2" style="height:92vh;">
	<Canvas />
	<ToolsDrawer />
</div>
