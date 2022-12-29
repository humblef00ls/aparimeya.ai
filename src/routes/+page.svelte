<script>
	import { Y } from "$lib/store";
	import { onMount } from "svelte";
	let h = 0;
	let w = 0;
	$: minD = Math.min(h, w);

	onMount(() => {
		setTimeout(() => {
			titleContainer.classList.remove("anime");
		}, 680);
	});
	let titleContainer;
</script>

<svelte:window bind:innerHeight={h} bind:innerWidth={w} />
<div class="blackout" class:shade={$Y / h > 0.5} />

<section id="home">
	<h1 class="mh">Hello World</h1>
	<div
		bind:this={titleContainer}
		class="title-container anime"
		style={`transform: translate3d(0%, -${
			$Y / 2 - ($Y / h) * 50
		}px, 0) scale(${1 + Math.min($Y / (h * 2), w > 600 ? 0.5 : 0.05)})`}
	>
		<h2 class="title">I am Aparimeya</h2>
	</div>
	<h4 class:slide={$Y > h / 2} class="scroll">
		<a href="#about">scroll down :)</a>
	</h4>
</section>
<section id="about">{minD}</section>
<section id="projects">projects</section>
<section id="contact">contact</section>

<style>
	@keyframes fadeInAnimation {
		0% {
			opacity: 0;
			transform: translate3d(0, -100%, 0);
		}
		100% {
			opacity: 1;
			transform: translate3d(0, 0%, 0);
		}
	}
	.mh {
		font-size: 3rem;
	}
	.title-container {
		position: fixed;
		top: calc(50% + 2rem);
		width: 345px;
		transform: translate3d(0%, 0%, 0);
		display: flex;
		background: rgba(255, 255, 255, 0.7);
		justify-content: space-evenly;
		padding: 0px 5px;
		border-radius: 6px;
	}
	.anime {
		animation: fadeInAnimation ease-in-out 0.66s;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
	}
	.title {
		text-align: center;
		padding: 10px;
		color: black;
		letter-spacing: 4px;
	}
	.blackout {
		height: 100dvh;
		width: 100vw;
		background: rgba(0, 0, 0, 0.3);
		position: fixed;
		opacity: 0;
		transition: 0.7s ease-in-out;
	}
	.shade {
		opacity: 1;
	}
	section {
		min-height: 100dvh;
		width: 100vw;
		color: white;
		position: relative;
		scroll-snap-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 100vw;
		z-index: 4;
	}

	.scroll {
		position: fixed;
		bottom: 5px;
		opacity: 1;
		left: 50%;
		transform: translate3d(-50%, 0, 0);
		transition: 0.4s ease-out;
		animation: MoveUpDown 2s ease-in-out infinite;
	}
	.slide {
		opacity: 0;
		animation-play-state: paused;
		transform: translate(-50%, 40px);
	}
	@keyframes MoveUpDown {
		0%,
		100% {
			transform: translate(-50%, -5px);
		}
		50% {
			transform: translate(-50%, -15px);
		}
	}
</style>
