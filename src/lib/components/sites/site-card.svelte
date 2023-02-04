<script lang="ts">
	import { IconEdit, IconExternalLink } from '@tabler/icons-svelte';

	export let name: string = 'Name Placeholder';
	export let link: string = 'https://test.test.com';
	export let id: string = 'q12ooaid';
	export let image: string =
		'https://cdn.dribbble.com/userupload/2970030/file/original-b405f07b44b99610820219e22202c3a4.png?resize=400x0';
</script>

<div
	class="md:max-w-xs w-full md:h-72 h-80 rounded-lg bg-white hover:-translate-y-1 transition shadow-sm overflow-hidden"
>
	<div class="group relative md:h-44 h-52 w-full">
		<a
			href="/sites/{id}/editor"
			class="flex items-center justify-center gap-2 text-white font-bold group-hover:opacity-100 opacity-0 bg-black/50 transition w-full h-full absolute cursor-pointer"
		>
			<IconEdit size={30} />
			Edit Site
		</a>
		<img src={image} alt={name} class="rounded-md h-full object-cover w-full" />
	</div>
	<div class="p-5">
		<h4 class="text-lg font-bold text-primary">
			{name}
		</h4>
		<a
			href={link}
			target="_blank"
			rel="noreferrer"
			class="text-sm text-accent hover:brightness-110 active:brightness-90 transition flex items-end gap-1"
		>
			{link}
			<IconExternalLink />
		</a>
	</div>
</div>
