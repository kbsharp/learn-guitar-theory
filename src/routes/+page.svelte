<script lang="ts">
	import { onMount } from 'svelte';

	// E minor pentatonic across the neck for the animated background
	const STRING_Y = [8.5, 25.5, 42, 58.5, 75, 91.5]; // % from top per string (high e → low E)

	interface NotePoint { s: number; f: number; r: boolean; }
	const notes: NotePoint[] = [
		// high e: E G A B D E
		{ s: 0, f: 0, r: true }, { s: 0, f: 3, r: false }, { s: 0, f: 5, r: false },
		{ s: 0, f: 7, r: false }, { s: 0, f: 10, r: false }, { s: 0, f: 12, r: true },
		// B: B D E G A B
		{ s: 1, f: 0, r: false }, { s: 1, f: 3, r: false }, { s: 1, f: 5, r: true },
		{ s: 1, f: 8, r: false }, { s: 1, f: 10, r: false }, { s: 1, f: 12, r: false },
		// G: G A B D E G
		{ s: 2, f: 0, r: false }, { s: 2, f: 2, r: false }, { s: 2, f: 4, r: false },
		{ s: 2, f: 7, r: false }, { s: 2, f: 9, r: true }, { s: 2, f: 12, r: false },
		// D: D E G A B D
		{ s: 3, f: 0, r: false }, { s: 3, f: 2, r: true }, { s: 3, f: 5, r: false },
		{ s: 3, f: 7, r: false }, { s: 3, f: 9, r: false }, { s: 3, f: 12, r: false },
		// A: A B D E G A
		{ s: 4, f: 0, r: false }, { s: 4, f: 2, r: false }, { s: 4, f: 5, r: false },
		{ s: 4, f: 7, r: true }, { s: 4, f: 10, r: false }, { s: 4, f: 12, r: false },
		// low E: E G A B D E
		{ s: 5, f: 0, r: true }, { s: 5, f: 3, r: false }, { s: 5, f: 5, r: false },
		{ s: 5, f: 7, r: false }, { s: 5, f: 10, r: false }, { s: 5, f: 12, r: true },
	];

	const noteLeft = (f: number) => `${(f / 12) * 88 + 5}%`;
	const noteTop  = (s: number) => `${STRING_Y[s]}%`;
	// negative delay = already in progress at page load; creates a wave from left to right
	const noteDelay = (f: number) => `${-(f / 12) * 9}s`;

	const features = [
		{
			num: '01',
			href: '/guitar-theory',
			name: 'Fretboard Explorer',
			desc: 'Every mode, pentatonic, and blues scale across the full neck — with scale degree overlay and 5-position box navigation.',
			accent: 'cyan',
		},
		{
			num: '02',
			href: '/caged',
			name: 'CAGED System',
			desc: 'See all five chord shapes for any root. Switch between major and minor, focus any shape, and connect chord voicings across the entire neck.',
			accent: 'rose',
		},
		{
			num: '03',
			href: '/chord-scale',
			name: 'Chord — Scale',
			desc: 'Pick any chord and the fretboard tells you exactly which notes work. Chord tones, compatible scale, and avoid notes — colour-coded.',
			accent: 'cyan',
		},
		{
			num: '04',
			href: '/diatonic',
			name: 'Diatonic Chords',
			desc: 'Explore every chord in a key with Roman numeral navigation. Click I through VII and watch the fretboard show chord and scale tones together.',
			accent: 'rose',
		},
		{
			num: '05',
			href: '/progressions',
			name: 'Progression Builder',
			desc: 'Build a four-chord progression and step through it. Each chord lights up its tones and recommended improvisation scale in real time.',
			accent: 'mixed',
		},
	];

	let heroEntered = $state(false);
	let featureEls = $state<HTMLElement[]>([]);

	onMount(() => {
		requestAnimationFrame(() => { heroEntered = true; });

		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((e) => {
					if (e.isIntersecting) {
						(e.target as HTMLElement).classList.add('visible');
						io.unobserve(e.target);
					}
				});
			},
			{ threshold: 0.15 }
		);
		featureEls.forEach((el) => el && io.observe(el));
		return () => io.disconnect();
	});
