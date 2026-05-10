<script lang="ts">
	import { strings, stringPitches } from '$lib/strings';
	import { playNote } from '$lib/audio';

	interface Props {
		getNoteClass?: (note: string) => string;
		getNoteLabel?: (note: string) => string;
		positionRange?: { start: number; end: number } | null;
	}

	let {
		getNoteClass = () => 'hide-note',
		getNoteLabel = (note: string) => note,
		positionRange = null
	}: Props = $props();

	function displayClass(noteClass: string, fretIndex: number): string {
		if (!positionRange || noteClass === 'hide-note') return noteClass;
		if (fretIndex >= positionRange.start && fretIndex <= positionRange.end) return noteClass;
		return noteClass + ' dim-note';
	}

	function handleNoteClick(stringIdx: number, fretIdx: number, noteClass: string) {
		// Hidden notes shouldn't fire audio — they're not visible to the user.
		if (noteClass === 'hide-note') return;
		const pitch = stringPitches[stringIdx][fretIdx];
		if (pitch) void playNote(pitch);
	}
</script>

<div class="string-container">
	{#each strings as string, i}
		<div class={`string string${i}`}>
			{#each string as note, j}
				{@const noteClass = getNoteClass(note)}
				{@const finalClass = displayClass(noteClass, j)}
				<div class="note note{j}">
					{#if noteClass === 'hide-note'}
						<p class={finalClass}>{getNoteLabel(note)}</p>
					{:else}
						<button
							type="button"
							class={`note-btn ${finalClass}`}
							onclick={() => handleNoteClick(i, j, noteClass)}
							aria-label={`Play ${note}`}
						>
							{getNoteLabel(note)}
						</button>
					{/if}
					<div class="string-graphic"></div>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	@use 'sass:list';

	.string-container {
		display: flex;
		flex-direction: column;
		height: 100%;

		.string {
			display: flex;
			width: 1200px;
			height: 42px;

			.note {
				position: relative;
				width: 100%;
				height: 100%;

				.string-graphic {
					position: absolute;
					width: 106%;
					height: 4px;
					top: 18px;
					left: 0;
					background-color: var(--color-string);
					z-index: 5;
				}

				/* Shared base styles for both the hidden <p> and the clickable <button>. */
				> p,
				> .note-btn {
					font-size: 13px;
					font-weight: 600;
					font-family: inherit;
					margin: 0;
					padding: 0;
					position: absolute;
					width: 20px;
					height: 20px;
					top: 6px;
					left: 10px;
					border-radius: 50%;

					display: flex;
					justify-content: center;
					align-items: center;
					padding: 4px;

					z-index: 10;

					opacity: 1;
					visibility: visible;
					transition:
						opacity 0.5s,
						visibility 0.5s,
						background-color 0.5s,
						box-shadow 0.5s,
						transform 0.12s ease;

					&.hide-note {
						opacity: 0;
						visibility: hidden;
					}

					&.dim-note {
						opacity: 0.15;
						box-shadow: none !important;
					}

					&.in-scale {
						background-color: var(--accent-note);
						color: var(--bg-base);
						box-shadow: 0 0 10px 2px
							color-mix(in srgb, var(--accent-note) 40%, transparent);
					}

					&.tonic {
						background-color: var(--accent-tonic);
						color: var(--white);
						box-shadow: 0 0 12px 3px
							color-mix(in srgb, var(--accent-tonic) 50%, transparent);
					}
				}

				/* Interactive button-specific overrides */
				> .note-btn {
					border: none;
					cursor: pointer;
					-webkit-tap-highlight-color: transparent;

					&:hover {
						transform: scale(1.18);
					}

					&:active {
						transform: scale(0.94);
					}

					&:focus-visible {
						outline: 2px solid var(--text-primary);
						outline-offset: 2px;
					}

					&.dim-note:hover {
						transform: scale(1.05);
						opacity: 0.4;
					}
				}
			}

			.note24 {
				.string-graphic {
					width: 100%;
				}
			}

			// String names

			$strings: ('e', 'B', 'G', 'D', 'A', 'E');
			$top-spacing: 40px;
			$left-spacing: -36px;

			@for $i from 0 through list.length($strings) - 1 {
				$content: list.nth($strings, $i + 1);
				&.string#{$i}::before {
					content: $content;
					position: absolute;
					top: $i * $top-spacing + 8px;
					left: $left-spacing;
					color: var(--text-muted);
					font-size: 12px;
				}
			}

			// String heights

			$string-heights: (2, 2, 3, 3, 4, 4);

			@for $i from 0 through list.length($string-heights) - 1 {
				$height: list.nth($string-heights, $i + 1);
				&.string#{$i} {
					.string-graphic {
						height: #{$height}px;
					}
				}
			}
		}
	}
</style>
