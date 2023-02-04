<script lang="ts">
	export let className: string = '';
</script>

<button
	class={' bg-primary text-white px-10 py-2 flex items-center justify-center rounded-lg hover:scale-105 active:scale-95 transition ' +
		className}
>
	<slot />
</button>
