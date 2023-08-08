<script lang="ts">
	import { frets } from './helpers';

	const hasDot = (fret: number) => {
		if (
			fret === 3 ||
			fret === 5 ||
			fret === 7 ||
			fret === 9 ||
			fret === 15 ||
			fret === 17 ||
			fret === 19 ||
			fret === 21
		) {
			return true;
		}
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
		width: 1200px;

		.frets {
			display: flex;
			height: 260px;

			.fret {
				width: 50px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.dot {
					margin: 16px 0;
					background-color: hsl(0, 0%, 100%);
					height: 25px;
					width: 25px;
					border-radius: 50%;
				}
			}

			.fret:not(:first-child) {
				border-right: 1px solid var(--fret-border);
			}
		}
	}
</style>
