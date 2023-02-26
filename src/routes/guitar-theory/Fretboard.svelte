<script lang="ts">
	import { currentTonic, frets, getClassName, type MajorScale } from './helpers';
	import { key } from './stores';
	import { strings } from './strings';

	let keyValue: MajorScale;

	key.subscribe((value) => {
		keyValue = value;
	});
</script>

<div class="fretboard-container">
	<div class="fretboard">
		<div class="fret-container">
			<div class="frets">
				{#each frets as _}
					<div class="fret" />
				{/each}
			</div>
		</div>

		<div class="string-container">
			<div class="strings">
				{#each strings as string}
					<div class="string">
						{#each string as note}
							<div class="note">
								<p class={getClassName(note, keyValue, currentTonic(keyValue))}>{note}</p>
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.fretboard-container {
		margin: auto;
		width: 1250px;
		height: 260px;

		.fretboard {
			margin-left: 50px;
			position: relative;
			background-color: black;
			width: 1150px;
			height: 100%;

			.fret-container {
				position: absolute;
				top: 0;
				left: -50px;
				right: -50px;
				width: 1200px;

				.frets {
					display: flex;

					.fret {
						height: 260px;
						width: 50px;
						color: white;
					}
				}
			}

			.string-container {
				position: absolute;
				top: 0;
				left: -50px;
				width: 100%;
				height: 100%;

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
							color: white;
							display: flex;
							justify-content: center;
							align-items: center;

							> p {
								width: 50%;
								height: 50%;
								border-radius: 50%;

								display: flex;
								justify-content: center;
								align-items: center;
								padding: 4px;

								&.in-scale {
									background-color: yellow;
									color: black;
								}

								&.tonic {
									background-color: orange;
									color: black;
								}
							}

							&:first-child {
								color: black;
							}
						}
					}
				}
			}
		}
	}
</style>
