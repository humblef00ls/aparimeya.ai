<script>
	import { page } from "$app/stores";
	$: hash = $page.url.hash

	export let y = 0
</script>
<svelte:window bind:innerHeight={h} />


<style>


</style>
