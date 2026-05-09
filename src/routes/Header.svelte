<script lang="ts">
	import { page } from '$app/state';
	import Glossary from '$lib/components/Glossary.svelte';

	let menuOpen = $state(false);

	function closeMenu() {
		menuOpen = false;
	}

	$effect(() => {
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<header>
	<a href="/" class="logo" onclick={closeMenu}>Fretboard Lab</a>

	<nav class:open={menuOpen}>
		<a href="/guitar-theory" class:active={page.url.pathname.startsWith('/guitar-theory')} onclick={closeMenu}>
			Explorer
		</a>
		<a href="/chord-scale" class:active={page.url.pathname.startsWith('/chord-scale')} onclick={closeMenu}>
			Chord-Scale
		</a>
		<a href="/diatonic" class:active={page.url.pathname.startsWith('/diatonic')} onclick={closeMenu}>
			Diatonic
		</a>
		<a href="/caged" class:active={page.url.pathname.startsWith('/caged')} onclick={closeMenu}>
			CAGED
		</a>
		<a href="/progressions" class:active={page.url.pathname.startsWith('/progressions')} onclick={closeMenu}>
			Progressions
		</a>
		<Glossary />
	</nav>

	<button
		class="hamburger"
		class:open={menuOpen}
		onclick={() => (menuOpen = !menuOpen)}
		aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
		aria-expanded={menuOpen}
	>
		<span></span>
		<span></span>
		<span></span>
	</button>
</header>

{#if menuOpen}
	<div
		class="nav-backdrop"
		role="button"
		tabindex="-1"
		aria-label="Close navigation"
		onclick={closeMenu}
		onkeydown={(e) => e.key === 'Escape' && closeMenu()}
	></div>
{/if}

<style lang="scss">
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32px;
		height: 56px;
		background: var(--bg-surface);
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		position: sticky;
		top: 0;
		z-index: 100;

		@media (max-width: 768px) {
			padding: 0 16px;
		}
	}

	.logo {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent-note);
		text-decoration: none;
		transition: opacity 0.2s ease;
		flex-shrink: 0;

		&:hover {
			opacity: 0.8;
		}
	}

	nav {
		display: flex;
		gap: 4px;

		@media (max-width: 768px) {
			display: none;
			position: fixed;
			top: 56px;
			left: 0;
			right: 0;
			flex-direction: column;
			gap: 2px;
			padding: 12px 12px 20px;
			background: var(--bg-surface);
			border-bottom: 1px solid rgba(255, 255, 255, 0.06);
			z-index: 99;

			&.open {
				display: flex;
			}
		}
	}

	nav a,
	nav :global(.glossary-trigger) {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--text-muted);
		text-decoration: none;
		padding: 6px 14px;
		border-radius: var(--radius-sm);
		transition: color 0.2s ease, background 0.2s ease;

		&:hover {
			color: var(--text-primary);
			background: rgba(255, 255, 255, 0.04);
		}

		&.active {
			color: var(--accent-note);
			background: rgba(12, 207, 223, 0.08);
		}

		@media (max-width: 768px) {
			padding: 12px 14px;
			font-size: 12px;
		}
	}

	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		width: 40px;
		height: 40px;
		padding: 8px;
		background: transparent;
		border: none;
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: background 0.2s ease;

		span {
			display: block;
			width: 100%;
			height: 1.5px;
			background: var(--text-muted);
			border-radius: 2px;
			transform-origin: center;
			transition: transform 0.25s ease, opacity 0.25s ease, background 0.2s ease;
		}

		&:hover {
			background: rgba(255, 255, 255, 0.04);
			span { background: var(--text-primary); }
		}

		&.open {
			span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
			span:nth-child(2) { opacity: 0; transform: scaleX(0); }
			span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
		}

		@media (max-width: 768px) {
			display: flex;
		}
	}

	.nav-backdrop {
		position: fixed;
		inset: 0;
		top: 56px;
		z-index: 98;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(2px);
	}
</style>
