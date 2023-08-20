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
		width: 100%;
		height: 240px;

		.fretboard {
			margin-left: 50px;
			position: relative;
			height: 100%;

			.string-container {
				position: absolute;
				left: -50px;
				height: 100%;
			}
		}
	}
</style>
