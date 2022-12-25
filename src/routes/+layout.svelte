<script>
	import Header from "$lib/Header.svelte";
	import "./styles.css";

	let y = 0
	let box = null
	const handleScroll = () => {
			y = box.scrollTop
	}
</script>

<svelte:head>
	<title>aparimeya.ai</title>
	<meta name="description" content="Aparimeya Taneja's persoal website" />
</svelte:head>

<div class="app" bind:this={box}  on:scroll={handleScroll}>
	<Header {y}/>
	<slot />
	<footer>
		<p>{y} <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		background-color: rgb(10, 10, 10);
		flex-direction: column;
		scroll-snap-type: y mandatory;
		overflow: auto;
		height: 100dvh;
		scroll-behavior: smooth;
		}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
		position: fixed;
		bottom: 0px;
		color: aliceblue;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
