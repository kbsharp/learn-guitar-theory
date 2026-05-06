<script lang="ts">
	import { strings } from '$lib/strings';

	interface Props {
		getNoteClass?: (note: string) => string;
		getNoteLabel?: (note: string) => string;
		positionRange?: { start: number; end: number } | null;
	}

	let { getNoteClass = () => 'hide-note', getNoteLabel = (note: string) => note, positionRange = null }: Props =
		$props();

	function displayClass(noteClass: string, fretIndex: number): string {
		if (!positionRange || noteClass === 'hide-note') return noteClass;
		if (fretIndex >= positionRange.start && fretIndex <= positionRange.end) return noteClass;
		return noteClass + ' dim-note';
	}
</script>

<div class="string-container">
	{#each strings as string, i}
		<div class={`string string${i}`}>
			{#each string as note, j}
				<div class={`note note${j}`}>
					<p class={displayClass(getNoteClass(note), j)}>
						{getNoteLabel(note)}
					</p>
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

				> p {
					font-size: 13px;
					font-weight: 600;
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
					transition: opacity 0.5s, visibility 0.5s, background-color 0.5s, box-shadow 0.5s;

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
						box-shadow: 0 0 10px 2px rgba(12, 207, 223, 0.4);
					}

					&.tonic {
						background-color: var(--accent-tonic);
						color: var(--white);
						box-shadow: 0 0 12px 3px rgba(240, 56, 96, 0.5);
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
