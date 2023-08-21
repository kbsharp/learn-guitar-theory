<script lang="ts">
	import { strings } from '../strings';
	import {
		convertFlatToSharp,
		currentTonic,
		getClassName,
		type Quality,
		type Key
	} from '../helpers';
	import { key, quality } from '../../../stores';

	let keyValue: Key;
	let qualityValue: Quality;

	key.subscribe((value) => {
		keyValue = value;
	});

	quality.subscribe((value) => {
		qualityValue = value;
	});
</script>

<div class="string-container">
	{#each strings as string, i}
		<div class={`string string${i}`}>
			{#each string as note, j}
				<div class={`note note${j}`}>
					<p class={getClassName(note, keyValue, currentTonic(keyValue), qualityValue)}>
						{convertFlatToSharp(note)}
					</p>
					<div class="string-graphic" />
				</div>
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
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
					background-color: var(--string-color);
					z-index: 5;
				}

				> p {
					font-size: 14px;
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
					transition: opacity 0.5s, visibility 0.5s, background-color 0.5s;

					&.hide-note {
						opacity: 0;
						visibility: hidden;
					}

					&.in-scale {
						background-color: var(--note);
					}

					&.tonic {
						outline: solid 1px var(--fret-boarder);
						background-color: var(--tonic);
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

			@for $i from 0 through length($strings) - 1 {
				$content: nth($strings, $i + 1);
				&.string#{$i}::before {
					content: $content;
					position: absolute;
					top: $i * $top-spacing + 8px;
					left: $left-spacing;
				}
			}

			// String heights

			$string-heights: (2, 2, 3, 3, 4, 4);

			@for $i from 0 through length($string-heights) - 1 {
				$height: nth($string-heights, $i + 1);
				&.string#{$i} {
					.string-graphic {
						height: #{$height}px;
					}
				}
			}
		}
	}
</style>
