<script>
	import Header from '$lib/components/header/header.svelte';
	import '../../app.postcss';
</script>

<div class=" max-w-7xl p-5 w-full mx-auto min-h-screen text-black">
	<Header />
	<slot />
</div>
