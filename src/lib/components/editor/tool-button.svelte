<script lang="ts">
	// @ts-nocheck
	import type { TablerIcon, TablerIconProps } from '@tabler/icons-svelte';

	export let Icon: any;
	export let active: boolean = false;
	export let noBG: boolean = false;
	export let onClick: () => void = () => {};
	export let className: string = '';
	export let others: any = {};
</script>

<button
	on:click={onClick}
	class={` w-7 h-7 p-1 flex items-center justify-center rounded-sm  transition ${
		active
			? 'text-accent  active:text-primary/50'
			: 'text-primary hover:text-accent active:text-accent'
	} ${!noBG && active && 'bg-accent/20 hover:bg-accent/10 hover:text-primary'} ${
		noBG && active && 'bg-transparent  border-b-2 border-accent hover:text-accent'
	} ${className}`}
	{...others}
>
	<svelte:component this={Icon} />
</button>
