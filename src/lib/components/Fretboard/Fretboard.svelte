<script lang="ts">
	import Frets from './Frets.svelte';
	import Strings from './Strings.svelte';

	interface Props {
		getNoteClass?: (note: string) => string;
		getNoteLabel?: (note: string) => string;
		positionRange?: { start: number; end: number } | null;
		/**
		 * The string/fret positions sounding right now, lit up on the board.
		 * One entry for a scale run; the whole voicing for a strummed chord.
		 */
		playingNotes?: { string: number; fret: number }[];
	}

	let {
		getNoteClass = () => 'hide-note',
		getNoteLabel = (note: string) => note,
		positionRange = null,
		playingNotes = []
	}: Props = $props();
</script>

<div class="fretboard-card">
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div class="fretboard-scroll" tabindex="0" role="region" aria-label="Fretboard">
		<div class="fretboard">
			<Frets {positionRange} />

			<div class="string-container">
				<Strings {getNoteClass} {getNoteLabel} {positionRange} {playingNotes} />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.fretboard-card {
		background: var(--bg-surface);
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.05);
		box-shadow: 0 4px 32px rgba(0, 0, 0, 0.5);
		overflow: hidden;
	}

	.fretboard-scroll {
		overflow-x: auto;
		padding: 32px 24px;
		-webkit-overflow-scrolling: touch;

		// Scroll shadow: visible only when content overflows (local = scrolls with content)
		background:
			linear-gradient(to right, var(--bg-surface) 8px, transparent) left no-repeat local,
			linear-gradient(to left, var(--bg-surface) 8px, transparent) right no-repeat local,
			linear-gradient(to right, rgba(0, 0, 0, 0.35), transparent) left no-repeat scroll,
			linear-gradient(to left, rgba(0, 0, 0, 0.35), transparent) right no-repeat scroll;
		background-size:
			48px 100%,
			48px 100%,
			96px 100%,
			96px 100%;
	}

	.fretboard {
		min-width: 1150px;
		margin-left: 50px;
		position: relative;
		height: 240px;
		background: var(--bg-fretboard);
		border-radius: var(--radius-sm);

		.string-container {
			position: absolute;
			left: -50px;
			height: 100%;
		}
	}
</style>
