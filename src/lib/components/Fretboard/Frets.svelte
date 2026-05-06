<script lang="ts">
	const frets = new Array(25).fill(null);

	const fretsWithDot = [3, 5, 7, 9, 15, 17, 19, 21];

	const hasDot = (fret: number): boolean => fretsWithDot.includes(fret);
	const hasDoubleDot = (fret: number): boolean => fret === 12;
</script>

<div class="fret-container">
	<div class="frets">
		{#each frets as _, i}
			<div class="fret">
				{#if hasDot(i)}
					<div class="dot" />
				{/if}
				{#if hasDoubleDot(i)}
					<div class="dot" />
					<div class="dot" />
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
				border-right: 1px solid var(--color-fret);

				.dot {
					margin: 20px 0;
					background-color: var(--color-dot);
					height: 18px;
					width: 18px;
					border-radius: 50%;
					box-shadow: 0 0 8px 2px rgba(196, 185, 138, 0.25);
				}
			}

			.fret:not(:first-child) {
				border-top: 1px solid var(--color-fret);
				border-bottom: 1px solid var(--color-fret);
			}
		}
	}
</style>
