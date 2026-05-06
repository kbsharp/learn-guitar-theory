<script>
	import Header from './Header.svelte';
	import './styles/main.scss';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>© Fretboard Lab</p>
	</footer>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
	}

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 24px;
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #3d4d68;
	}

	footer p {
		margin: 0;
	}
</style>
