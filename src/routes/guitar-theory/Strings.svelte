<script lang="ts">
	import { strings } from './strings';
	import {
		convertFlatToSharp,
		currentTonic,
		getClassName,
		type Quality,
		type Key
	} from './helpers';
	import { key, quality } from './stores';

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

				.hide-note {
					display: none;
				}

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

			&.string0::before {
				content: 'e';
				position: absolute;
				top: 8px;
				left: -36px;
			}

			&.string1::before {
				content: 'B';
				position: absolute;
				top: 50px;
				left: -36px;
			}
			&.string2::before {
				content: 'G';
				position: absolute;
				top: 90px;
				left: -36px;
			}
			&.string3::before {
				content: 'D';
				position: absolute;
				top: 130px;
				left: -36px;
			}
			&.string4::before {
				content: 'A';
				position: absolute;
				top: 170px;
				left: -36px;
			}
			&.string5::before {
				content: 'E';
				position: absolute;
				top: 210px;
				left: -36px;
			}

			&.string0,
			&.string1 {
				.string-graphic {
					height: 2px;
				}
			}

			&.string2,
			&.string3 {
				.string-graphic {
					height: 3px;
				}
			}

			&.string4,
			&.string5 {
				.string-graphic {
					height: 4px;
				}
			}
		}
	}
</style>
