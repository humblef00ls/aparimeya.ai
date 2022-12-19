<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
</script>

<header>
	ff { $page.url}
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

</style>
