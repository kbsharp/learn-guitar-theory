<script lang="ts">
	import { strings } from './strings';
	import { convertFlatToSharp, currentTonic, getClassName, type Key } from './helpers';
	import { key } from './stores';

	let keyValue: Key;

	key.subscribe((value) => {
		keyValue = value;
	});
</script>

<div class="string-container">
	{#each strings as string, i}
		<div class={`string string${i}`}>
			{#each string as note, j}
				<div class={`note note${j}`}>
					<p class={getClassName(note, keyValue, currentTonic(keyValue))}>
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
					background-color: hsl(220, 7%, 43%);
					z-index: 5;
				}

				> p {
					// color: var(--fret-boarder);
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

					// outline: solid 2px #1212129f;

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
		}
	}
</style>
