<script lang="ts">
	import type { customStyleType } from '$lib/utils/elements';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Drawer from './drawer.svelte';

	export let show = false;

	let customStyleContext = getContext('custom-style') as Writable<{
		style: customStyleType;
		id: string;
	}>;
</script>

{#if show && $customStyleContext}
	<Drawer className={'top-0 right-0 rounded-l-lg max-w-xs'} x={500}>
		<h5 class="text-xl font-bold">Adjustments</h5>
		{#if $customStyleContext}
			<h6 class="text-lg font-bold">Desktop</h6>
			<input bind:value={$customStyleContext.style.desktop} />
			<h6 class="text-lg font-bold">Mobile</h6>
			<input bind:value={$customStyleContext.style.mobile} />
			<h6 class="text-lg font-bold">Tablet</h6>
			<input bind:value={$customStyleContext.style.tablet} />
		{/if}
	</Drawer>
{/if}