</script>

<svelte:head>
	<title>Fretboard Lab</title>
	<meta name="description" content="Five interactive music theory tools for guitarists. No sheet music required." />
</svelte:head>

<!-- ── HERO ─────────────────────────────────────────────────── -->
<section class="hero">
	<div class="hero-content" class:entered={heroEntered}>
		<span class="eyebrow">Interactive theory for guitarists</span>

		<h1>
			<span class="h1-line thin">Fretboard</span>
			<span class="h1-line bold">Lab<span class="dot">.</span></span>
		</h1>

		<p class="hero-tagline">
			Five tools. One neck.<br />No sheet music required.
		</p>

		<a href="/guitar-theory" class="hero-cta">
			<span>Start exploring</span>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</a>
	</div>

	<!-- Animated fretboard background -->
	<div class="fretboard-bg" aria-hidden="true">
		<!-- Strings -->
		<div class="strings">
			{#each [1, 1.5, 2, 2.5, 3, 3.5] as thickness}
				<div class="string" style="height: {thickness}px;"></div>
			{/each}
		</div>

		<!-- Fret inlay dots -->
		{#each [3, 5, 7, 9] as fret}
			<div class="inlay" style="left: {(fret / 12) * 88 + 5}%;"></div>
		{/each}
		<div class="inlay double" style="left: {(12 / 12) * 88 + 5}%;"></div>

		<!-- Animated note circles -->
		{#each notes as note}
			<div
				class="note"
				class:root={note.r}
				style="left: {noteLeft(note.f)}; top: {noteTop(note.s)}; animation-delay: {noteDelay(note.f)};"
			></div>
		{/each}

		<!-- Fade overlays -->
		<div class="fade-left"></div>
		<div class="fade-right"></div>
		<div class="fade-top"></div>
	</div>
</section>

<!-- ── MARQUEE ────────────────────────────────────────────────── -->
<div class="marquee-strip" aria-hidden="true">
	<div class="marquee-track">
		{#each Array(2) as _}
			<span>Fretboard Explorer</span>
			<span class="sep">·</span>
			<span>CAGED System</span>
			<span class="sep">·</span>
			<span>Chord — Scale</span>
			<span class="sep">·</span>
			<span>Diatonic Chords</span>
			<span class="sep">·</span>
			<span>Progression Builder</span>
			<span class="sep">·</span>
			<span>Scale Positions</span>
			<span class="sep">·</span>
		{/each}
	</div>
</div>

<!-- ── FEATURES ───────────────────────────────────────────────── -->
<section class="features">
	{#each features as feature, i}
		<a
			href={feature.href}
			class="feature-row accent-{feature.accent}"
			bind:this={featureEls[i]}
			style="transition-delay: 0s;"
		>
			<span class="feature-num">{feature.num}</span>

			<div class="feature-body">
				<h2 class="feature-name">{feature.name}</h2>
				<p class="feature-desc">{feature.desc}</p>
			</div>

			<div class="feature-arrow">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
		</a>
	{/each}
</section>

<!-- ── BOTTOM CTA ─────────────────────────────────────────────── -->
<section class="bottom-cta">
	<p class="bottom-label">Ready to see the neck differently?</p>
	<a href="/guitar-theory" class="bottom-link">
		Open Fretboard Explorer
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	</a>
</section>

<style lang="scss">
/* ── HERO ──────────────────────────────────────────────────── */
.hero {
	position: relative;
	height: 100vh;
	min-height: 640px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background:
		radial-gradient(ellipse 80% 60% at 50% 20%, color-mix(in srgb, var(--accent-note) 4%, transparent) 0%, transparent 70%),
		var(--bg-base);
}

.hero-content {
	position: relative;
	z-index: 10;
	text-align: center;
	padding: 0 24px;
	margin-top: -60px; /* shift text up from vertical center so fretboard shows below */

	@media (max-width: 768px) {
		margin-top: -20px;
		padding: 0 20px;
	}

	.eyebrow {
		display: block;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.28em;
		text-transform: uppercase;
		color: var(--accent-note);
		margin-bottom: 32px;
		opacity: 0;
		transform: translateY(12px);
		transition: opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s;
	}

	h1 {
		margin: 0 0 28px;
		line-height: 0.9;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.h1-line {
		display: block;
		opacity: 0;
		transform: translateY(24px);

		&.thin {
			font-size: clamp(64px, 10vw, 120px);
			font-weight: 100;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--text-primary);
			transition: opacity 1s ease 0.25s, transform 1s ease 0.25s;
		}

		&.bold {
			font-size: clamp(64px, 10vw, 120px);
			font-weight: 700;
			letter-spacing: 0.04em;
			text-transform: uppercase;
			color: var(--text-primary);
			transition: opacity 1s ease 0.38s, transform 1s ease 0.38s;
		}
	}

	.dot {
		color: var(--accent-note);
	}

	.hero-tagline {
		font-size: 13px;
		font-weight: 300;
		letter-spacing: 0.12em;
		color: var(--text-muted);
		line-height: 1.9;
		margin: 0 0 40px;
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s;
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--bg-base);
		background: var(--accent-note);
		text-decoration: none;
		padding: 14px 28px;
		border-radius: var(--radius-sm);
		opacity: 0;
		transform: translateY(16px);
		transition:
			opacity 0.9s ease 0.65s,
			transform 0.9s ease 0.65s,
			background-color 0.2s ease,
			box-shadow 0.2s ease;

		svg { transition: transform 0.2s ease; }

		&:hover {
			background: #0fe8fb;
			box-shadow: 0 0 32px color-mix(in srgb, var(--accent-note) 40%, transparent);
			svg { transform: translateX(3px); }
		}
	}

	/* Triggered on mount */
	&.entered {
		.eyebrow, .h1-line, .hero-tagline, .hero-cta {
			opacity: 1;
			transform: none;
		}
	}
}

/* ── FRETBOARD BG ──────────────────────────────────────────── */
.fretboard-bg {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 320px;
	pointer-events: none;
}

.strings {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 14px 5% 14px;

	.string {
		width: 100%;
		background: var(--color-string);
		opacity: 0.3;
		border-radius: 2px;
	}
}

.inlay {
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: var(--color-dot);
	opacity: 0.12;

	&.double {
		top: 35%;

		&::after {
			content: '';
			position: absolute;
			top: calc(100% + 48px); /* string spacing */
			left: 0;
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background: var(--color-dot);
		}
	}
}

@keyframes note-wave {
	0%, 100% {
		opacity: 0.06;
		transform: translate(-50%, -50%) scale(0.75);
		filter: none;
	}
	8% {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1.2);
		filter: drop-shadow(0 0 10px var(--note-glow));
	}
	22% {
		opacity: 0.1;
		transform: translate(-50%, -50%) scale(0.8);
		filter: none;
	}
}

.note {
	position: absolute;
	width: 13px;
	height: 13px;
	border-radius: 50%;
	transform: translate(-50%, -50%);
	background: var(--accent-note);
	--note-glow: color-mix(in srgb, var(--accent-note) 80%, transparent);
	animation: note-wave 9s ease-in-out infinite;

	&.root {
		background: var(--accent-tonic);
		--note-glow: color-mix(in srgb, var(--accent-tonic) 80%, transparent);
	}
}

.fade-left,
.fade-right {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 14%;
	pointer-events: none;
	z-index: 2;
}

.fade-left  { left: 0;  background: linear-gradient(to right, var(--bg-base), transparent); }
.fade-right { right: 0; background: linear-gradient(to left,  var(--bg-base), transparent); }

.fade-top {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 55%;
	background: linear-gradient(to bottom, var(--bg-base), transparent);
	z-index: 2;
}

/* ── MARQUEE ───────────────────────────────────────────────── */
.marquee-strip {
	overflow: hidden;
	border-top: 1px solid rgba(255, 255, 255, 0.05);
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	padding: 14px 0;
	background: var(--bg-surface);
}

@keyframes marquee {
	from { transform: translateX(0); }
	to   { transform: translateX(-50%); }
}

.marquee-track {
	display: flex;
	align-items: center;
	gap: 40px;
	width: max-content;
	animation: marquee 28s linear infinite;
	white-space: nowrap;

	span {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.sep {
		color: var(--accent-note);
		opacity: 0.5;
		letter-spacing: 0;
	}
}

/* ── FEATURES ──────────────────────────────────────────────── */
.features {
	max-width: 1100px;
	margin: 0 auto;
	padding: 80px 32px 32px;

	@media (max-width: 768px) {
		padding: 48px 16px 16px;
	}
}

.feature-row {
	display: grid;
	grid-template-columns: 80px 1fr auto;
	align-items: center;
	gap: 40px;
	padding: 40px 0;

	@media (max-width: 768px) {
		grid-template-columns: 40px 1fr auto;
		gap: 16px;
		padding: 28px 0;
	}
	border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	text-decoration: none;
	color: inherit;
	position: relative;

	/* Scroll reveal */
	opacity: 0;
	transform: translateY(28px);
	transition: opacity 0.7s ease, transform 0.7s ease;

	&.visible {
		opacity: 1;
		transform: none;
	}

	/* Hover */
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--radius-md);
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
	}

	&.accent-cyan::after  { background: color-mix(in srgb, var(--accent-note) 3%, transparent); }
	&.accent-rose::after  { background: color-mix(in srgb, var(--accent-tonic) 3%, transparent); }
	&.accent-mixed::after { background: linear-gradient(135deg, color-mix(in srgb, var(--accent-note) 3%, transparent), color-mix(in srgb, var(--accent-tonic) 3%, transparent)); }

	&:hover {
		&::after { opacity: 1; }

		.feature-num  { opacity: 1; }
		.feature-name { color: var(--text-primary); }
		.feature-arrow svg { transform: translateX(4px); }

		&.accent-cyan  .feature-arrow { color: var(--accent-note); }
		&.accent-rose  .feature-arrow { color: var(--accent-tonic); }
		&.accent-mixed .feature-arrow { color: var(--accent-note); }

		&.accent-cyan  .feature-num { color: var(--accent-note); }
		&.accent-rose  .feature-num { color: var(--accent-tonic); }
		&.accent-mixed .feature-num { color: var(--accent-note); }
	}

	&:first-child {
		border-top: 1px solid rgba(255, 255, 255, 0.05);
	}
}

.feature-num {
	font-size: 13px;
	font-weight: 700;
	letter-spacing: 0.14em;
	color: var(--text-muted);
	opacity: 0.5;
	transition: color 0.25s ease, opacity 0.25s ease;
	line-height: 1;
	padding-left: 4px;
}

.feature-body {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.feature-name {
	font-size: 22px;
	font-weight: 700;
	letter-spacing: 0.02em;
	color: rgba(221, 228, 240, 0.85);
	margin: 0;
	transition: color 0.25s ease;

	@media (max-width: 768px) {
		font-size: 17px;
	}
}

.feature-desc {
	font-size: 13px;
	font-weight: 300;
	line-height: 1.7;
	color: var(--text-muted);
	margin: 0;
	max-width: 560px;
}

.feature-arrow {
	color: var(--text-muted);
	opacity: 0.5;
	flex-shrink: 0;
	transition: color 0.25s ease, opacity 0.25s ease;

	svg { transition: transform 0.25s ease; }
}

.feature-row:hover .feature-arrow { opacity: 1; }

/* ── BOTTOM CTA ────────────────────────────────────────────── */
.bottom-cta {
	max-width: 1100px;
	margin: 0 auto;
	padding: 64px 32px 96px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24px;

	@media (max-width: 768px) {
		flex-direction: column;
		align-items: flex-start;
		padding: 40px 16px 64px;
	}
}

.bottom-label {
	font-size: 13px;
	font-weight: 300;
	letter-spacing: 0.08em;
	color: var(--text-muted);
	margin: 0;
}

.bottom-link {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: var(--accent-note);
	text-decoration: none;
	border-bottom: 1px solid color-mix(in srgb, var(--accent-note) 30%, transparent);
	padding-bottom: 2px;
	transition: border-color 0.2s ease, gap 0.2s ease;

	svg { transition: transform 0.2s ease; }

	&:hover {
		border-color: var(--accent-note);
		svg { transform: translateX(3px); }
	}
}
</style>
