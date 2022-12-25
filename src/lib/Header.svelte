<script>
	import { page } from "$app/stores";
	$: hash = $page.url.hash
let h
	export let y = 0
</script>
<svelte:window bind:innerHeight={h} />
<header class:slide={y > h/3}>
	<a href="#about">{y} j</a>s
	<h3>head</h3>
</header>

<style>
	header {
		text-align: left;
		width: 100%;
		color: white;
		position: absolute;
		top: 0px;
		transition: .2s ease-out;
		transform: translate(0%,-100%);
	}
.slide{
	transform: translate(0%,0px);

}

</style>
