<script lang="ts">
	import { getSelectedElement, removeElement, type elementType } from '$lib/utils/elements';
	import type { Writable } from 'svelte/store';
	import { IconTrash } from '@tabler/icons-svelte';

	export let element: elementType;
	$: ({ name, children, id, hierarchy } = element);

	let selectedElement = getSelectedElement() as Writable<string[]>;
	const remove = () => {
		removeElement({ hierarchy });
	};
	$: active = $selectedElement.includes(id);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="flex justify-between p-2 px-4 rounded-md w-full my-2 cursor-pointer shadow-sm {active
		? 'bg-black text-white'
		: 'bg-white'}"
	on:click={() => {
		$selectedElement = [id];
	}}
>
	{name}
	<button
		class="{active ? 'text-white' : 'text-black'} hover:text-red-500 transition"
		on:click={remove}
	>
		<IconTrash size={17} />
	</button>
</div>
<div class="pl-3 border-l-2 border-gray-200 border-solid">
	{#if children && children.length > 0}
		{#each children as child}
			<svelte:self bind:element={child} />
		{/each}
	{/if}
</div>
