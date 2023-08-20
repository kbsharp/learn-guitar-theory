<script lang="ts">
	import { type Quality as QualityType, Quality, qualities } from './helpers';
	import { quality } from '../../stores';

	let qualityValue: QualityType = Quality.Major;

	quality.subscribe((value) => {
		qualityValue = value;
	});

	function handleClick(value: Quality) {
		quality.set(value);
	}
</script>

<div class="qualities-container">
	{#each qualities as qual}
		<button
			class={`button ${qualityValue === qual ? 'active' : ''}`}
			name={qual}
			on:click={() => handleClick(qual)}
		>
			{qual}
		</button>
	{/each}
</div>

<style lang="scss">
	.qualities-container {
		display: flex;
		justify-content: center;
		margin-top: 12px;

		button {
			background: none;
			color: inherit;
			border: none;
			padding: 0;
			font: inherit;
			cursor: pointer;

			&.button {
				background-color: var(--note);
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
				background-color: var(--tonic);
			}
		}
	}
</style>
