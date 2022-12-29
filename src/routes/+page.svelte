<script>
	import { Y } from "$lib/store";
	import { onMount } from "svelte";
	let h = 0;
	let w = 0;
	$: SC = $Y / h;
	$: in1 = Math.min(1, SC);

	onMount(() => {
		setTimeout(() => {
			titleContainer.classList.remove("anime");
		}, 680);
	});
	let titleContainer;
</script>

<svelte:window bind:innerHeight={h} bind:innerWidth={w} />
<div class="blackout" class:shade={SC > 0.5} />

<section id="home">
	<h1 class="mh">Hello World</h1>
	<div
		bind:this={titleContainer}
		class="title-container anime"
		style={`transform: translate3d(0%, -${$Y / 2 - SC * 40}px, 0) scale(${
			1 + Math.min(SC / 2, w > 600 ? 0.4 : 0.05)
		});
		color:rgba(${255 - 255 * SC},${255 - 255 * SC},${255 - 255 * SC},1);
		background:rgba(255,255,255,${in1 - 0.2}) ;
		
		`}
	>
		<h2 class="title">I am Aparimeya</h2>
	</div>
	<h4 class:slide={$Y > h / 2} class="scroll">
		<a href="#about">scroll down :)</a>
	</h4>
</section>
<section id="about">
	<article class:slideIn={SC > 0.8}>
	<p>
		Hi! I am Aparimeya
	</p>
	
	
	
	</article>

	<article class:slideIn={SC > 0.8}>me</article>
	<article class:slideIn={SC > 0.8}>pix</article>
</section>
<section id="projects">projects</section>
<section id="contact">contact</section>

<style>
	#about {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		grid-gap: 50px;
		padding: 50px;
		padding-top: 180px;
	}
	#about > article {
		background: rgba(255, 255, 255, 0.1);
		padding: 20px;
		border-radius: 10px;
		transition: 0.4s ease-in-out;
		opacity: 0;
		width: 100%;
		height: 100%;

	}
	#about > article:nth-of-type(1){
		transform: translate3d(-50px, 0px, 0);
		grid-column: 1 / span 1;
		grid-row: 1 / span 2;
	}
	#about > article:nth-of-type(2) {
		transform: translate3d(50px, -50px, 0);
		grid-column: 2 / span 1;
		grid-row: 1 / span 1;
	}
	#about > article:nth-of-type(3) {
		transform: translate3d(50px, 50px, 0);
		grid-column: 2 / span 1;
		grid-row: 2 / span 1;
	}
	

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
		top: calc(50% + 2.5rem);
		width: 345px;
		transform: translate3d(0%, 0%, 0);
		display: flex;
		border: 2px solid;
		justify-content: space-evenly;
		padding: 0px 5px;
		border-radius: 10px;
		color: rgba(255, 255, 255, 1);
		background: rgba(255, 255, 255, 0);
	}
	.anime {
		animation: fadeInAnimation ease-in-out 0.66s;
		animation-iteration-count: 1;
		animation-fill-mode: forwards;
	}
	.title {
		text-align: center;
		padding: 10px;
		letter-spacing: 6px;
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
	.slideIn {
		transform: translate3d(0px, 0px, 0) !important;
		opacity: 1 !important;
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
