<script lang="ts">
	import '@fontsource/fira-mono';
	import type { Snippet } from 'svelte';
	import Header from './Header.svelte';
	import './styles/main.scss';
	import { theme } from '../stores';

	let { children }: { children: Snippet } = $props();

	$effect(() => {
		document.documentElement.setAttribute('data-theme', $theme);
	});
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
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
		color: var(--text-muted);
	}

	footer p {
		margin: 0;
	}
</style>
