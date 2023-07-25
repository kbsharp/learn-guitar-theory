<script lang="ts">
	import { convertFlatToSharp, majorScales, type Key } from './helpers';
	import { key } from './stores';

	let keyValue: string = String(key);

	key.subscribe((value) => {
		keyValue = value;
	});

	function handleClick(scale: Key) {
		key.set(scale);
	}
</script>

<div class="keys-container">
	{#each majorScales as scale}
		<button
			class={`button ${keyValue === scale ? 'active' : ''}`}
			name={scale}
			on:click={() => handleClick(scale)}
		>
			{convertFlatToSharp(scale)}
		</button>
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
				background-color: #863d82;
			}
		}
	}
</style>
