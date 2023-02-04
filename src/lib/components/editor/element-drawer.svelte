<script lang="ts">
	import { elementsList } from '$lib/utils/elements';
	import Drawer from './drawer.svelte';
	import ElementCard from './element-card.svelte';

	export let show = false;
</script>

{#if show}
	<Drawer className="top-0 left-0 rounded-r-xl w-40">
		<h3 class="text-xl">Elements</h3>
		<div class="flex  gap-3 flex-wrap mt-5">
			{#each elementsList as element}
				<ElementCard {...element} />
			{/each}
		</div>
	</Drawer>
{/if}
