<script lang="ts">
	import { getContext } from 'svelte';
	import ElementDrawer from './element-drawer.svelte';
	import LayerDrawer from './layer-drawer.svelte';
	import AdjustmentDrawer from './adjustment-drawer.svelte';
	import type { Writable } from 'svelte/store';
	import type { toolType } from '../types/editor/toolType';
	import IconDrawer from './icon-drawer.svelte';
	let tool = getContext('active-tool-drawer') as Writable<toolType>;
	let adjustment = getContext('adjustments-active') as Writable<boolean>;
</script>

<ElementDrawer show={$tool == 'add'} />
<LayerDrawer show={$tool == 'layer'} />
<AdjustmentDrawer bind:show={$adjustment} />
<IconDrawer show={$tool == 'icon'} />
