<script lang="ts">
	let frets = new Array(22).fill(null);
</script>

<div class="fretboard">
	{#each frets as fret}
		<div class="fret">#</div>
	{/each}
</div>

<style lang="scss">
	.fretboard {
		display: flex;
		background-color: rgba(0, 0, 0, 0.137);
		width: 100%;
		height: 100%;

		.fret {
			height: 200px;
			width: 120px;
			color: white;
		}
	}
</style>
