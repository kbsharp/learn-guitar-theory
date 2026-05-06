<script lang="ts">
	import Frets from './Frets.svelte';
	import Strings from './Strings.svelte';

	interface Props {
		getNoteClass?: (note: string) => string;
		getNoteLabel?: (note: string) => string;
		positionRange?: { start: number; end: number } | null;
	}

	let { getNoteClass = () => 'hide-note', getNoteLabel = (note: string) => note, positionRange = null }: Props =
		$props();
</script>

<div class="fretboard-container">
	<div class="fretboard">
		<Frets {positionRange} />

		<div class="string-container">
			<Strings {getNoteClass} {getNoteLabel} {positionRange} />
		</div>
	</div>
</div>

<style lang="scss">
	.fretboard-container {
		width: 100%;
		background: var(--bg-surface);
		border-radius: var(--radius-md);
		border: 1px solid rgba(255, 255, 255, 0.05);
		box-shadow: 0 4px 32px rgba(0, 0, 0, 0.5);
		padding: 32px 24px;
		box-sizing: border-box;

		.fretboard {
			margin-left: 50px;
			position: relative;
			height: 240px;
			background: var(--bg-fretboard);
			border-radius: var(--radius-sm);

			.string-container {
				position: absolute;
				left: -50px;
				height: 100%;
			}
		}
	}
</style>
