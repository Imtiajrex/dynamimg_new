<script>
	import { fly } from 'svelte/transition';

	export let className = 'top-0 left-0 max-w-sm rounded-r-xl';
	export let x = -500;
</script>

<div
	transition:fly={{ x }}
	class={`w-full h-full absolute p-5 bg-bg border-solid border-2 border-gray-200 ${className}`}
>
	<slot />
</div>
