<script lang="ts">
	import Frets from './Frets.svelte';
	import Strings from './Strings.svelte';
</script>

<div class="fretboard-container">
	<div class="fretboard">
		<Frets />

		<div class="string-container">
			<Strings />
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
			background-color: var(--fretboard-bg);
			width: 1150px;
			height: 100%;

			.string-container {
				position: absolute;
				top: 0;
				left: -50px;
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
