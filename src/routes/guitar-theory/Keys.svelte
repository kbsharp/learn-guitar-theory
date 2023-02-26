<script lang="ts">
	import { majorScales, type MajorScale } from './helpers';
	import { key } from './stores';

	let keyValue: string = String(key);

	function handleClick(scale: MajorScale) {
		key.set(scale);
	}
</script>

<div class="keys-container">
	{#each majorScales as scale}
		<button class="button ${keyValue === scale}" on:click={() => handleClick(scale)}>{scale}</button
		>
	{/each}
</div>

<style lang="scss">
	.keys-container {
		display: flex;
		justify-content: center;
		margin-top: 75px;

		button {
			background: none;
			color: inherit;
			border: none;
			padding: 0;
			font: inherit;
			cursor: pointer;
			outline: inherit;

			&.button {
				background-color: #4c7aaf;
				border: none;
				color: white;
				padding: 15px 32px;
				text-align: center;
				text-decoration: none;
				display: inline-block;
				font-size: 16px;
				margin: 4px 2px;
				cursor: pointer;
			}

			&.active {
				background-color: #4c7aaf;
			}
		}
	}
</style>
