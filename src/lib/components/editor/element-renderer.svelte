<script lang="ts">
	import { getUsedIds, type elementType } from '$lib/utils/elements';
	import Element from './element.svelte';
	export let elements: elementType[];
	let usedIds = getUsedIds();
	let components = [] as HTMLElement[];
	$: {
		if (usedIds.get().length > 0) {
			if (document)
				components = usedIds.get().map((id) => {
					return document.getElementById(id) as HTMLElement;
				});
		}
	}
</script>

{#if elements}
	{#each elements as element, idx (element.id)}
		<Element bind:element bind:components>
			{#if element.children && element.children.length > 0}
				<svelte:self bind:elements={element.children} />
			{/if}
		</Element>
	{/each}
{/if}
