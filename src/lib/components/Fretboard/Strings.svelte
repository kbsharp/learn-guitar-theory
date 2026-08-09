<script lang="ts">
	import { strings, stringPitches } from '$lib/strings';
	import { playNote } from '$lib/audio';

	interface Props {
		getNoteClass?: (note: string) => string;
		getNoteLabel?: (note: string) => string;
		positionRange?: { start: number; end: number } | null;
		playingNotes?: { string: number; fret: number }[];
	}

	let {
		getNoteClass = () => 'hide-note',
		getNoteLabel = (note: string) => note,
		positionRange = null,
		playingNotes = []
	}: Props = $props();

	// Keyed by string+fret, never by note name — the same note name appears all
	// over the neck and only one of them is the one sounding.
	let playingKeys = $derived(new Set(playingNotes.map((n) => `${n.string}:${n.fret}`)));

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
							class:is-playing={playingKeys.has(`${i}:${j}`)}
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

				/*
				 * Shared base styles for the hidden <p> (when class is hide-note)
				 * and the clickable <button> (when visible). Buttons get user-agent
				 * styling by default (background, border, padding, line-height,
				 * appearance) — every one of those is explicitly reset here so the
				 * button renders pixel-identically to the original <p>.
				 */
				> p,
				> .note-btn {
					font: inherit;
					font-size: 13px;
					font-weight: 600;
					line-height: 1;
					letter-spacing: 0;
					text-align: center;
					color: inherit;

					margin: 0;
					padding: 4px;
					box-sizing: content-box;

					position: absolute;
					width: 20px;
					height: 20px;
					top: 6px;
					left: 10px;

					border: 0;
					border-radius: 50%;
					background-color: transparent;
					appearance: none;
					-webkit-appearance: none;

					display: flex;
					justify-content: center;
					align-items: center;

					z-index: 10;

					opacity: 1;
					visibility: visible;
					transition:
						opacity 0.5s,
						visibility 0.5s,
						background-color 0.5s,
						box-shadow 0.25s ease,
						transform 0.15s ease;

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

					/*
					 * The one note that gives the current scale its colour —
					 * Dorian's ♮6, Lydian's ♯4. Ringed rather than refilled so
					 * the note keeps saying whether it's a scale tone or the
					 * root; the ring is the third piece of information, not a
					 * replacement for the first two. Amber borrows the inlay
					 * colour, which no note fill uses.
					 */
					&.characteristic {
						box-shadow:
							0 0 0 2px var(--accent-characteristic),
							0 0 14px 3px
								color-mix(in srgb, var(--accent-characteristic) 35%, transparent);
					}

					/*
					 * The note sounding right now during a scale run. Keeps the
					 * note's own colour (so root vs scale tone stays readable)
					 * and adds a bright ring — the eye needs "this one, now",
					 * not a different hue. Forced past .dim-note so a run is
					 * never invisible if it strays outside the position window.
					 */
					&.is-playing {
						opacity: 1;
						transform: scale(1.35);
						box-shadow:
							0 0 0 2px var(--text-primary),
							0 0 18px 6px color-mix(in srgb, var(--text-primary) 45%, transparent) !important;
						transition:
							box-shadow 0.06s ease,
							transform 0.06s ease;
					}
				}

				/*
				 * Interactive overrides: only add interaction hints, never change
				 * the rendered size or position. Hover and active feel like the
				 * note's glow is "lighting up" rather than the layout shifting.
				 */
				> .note-btn {
					cursor: pointer;
					outline: 0;
					-webkit-tap-highlight-color: transparent;

					&.in-scale:hover {
						box-shadow: 0 0 14px 3px
							color-mix(in srgb, var(--accent-note) 70%, transparent);
					}

					&.tonic:hover {
						box-shadow: 0 0 16px 4px
							color-mix(in srgb, var(--accent-tonic) 75%, transparent);
					}

					// The hover glows above out-specify .characteristic, so the
					// ring has to be restated or it vanishes under the cursor.
					&.characteristic:hover {
						box-shadow:
							0 0 0 2px var(--accent-characteristic),
							0 0 18px 5px
								color-mix(in srgb, var(--accent-characteristic) 55%, transparent);
					}

					&:active {
						filter: brightness(1.15);
					}

					&:focus-visible {
						outline: 2px solid var(--text-primary);
						outline-offset: 2px;
					}

					&.dim-note:hover {
						opacity: 0.35;
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
