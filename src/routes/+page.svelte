<script>
	import { Y, R } from "$lib/store";
	import Card from "$lib/Card.svelte";
	import { onMount } from "svelte";
	let h = 0;
	let w = 0;
	let t = 0;
	let sizer = 60;
	let RadB = 130;
	import PDFx from "$lib/Aparimeya_Resume.pdf";
	import projects from "$lib/projects.js";
	let offSets = projects.map((_) => [
		Math.round(Math.random() * 1000 - 500) / 10,
		Math.round(Math.random() * 1000 - 500) / 10,
	]);
	$: in1 = Math.min(1, $R);
	import vert from "$lib/images/vert2.jpg";
	onMount(() => {
		setTimeout(() => {
			titleContainer.classList.remove("anime");
		}, 680);

		setInterval(() => (t = t + 0.0022), 15);
		offSets;
	});
	let titleContainer;
	$: isM = w > 600 ? 0.4 : 0;
	let limP = true;
	$: MD = Math.min(h, w);
	$: Rad = Math.max(MD / 4, RadB);
</script>

<svelte:window bind:innerHeight={h} bind:innerWidth={w} />
<div class="blackout" class:shade={$R > 0.5} />

<section id="home">
	<h1 class="mh">Hello World</h1>
	<div
		bind:this={titleContainer}
		class="title-container anime"
		style={`transform: translate3d(0%, -${$Y / 2 - $R * 55}px, 0) scale(${
			1 + Math.min($R / 2, isM)
		});
		color:rgba(${255 - 255 * $R},${255 - 255 * $R},${255 - 255 * $R},1);
		background:rgba(255,255,255,${in1 - 0.2}) ;
		border-radius: ${10 + 10 * in1}px;
		`}
	>
		<h2 class="title">I am Aparimeya</h2>
	</div>
	<h4 class:slide={$Y > h / 2} class="scroll">
		<a href="#about">scroll down :)</a>
	</h4>
</section>
<section id="about">
	<article class:slideIn={$R > 0.7 && $R < 1.2}>
		<img src={vert} />
	</article>

	<article class:slideIn={$R > 0.7 && $R < 1.2} class="aboutMe">
		<h1>
			Hi! I'm a fullstack developer, UI/UX designer, digital artist, &
			prompt engineer
		</h1>

		<p>
			After graduating from Duke, I am currently building cool stuff at <a
				href="https://doordash.com">DoorDash</a
			>, & am based in the San Francisco Bay Area, CA.
		</p>
		<p>
			I love AI, space, psychology, art, and most of all creating things!
			In my free time I also sometimes try making IoT devices and EDM
			music :)
		</p>
		<p>
			Check out some of my <a href="#projects">featured projects</a>, and
			feel free to <a href="#contact">reach out</a>!
		</p>
	</article>
