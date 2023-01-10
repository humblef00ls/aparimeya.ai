<script>
	import "./styles.css";

	import Simulation from "$lib/Simulation.svelte";
	import { Y, R ,V} from "$lib/store";
	import { onMount } from "svelte";
	let show = false
	let h = 0,
		w = 0,
		box;

	const handleScroll = () => {
		$Y = box.scrollTop;
		$R = box.scrollTop / h;
	};

	$: P = $Y / h + 0.4;
	let flag = false;
	onMount(() => {
		flag = true;
		$Y = box?.scrollTop ?? 0;
		$R = $Y / h;
	});
</script>

<svelte:window bind:innerHeight={h} bind:innerWidth={w} />

<svelte:head>
	<title>Aparimeya Taneja</title>
	<meta name="description" content="This website is a portfolio detailing all my projects and experiences. Learn more about me and contact me here! -aparimeya">
	<meta name="keywords" content="Aparimeya Taneja, Aparimeya, aparimeya.ai, web dev, portfolio, profile">
	<meta name="author" content="Aparimeya Taneja">
	<meta property="og:title" content="Aparimeya Taneja" />
	<meta property="og:url" content="https://aparimeya.ai" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="This website is a portfolio detailing all my projects and experiences. Learn more about me and contact me here! -aparimeya" />
	<meta property="og:image" content="https://aparimeya.ai/OGBG.png" />
</svelte:head>
{#if flag}
	<Simulation />
	<nav class:show>
		<h1 on:click={()=>show = false}>x</h1>
		<a  href="#about" on:click={()=>show = false}>about</a>
		<a  href="#projects" on:click={()=>show = false}>projects</a>
		<a  href="#contact" on:click={()=>show = false}>contact</a>
		<a target="_blank"
		rel="noreferrer"
		href="https://aparimeya.medium.com/" on:click={()=>show = false}>blog</a>
	</nav>
	<div class="app" bind:this={box} on:scroll={handleScroll} class:hider={!$V}>
		<header class:slide={$Y > h / 2}>
			{#if w > 600}
				<h3 class:expand={P >= 0 && P < 1}><a href="#home">home</a></h3>
				<h3 class:expand={P >= 0.99 && P < 2}>
					<a href="#about">about</a>
				</h3>
				<h3 class:expand={P >= 1.99 && P < 3}>
					<a href="#projects">projects</a>
				</h3>
				<h3 class:expand={P >= 2.99 && P < 4}>
					<a href="#contact">contact</a>
				</h3>
				<h3 class:expand={P >= 3.99 && P < 5}>
					<a
						target="_blank"
						rel="noreferrer"
						href="https://aparimeya.medium.com/">blog</a
					>
				</h3>
			{:else}
				<h3 class="HM" on:click={()=>show = true}>menu</h3>
			{/if}
		</header>
		<slot />
	</div>
{:else}
	<div class="loader">
		<span class="dots" />
		<span class="dots" />
		<span class="dots" />
		<span class="dots" />
		<span class="dots" />
		<span class="dots" />
		<span class="dots" />
		<span class="dots" />
	</div>
{/if}

<style>
	.hider{
		opacity: 0 !important;
	}
	nav{
		transform: translate3d(0%,-100%,0);
		height: 100dvh;
		width: 100vw;
		backdrop-filter: blur(5px);
		-webkit-backdrop-filter: blur(5px);
		background: rgba(5, 5, 5, 0.2);
		position: fixed;
		transition: ease-out 0.5s;
		z-index: 20;
		opacity: 0;
	}
	nav h1, nav a{
		color: white;
		width: 100%;
		padding: 20px;
		text-align: center;
		font-weight: lighter;
		font-size: 2rem;
		display: block;
		font-family: "Space Mono", monospace;
		letter-spacing: 3px;
		cursor: pointer;
	}


	.show{
		transform: translate3d(0%,0%,0);
		opacity: 1;
	}
	.HM{
		padding-top: 16px !important;
		cursor: pointer;
	}
	.dots {
		height: 2px;
		width: 2px;
		background: white;
		position: absolute;
	}
	.dots:nth-last-of-type(1) {
		transform: translate3d(-14px, -14px, 0);
	}
	.dots:nth-last-of-type(2) {
		transform: translate3d(-20px, 0px, 0);
	}
	.dots:nth-last-of-type(3) {
		transform: translate3d(0px, -20px, 0);
	}
	.dots:nth-last-of-type(4) {
		transform: translate3d(0px, 20px, 0);
	}
	.dots:nth-last-of-type(5) {
		transform: translate3d(14px, 14px, 0);
	}
	.dots:nth-last-of-type(6) {
		transform: translate3d(20px, 0px, 0);
	}
	.dots:nth-last-of-type(7) {
		transform: translate3d(14px, -14px, 0);
	}
	.dots:nth-last-of-type(8) {
		transform: translate3d(-14px, 14px, 0);
	}

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}
	.loader {
		width: 100vw;
		position: relative;
		height: 100dvh;
		animation: rotation 20s infinite linear;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.expand,
	header h3:hover {
		transform: scale(1.2);
		font-weight: bold;
		opacity: 1;
	}
	.app {
		display: flex;
		flex-direction: column;
		scroll-snap-type: y mandatory;
		overflow: auto;
		overflow-x: hidden;
		min-height: 100dvh;
		max-height: 100dvh;
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
		font-family: "Space Mono", monospace;
		font-weight: normal;
	}
	header h3 {
		padding: 7px;
		letter-spacing: 4px;
		transition: ease-in-out 0.33s;
		opacity: 0.575;
		font-size: 1.4rem;
	}
	.slide {
		transform: translate(0%, 0px);
	}
</style>
