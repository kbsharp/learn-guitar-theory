<script lang="ts">
	import { page } from '$app/state';
</script>

<header>
	<a href="/" class="logo">Fretboard Lab</a>

	<nav>
		<a href="/guitar-theory" class:active={page.url.pathname.startsWith('/guitar-theory')}>
			Explorer
		</a>
		<a href="/chord-scale" class:active={page.url.pathname.startsWith('/chord-scale')}>
			Chord-Scale
		</a>
		<a href="/diatonic" class:active={page.url.pathname.startsWith('/diatonic')}>
			Diatonic
		</a>
	</nav>
</header>

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
	}

	.logo {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent-note);
		text-decoration: none;
		transition: opacity 0.2s ease;

		&:hover {
			opacity: 0.8;
		}
	}

	nav {
		display: flex;
		gap: 4px;
	}

	nav a {
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
	}
</style>
