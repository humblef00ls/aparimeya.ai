<script>
	import "./styles.css";

	import Simulation from "$lib/Simulation.svelte";
	import { Y } from "$lib/store";
	let h = 0,w=0,
		box;

	const handleScroll = () => {
		$Y = box.scrollTop;
	};

	$: P = ($Y / h)+.4
</script>

<svelte:window bind:innerHeight={h} bind:innerWidth={w} />

<svelte:head>
	<title>aparimeya.ai</title>
	<meta name="description" content="Aparimeya Taneja's persoal website" />
</svelte:head>
<Simulation />
<div class="app" bind:this={box} on:scroll={handleScroll} >
	<header class:slide={$Y > h / 2}>
		{#if w >600}
		<h3 class:expand={P >= 0 && P < 1}><a href="#home">home</a></h3>
		<h3 class:expand={P >= 0.99 && P < 2}><a href="#about">about</a></h3>
		<h3 class:expand={P >= 1.99 && P < 3}><a href="#projects">projects</a></h3>
		<h3 class:expand={P >= 2.99 && P < 4}><a href="#contact">contact</a></h3>
		<h3 class:expand={P >= 3.99 && P < 5}><a href="/blog">blog</a></h3>
		{/if}
	</header>
	<slot />
</div>

<style>
	.expand,	header h3:hover {
		transform: scale(1.2);
		font-weight: bold;
		opacity:1
	}
	.app {
		display: flex;
		flex-direction: column;
		scroll-snap-type: y mandatory;
		overflow: auto;
		overflow-x: hidden;
		height: 100dvh;
		scroll-behavior: smooth;
		max-width: 100vw;

	}

	header {
		text-align: left;
		width: 100%;
		color: white;
		position: absolute;
		top: 0px;
		transition: 0.25s ease-out;
		transform: translate(0%, -100%);
		display: flex;
		padding: 15px;
		background: linear-gradient(
			0deg,
			rgba(255, 0, 0, 0),
			rgba(0, 0, 0, 0.5)
		);
		z-index: 8;
	}
	header a {
		text-decoration: none;
		color: white;
		font-family: 'Space Mono', monospace;
font-weight: normal;
	}
	header h3 {
		padding: 7px;
		letter-spacing: 4px;
		transition: ease-in-out 0.33s;
		opacity: .575;
		font-size: 1.4rem;
	}
	.slide {
		transform: translate(0%, 0px);
	}
</style>