</section>
<section id="projects">
	{#each projects.slice(0, limP ? (w > 928 ? 6 : w > 620 ? 4 : 2) : 90) as P, i}
		<Card {P} offSet={offSets[i]} />
	{/each}
	<button
		class="seeMore"
		class:slideUp={$R > 1.8 && $R < 2.1}
		on:click={() => (limP = !limP)}
		>{limP ? "Show More" : "Show Less"}</button
	>
</section>

<section id="contact" style:--sizer={sizer}>
	<div class="cont" class:zoomed={$R > 2.7}>
		<a href="https://github.com/humblef00ls">
			<span
				class="icon "
				style={`transform: translate3d(${
					Math.cos(t + (1 / 6) * 3.14 * 2) * Rad - sizer / 2
				}px,${Math.sin(t + (1 / 6) * 3.14 * 2) * Rad - sizer / 2}px,0)`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.1"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-github"
					><path
						d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
					/></svg
				>
			</span>
		</a>
		<a href="https://www.instagram.com/aparimeya.ai/">
			<span
				class="icon "
				style={`transform: translate3d(${
					Math.cos(t + (2 / 6) * 3.14 * 2) * Rad - sizer / 2
				}px,${Math.sin(t + (2 / 6) * 3.14 * 2) * Rad - sizer / 2}px,0)`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.1"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-instagram"
					><rect
						x="2"
						y="2"
						width="20"
						height="20"
						rx="5"
						ry="5"
					/><path
						d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
					/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg
				>
			</span>
		</a>
		<a href="https://www.youtube.com/@aparimeya">
			<span
				class="icon "
				style={`transform: translate3d(${
					Math.cos(t + (3 / 6) * 3.14 * 2) * Rad - sizer / 2
				}px,${Math.sin(t + (3 / 6) * 3.14 * 2) * Rad - sizer / 2}px,0)`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.1"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-youtube"
					><path
						d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
					/><polygon
						points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
					/></svg
				>
			</span>
		</a>
		<a href="https://twitter.com/aparimeya">
			<span
				class="icon "
				style={`transform: translate3d(${
					Math.cos(t + (4 / 6) * 3.14 * 2) * Rad - sizer / 2
				}px,${Math.sin(t + (4 / 6) * 3.14 * 2) * Rad - sizer / 2}px,0)`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.1"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-twitter"
					><path
						d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
					/></svg
				>
			</span>
		</a>
		<a href="https://www.linkedin.com/in/aparimeya-taneja-1a7300162">
			<span
				class="icon "
				style={`transform: translate3d(${
					Math.cos(t + (5 / 6) * 3.14 * 2) * Rad - sizer / 2
				}px,${Math.sin(t + (5 / 6) * 3.14 * 2) * Rad - sizer / 2}px,0)`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.1"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-linkedin"
					><path
						d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
					/><rect x="2" y="9" width="4" height="12" /><circle
						cx="4"
						cy="4"
						r="2"
					/></svg
				>
			</span>
		</a>
		<a href="mailto:aparimeyataneja@gmail.com">
			<span
				class="icon "
				style={`transform: translate3d(${
					Math.cos(t + (6 / 6) * 3.14 * 2) * Rad - sizer / 2
				}px,${Math.sin(t + (6 / 6) * 3.14 * 2) * Rad - sizer / 2}px,0)`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.1"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-mail"
					><path
						d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
					/><polyline points="22,6 12,13 2,6" /></svg
				>
			</span>
		</a>
		<a class="resume" href={PDFx}>resume</a>
	</div>
</section>

<style>
	.resume {
		position: absolute;
		letter-spacing: 5px;
		padding: 15px 25px;
		backdrop-filter: blur(3px);
		-webkit-backdrop-filter: blur(3px);
		border-radius: 10px;
		text-decoration: none;
		background: rgba(235, 235, 235, 0.1);
		left: 50%;
		top: 50%;
		transform: translate3d(-50%, -50%, 0);
		font-family: "Space Mono", monospace;
		font-weight: 100;
		transition:  0.5s ease-in-out;
		opacity: .9;
	}
	.resume:hover{
		transform: translate3d(-50%, -50%, 0) scale(1.2);
		opacity: 1;
	}
	.cont {
		scale: 1.75;
		opacity: 0;
		transition: 1.2s cubic-bezier(0.37, 1.1, 0.46, 0.89);
		width: 100%;
	}
	.zoomed {
		opacity: 1 !important;
		scale: 1 !important;
	}
	.icon {
		height: 60px;
		width: 60px;
		border-radius: 10px;
		background: rgba(235, 235, 235, 0.1);
		position: absolute;
		left: 50%;
		top: 50%;
		scale: 1;
		transition: all 0.75s ease-in-out;
		backdrop-filter: blur(3px);
		-webkit-backdrop-filter: blur(3px);
		transition-property: opacity, scale;
		opacity: 0.8;
		transform-origin: center;
		padding: 10px;
		cursor: pointer;
	}
	.icon:hover {
		opacity: 1 !important;
		scale: 1.095;
	}
	.fader {
	}
	.limiter {
		overflow-y: hidden !important;
	}
	.seeMore {
		padding: 5px 15px;
		border: 2px solid white;
		background: none;
		color: white;
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translate3d(-50%, 25px, 0);
		opacity: 0;
		transition: 0.3s ease-in-out;
		font-family: "Space Mono", monospace;
		letter-spacing: 2px;
		font-size: 0.95rem;
	}
	.slideUp {
		opacity: 1;
		transform: translate3d(-50%, 0px, 0);
	}

	.aboutMe {
		padding: 10px 20px;
		background: rgba(150, 150, 150, 0.1);
		backdrop-filter: blur(0px);
		-webkit-backdrop-filter: blur(0px);
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
		transition: 0.4s ease-in-out;
		opacity: 0;
		width: min(100%, 600px);
		max-height: min(100%, 800px);
		height: 100%;
		overflow-y: scroll;
		border-radius: 20px;
		position: absolute;
	}
	#about > article:nth-of-type(1) {
		transform: translate3d(-50px, 0px, 0);
		grid-column: 1 / span 1;
		grid-row: 1 / span 1;
		padding: 0px;
		overflow: hidden;
		right: 0px;
		filter: saturate(0.8);
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
		opacity: 0.75 !important;
	}
	.slideIn:nth-of-type(2) {
		opacity: 0.95 !important;
	}
	.slideIn:hover {
		transform: translate3d(0px, 0px, 0) scale(1.025) !important;
		opacity: 1 !important;
		filter: saturate(1) !important;
		-webkit-backdrop-filter: blur(5px);
		backdrop-filter: blur(5px);
	}
	.slide {
		opacity: 0;
		animation-play-state: paused;
		transform: translate(-50%, 40px);
	}
	#projects {
		flex-wrap: wrap;
		display: flex;
		gap: 25px 30px;
		padding: 15px;
		padding-top: 70px;
		padding-bottom: 35px;
		align-content: flex-start;
		justify-content: center;
		overflow-y: scroll;
		max-height: 100%;
		max-width: max(99vw, calc(100vw - 30px));
		min-height: 95%;
		overflow-x: hidden;
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

	@media only screen and (max-width: 600px) {
		#about {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1.4fr;
			grid-gap: 30px;
			padding: 30px;
			padding-top: 177px;
		}
		.aboutMe h1 {
			font-size: 1.4rem;
			letter-spacing: 1px;
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
