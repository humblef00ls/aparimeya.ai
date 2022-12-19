<script>
	// import Header from './Header.svelte';
	import './styles.css';
</script>

<div class="app">
	<!-- <Header /> -->

	
		<slot />


	<!-- <footer>
		<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
	</footer> -->
</div>

<style>
	.app {
		display: flex;

		background-color: rgb(10, 10, 10);
		position: relative;
		align-items: center;
height: 100%;
	}


	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	} 

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
