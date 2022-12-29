<script>
	import { Y } from "$lib/store";
	let h = 0;
</script>

<svelte:window bind:innerHeight={h} />
<div class="blackout" class:shade={$Y / h > 0.5} />

<section id="home">
	<div class="title-container">
		<h1 class="mh">Hello World</h1>
		<h2 class="title">I am Aparimeya</h2>
	</div>
	<h4 class:slide={$Y > h / 2} class="scroll">
		<a href="#about">scroll down :)</a>
	</h4>
</section>
<section id="about">about</section>
<section id="projects">projects</section>
<section id="contact">contact</section>

<style>
	@keyframes fadeInAnimation {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	.mh {
		font-size: 3rem;
	}
	.title-container {

		position: relative;
	}
	.title {
		position: absolute;
		width: 100%;
		text-align: center;
		letter-spacing: 8px;
		animation: fadeInAnimation ease 3s;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
		padding: 4px;
		background: white;
		color:black;
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
