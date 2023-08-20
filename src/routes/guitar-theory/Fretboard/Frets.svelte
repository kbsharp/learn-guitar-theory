<script lang="ts">
	import { frets } from '../helpers';

	const hasDot = (fret: number): boolean => {
		const fretsWithDots = [3, 5, 7, 9, 15, 17, 19, 21];
		return fretsWithDots.includes(fret);
	};

	const hasDots = (fret: number) => {
		if (fret === 12) {
			return true;
		}
	};
</script>

<div class="fret-container">
	<div class="frets">
		{#each frets as _, i}
			<div class="fret">
				{#if hasDot(i)}
					<div class={`dot ${i}`} />
				{/if}
				{#if hasDots(i)}
					<div class={`dot ${i}`} />
					<div class={`dot ${i}`} />
				{/if}
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	.fret-container {
		position: absolute;
		top: 0;
		left: -50px;
		right: -50px;
		width: 100%;

		.frets {
			display: flex;
			height: 240px;

			.fret {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-right: 1px solid var(--fret-border);

				.dot {
					margin: 26px 0;
					background-color: var(--white);
					height: 25px;
					width: 25px;
					border-radius: 50%;
				}
			}

			.fret:not(:first-child) {
				border-top: 1px solid var(--fret-border);
				border-bottom: 1px solid var(--fret-border);
			}
		}
	}
</style>
