<script>
	import { Y } from "$lib/store";
	import { onMount } from "svelte";
	let h = 0;
	let w = 0;
	$: SC = $Y / h;
	$: in1 = Math.min(1, SC);
	import vert from "$lib/images/vert2.jpg";
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
		style={`transform: translate3d(0%, -${$Y / 2 - SC * 50}px, 0) scale(${
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
	<article class:slideIn={SC > 0.7 && SC < 1.2}>
		<img src={vert} />
	</article>

	<article class:slideIn={SC > 0.7 && SC < 1.2} class="aboutMe">
		<h1>
			Hi! I'm a fullstack developer, UI/UX designer, digital artist, &
			prompt engineer
		</h1>

		<p>
			I make cool stuff at <a href="https://doordash.com">DoorDash</a> & am
			currently based in the San Francisco Bay Area, CA.
		</p>
		<p>
			I love AI, space, psychology, art, and most of all creating things!
			In my free time I also sometimes try making IoT devices and EDM music
			:)
		</p>
		<p>
			Check out some of my featured projects and works <a href="#projects"
				>here</a
			>, and feel free to reach out <a href="#contact">here</a>!
		</p>
		<p>
			My goal is to leverage AI to build automations and develop apps that improve the lives of as many people as possible.
		</p>
	</article>
</section>
<section id="projects">projects</section>
<section id="contact">contact</section>

<style>
	.aboutMe {
		padding: min(40px, max(3vw, 20px));
	}
	.aboutMe h1 {
		font-size: 1.75rem;
	}
	.aboutMe p {
		margin-top: 20px;
		font-size: 1.15rem;
	}
	.aboutMe a {
		font-weight: 900;
	}
	img {
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: right;
	}
	#about {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		grid-gap: 50px;
		padding: 50px;
		padding-top: 210px;
	}
	#about > article {
		background: rgba(255, 255, 255, 0.08);
		border-radius: 20px;
		transition: 0.4s ease-in-out;
		opacity: 0;
		width: min(100%, 550px);
		max-height: 100%;
		height: 100%;
		overflow-y: auto;
		position: absolute;
	}
	#about > article:nth-of-type(1) {
		transform: translate3d(-50px, 0px, 0);
		grid-column: 1 / span 1;
		grid-row: 1 / span 1;
		padding: 0px;
		overflow: hidden;
		right: 0px;
		filter:saturate(.75);
	}
	#about > article:nth-of-type(2) {
		transform: translate3d(50px, 0px, 0);
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
		opacity: 0.875 !important;
		-webkit-backdrop-filter: blur(5px);
		backdrop-filter: blur(5px);
	}
	.slideIn:hover {
		transform: translate3d(0px, 0px, 0) scale(1.025) !important;
		opacity: 1 !important;

		background: rgba(255, 255, 255, 0.0875) !important;
		filter:saturate(1);
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
	@media only screen and (max-width: 750px) {
		#about {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1.25fr;
			grid-gap: 25px;
			padding: 20px;
			padding-top: 180px;
		}
		.aboutMe h1 {
			font-size: 1.5rem;
		}

		#about > article:nth-of-type(1) {
			grid-column: 1 / span 1;
			grid-row: 1 / span 1;
			overflow: hidden;
		}
		#about > article:nth-of-type(2) {
			grid-column: 1 / span 1;
			grid-row: 2 / span 1;
		}
		#about > article:nth-of-type(3) {
			grid-column: 1 / span 1;
			grid-row: 2 / span 1;
		}
	}
</style>
