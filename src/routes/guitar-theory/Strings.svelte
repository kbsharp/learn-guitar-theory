<script lang="ts">
	import { strings } from './strings';
	import { convertFlatToSharp, currentTonic, getClassName, type Key } from './helpers';
	import { key } from './stores';

	let keyValue: Key;

	key.subscribe((value) => {
		keyValue = value;
	});
</script>

<div class="strings">
	{#each strings as string}
		<div class="string">
			{#each string as note}
				<div class="note">
					<p class={getClassName(note, keyValue, currentTonic(keyValue))}>
						{convertFlatToSharp(note)}
					</p>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style lang="scss">
	.strings {
		display: flex;
		flex-direction: column;
		height: 50px;

		.string {
			display: flex;
			width: 1200px;
			height: 42px;

			.note {
				width: 50px;
				height: 50px;
				display: flex;
				justify-content: center;
				align-items: center;

				.hide-note {
					display: none;
				}

				> p {
					width: 50%;
					height: 50%;
					border-radius: 50%;

					display: flex;
					justify-content: center;
					align-items: center;
					padding: 4px;

					&.in-scale {
						background-color: var(--note);
						color: black;
					}

					&.tonic {
						background-color: var(--tonic);
						color: black;
					}
				}

				&:first-child {
					color: black;
				}
			}
		}
	}
</style>
