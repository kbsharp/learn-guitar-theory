<script lang="ts">
	import { page } from '$app/state';
	import Glossary from '$lib/components/Glossary.svelte';
	import { theme, type Theme } from '../stores';

	let menuOpen = $state(false);

	function closeMenu() {
		menuOpen = false;
	}

	const themes: { id: Theme; label: string; accent: string }[] = [
		{ id: 'void',     label: 'Void',     accent: '#0ccfdf' },
		{ id: 'midnight', label: 'Midnight', accent: '#39d353' },
		{ id: 'chalk',    label: 'Chalk',    accent: '#0057ff' },
	];

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

		<div class="mobile-theme-switcher" role="group" aria-label="Colour theme">
			{#each themes as t}
				<button
					class="theme-option"
					class:active={$theme === t.id}
					onclick={() => { theme.set(t.id); closeMenu(); }}
					aria-label="Switch to {t.label} theme"
					aria-pressed={$theme === t.id}
					style="--swatch-color: {t.accent}"
				>
					<span class="dot"></span>
					{t.label}
				</button>
			{/each}
		</div>
	</nav>

	<div class="header-right">
		<div class="theme-switcher" role="group" aria-label="Colour theme">
			{#each themes as t}
				<button
					class="theme-option"
					class:active={$theme === t.id}
					onclick={() => theme.set(t.id)}
					aria-label="Switch to {t.label} theme"
					aria-pressed={$theme === t.id}
					style="--swatch-color: {t.accent}"
				>
					<span class="dot"></span>
					{t.label}
				</button>
			{/each}
		</div>

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
	</div>
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
		border-bottom: 1px solid color-mix(in srgb, var(--text-primary) 8%, transparent);
		position: sticky;
		top: 0;
		z-index: 100;
		transition: background-color 0.4s ease;

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
		transition: opacity 0.2s ease, color 0.4s ease;
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
			border-bottom: 1px solid color-mix(in srgb, var(--text-primary) 8%, transparent);
			z-index: 99;
			transition: background-color 0.4s ease;

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
			background: color-mix(in srgb, var(--text-primary) 5%, transparent);
		}

		&.active {
			color: var(--accent-note);
			background: color-mix(in srgb, var(--accent-note) 8%, transparent);
		}

		@media (max-width: 768px) {
			padding: 12px 14px;
			font-size: 12px;
		}
	}

	.mobile-theme-switcher {
		display: none;
		gap: 4px;
		padding: 8px 14px;
		margin-top: 4px;
		border-top: 1px solid color-mix(in srgb, var(--text-primary) 8%, transparent);

		@media (max-width: 768px) {
			display: flex;
		}
	}

	// ── Theme switcher ────────────────────────────────────────────
	.header-right {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.theme-switcher {
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 3px;
		background: color-mix(in srgb, var(--text-primary) 5%, transparent);
		border: 1px solid color-mix(in srgb, var(--text-primary) 9%, transparent);
		border-radius: 20px;
		transition: background 0.4s ease, border-color 0.4s ease;

		@media (max-width: 768px) {
			display: none;
		}
	}

	.theme-option {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 4px 10px;
		border-radius: 16px;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-muted);
		cursor: pointer;
		border: none;
		background: transparent;
		min-height: unset;
		white-space: nowrap;
		transition: background 0.18s ease, color 0.18s ease;

		.dot {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: var(--swatch-color);
			flex-shrink: 0;
			transition: transform 0.18s ease, opacity 0.18s ease;
			opacity: 0.5;
		}

		&:hover:not(.active) {
			color: var(--text-primary);

			.dot { opacity: 0.8; }
		}

		&.active {
			background: color-mix(in srgb, var(--text-primary) 9%, transparent);
			color: var(--text-primary);

			.dot {
				opacity: 1;
				transform: scale(1.2);
			}
		}
	}

	// ── Hamburger ─────────────────────────────────────────────────
	.hamburger {
		display: none;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		width: 40px;
		height: 40px;
		min-height: unset; // override global 44px mobile rule
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
			background: color-mix(in srgb, var(--text-primary) 5%, transparent);
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
