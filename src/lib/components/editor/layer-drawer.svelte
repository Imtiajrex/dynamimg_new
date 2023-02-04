<script lang="ts">
	import { getElements, type elementsType } from '$lib/utils/elements';

	import Drawer from './drawer.svelte';
	import Layer from './layer.svelte';
	export let show = false;
	const elements = getElements() as elementsType;
</script>

{#if show}
	<Drawer>
		<h2 class="text-cl font-bold">Layers</h2>
		<div>
			{#each $elements as element}
				<Layer bind:element />
			{/each}
		</div>
	</Drawer>
{/if}
