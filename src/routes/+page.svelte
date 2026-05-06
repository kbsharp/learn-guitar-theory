<svelte:head>
	<title>Fretboard Lab</title>
	<meta name="description" content="An interactive theory lab for guitarists" />
</svelte:head>

<div class="home">
	<div class="hero">
		<h1>Fretboard Lab</h1>
		<p class="tagline">An interactive theory lab for guitarists</p>
	</div>

	<div class="tools">
		<a href="/guitar-theory" class="tool-card">
			<div class="card-accent cyan"></div>
			<h2>Fretboard Explorer</h2>
			<p>
				Visualise scales and modes across the full neck. All 7 modes, pentatonics, and blues —
				with a scale degree toggle.
			</p>
			<span class="card-link">Open tool →</span>
		</a>

		<a href="/chord-scale" class="tool-card">
			<div class="card-accent rose"></div>
			<h2>Chord-Scale</h2>
			<p>
				Pick any chord and see which notes work. Chord tones, scale tensions, and avoid notes —
				colour-coded on the fretboard.
			</p>
			<span class="card-link">Open tool →</span>
		</a>

		<a href="/diatonic" class="tool-card">
			<div class="card-accent mixed"></div>
			<h2>Diatonic Chords</h2>
			<p>
				Explore every chord in a key. Click a Roman numeral and see its tones across the neck
				in context of the parent scale.
			</p>
			<span class="card-link">Open tool →</span>
		</a>
	</div>
</div>

<style lang="scss">
	.home {
		max-width: 1100px;
		margin: 0 auto;
		padding: 80px 32px 64px;
	}

	.hero {
		text-align: center;
		margin-bottom: 64px;

		h1 {
			font-size: 42px;
			font-weight: 700;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--text-primary);
			margin: 0 0 16px;
		}

		.tagline {
			font-size: 14px;
			color: var(--text-muted);
			letter-spacing: 0.08em;
			margin: 0;
		}
	}

	.tools {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	.tool-card {
		display: flex;
		flex-direction: column;
		background: var(--bg-surface);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-md);
		padding: 28px;
		text-decoration: none;
		color: inherit;
		position: relative;
		overflow: hidden;
		transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
			border-color: rgba(255, 255, 255, 0.1);
		}

		h2 {
			font-size: 16px;
			font-weight: 700;
			letter-spacing: 0.04em;
			color: var(--text-primary);
			margin: 16px 0 10px;
		}

		p {
			font-size: 13px;
			line-height: 1.6;
			color: var(--text-muted);
			margin: 0 0 20px;
			flex: 1;
		}

		.card-link {
			font-size: 11px;
			font-weight: 600;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			color: var(--text-muted);
			transition: color 0.2s ease;
		}

		&:hover .card-link {
			color: var(--accent-note);
		}
	}

	.card-accent {
		height: 3px;
		border-radius: 2px;
		margin: -28px -28px 0;
		width: calc(100% + 56px);

		&.cyan {
			background: var(--accent-note);
		}

		&.rose {
			background: var(--accent-tonic);
		}

		&.mixed {
			background: linear-gradient(90deg, var(--accent-note), var(--accent-tonic));
		}
	}
</style>
