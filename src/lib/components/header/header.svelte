<script>
	import Logo from '../logo.svelte';
	import EditorRight from './editor-right.svelte';
	import NonEditorRight from './non-editor-right.svelte';
	export let editor = false;
	const menuLinkClass = `text-primary cursor-pointer hover:text-accent transition`;
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<header class="flex justify-between items-center min-w-full pt-5">
	<div class="flex items-center">
		<Logo />
		<menu class="ml-7 flex items-center gap-2">
			<a href="" class={menuLinkClass}> Sites </a>
		</menu>
	</div>

	{#if !editor}
		<NonEditorRight {menuLinkClass} />
	{:else}
		<EditorRight />
	{/if}
</header>
