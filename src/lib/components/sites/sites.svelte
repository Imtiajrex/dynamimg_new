<script>
	import { IconPlus } from '@tabler/icons-svelte';
	import Button from '../button.svelte';
	import SiteCard from './site-card.svelte';
	const sites = [{}, {}];
</script>

<div class="mt-24">
	<div class="flex items-center">
		<h3 class="text-3xl font-bold ">My Sites</h3>
		<Button className="ml-5">
			Add new site <IconPlus />
		</Button>
	</div>
	<div class="flex items-center flex-wrap gap-8 mt-12 justify-center md:justify-start">
		{#each sites as site}
			<SiteCard {...site} />
		{/each}
	</div>
</div>
