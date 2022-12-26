<script>

	import "./styles.css";
	import Simulation from "$lib/Simulation.svelte";
	let y = 0,
		h = 0,
		box;

	const handleScroll = () => {
		y = box.scrollTop;
	};

</script>

<svelte:window bind:innerHeight={h} />

<svelte:head>
	<title>aparimeya.ai</title>
	<meta name="description" content="Aparimeya Taneja's persoal website" />
</svelte:head>
<Simulation {y}/>
<div class="app" bind:this={box} on:scroll={handleScroll}>
	<header class:slide={y > h / 3}>
		<h3><a href="#home">home</a></h3>
		<h3><a href="#about">about</a></h3>
		<h3><a href="#projects">projects</a></h3>
		<h3><a href="#contact">contact</a></h3>
		<h3><a href="/blog">blog</a></h3>
	</header>
	<slot />
</div>

<style>
	.app {
		display: flex;
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
		padding: 10px;
		width: 100vw;
		position: fixed;
		bottom: 0px;
		color: aliceblue;
		background-color: blue;
		transition: 0.25s ease-out;
		transform: translate(0%, 100%);
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
		padding:15px;
		background: linear-gradient(0deg,rgba(255,0,0,0), rgba(0, 0, 0, 0.5));
		
	}
	header a {
		text-decoration: none;
		color: white;
	}
	header h3{
		padding: 4px;
		background: red;
	}
	.slide {
		transform: translate(0%, 0px);
	}
</style>
