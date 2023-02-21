<script lang="ts">
	import { Scale } from 'tonal';
	import { EString, AString, DString, GString, BString, eString } from './strings';

	const majorScales = [
		'A major',
		'B major',
		'C major',
		'D major',
		'E major',
		'F major',
		'G major'
	] as const;
	type MajorScales = (typeof majorScales)[number];

	let currentScale: MajorScales = 'E major';

	let AScale = Scale.get('A major');
	let BScale = Scale.get('B major');
	let CScale = Scale.get('C major');
	let DScale = Scale.get('D major');
	let EScale = Scale.get('E major');
	let FScale = Scale.get('F major');
	let GScale = Scale.get('G major');

	let frets = new Array(25).fill(null);

	function currentTonic(): string {
		switch (currentScale) {
			case 'A major':
				return AScale.tonic ?? '';
			case 'B major':
				return BScale.tonic ?? '';
			case 'C major':
				return CScale.tonic ?? '';
			case 'D major':
				return DScale.tonic ?? '';
			case 'E major':
				return EScale.tonic ?? '';
			case 'F major':
				return FScale.tonic ?? '';
			case 'G major':
				return GScale.tonic ?? '';
		}
	}

	function getClassName(note: string, currentScale: string, tonic: string) {
		let inScale = false;

		const isTonic = tonic === note;

		switch (currentScale) {
			case 'A major':
				inScale = AScale.notes.includes(note);
				break;
			case 'B major':
				inScale = BScale.notes.includes(note);
				break;
			case 'C major':
				inScale = CScale.notes.includes(note);
				break;
			case 'D major':
				inScale = DScale.notes.includes(note);
				break;
			case 'E major':
				inScale = EScale.notes.includes(note);
				break;
			case 'F major':
				inScale = FScale.notes.includes(note);
				break;
			case 'G major':
				inScale = GScale.notes.includes(note);
				break;
		}

		if (inScale && isTonic) return 'in-scale tonic';
		if (inScale) return 'in-scale';

		return '';
	}

	function handleClick(scale: MajorScales) {
		currentScale = scale;
	}
</script>

<div class="wrap">
	<div class="fretboard">
		<div class="fret-container">
			<div class="frets">
				{#each frets as fret}
					<div class="fret" />
				{/each}
			</div>
		</div>

		<div class="string-container">
			<div class="strings">
				<div class="string">
					{#each eString as eNote}
						<div class="note">
							<p class={getClassName(eNote, currentScale, currentTonic())}>{eNote}</p>
						</div>
					{/each}
				</div>

				<div class="string">
					{#each BString as BNote}
						<div class="note">
							<p class={getClassName(BNote, currentScale, currentTonic())}>{BNote}</p>
						</div>
					{/each}
				</div>

				<div class="string">
					{#each GString as GNote}
						<div class="note">
							<p class={getClassName(GNote, currentScale, currentTonic())}>{GNote}</p>
						</div>
					{/each}
				</div>

				<div class="string">
					{#each DString as DNote}
						<div class="note">
							<p class={getClassName(DNote, currentScale, currentTonic())}>{DNote}</p>
						</div>
					{/each}
				</div>

				<div class="string">
					{#each AString as ANote}
						<div class="note">
							<p class={getClassName(ANote, currentScale, currentTonic())}>{ANote}</p>
						</div>
					{/each}
				</div>

				<div class="string">
					{#each EString as ENote}
						<div class="note">
							<p class={getClassName(ENote, currentScale, currentTonic())}>{ENote}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	{#each majorScales as scale}
		<button on:click={() => handleClick(scale)}>{scale}</button>
	{/each}
</div>

<style lang="scss">
	.wrap {
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
