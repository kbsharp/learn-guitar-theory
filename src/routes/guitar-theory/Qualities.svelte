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
		flex-wrap: wrap;
		gap: 6px;

		button {
			background: transparent;
			border: 1px solid var(--accent-tonic);
			color: var(--accent-tonic);
			border-radius: var(--radius-sm);
			padding: 8px 18px;
			font-family: inherit;
			font-size: 13px;
			font-weight: 600;
			letter-spacing: 0.05em;
			cursor: pointer;
			transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

			&:hover:not(.active) {
				background: rgba(240, 56, 96, 0.1);
			}

			&.active {
				background: var(--accent-tonic);
				color: var(--bg-base);
				box-shadow: 0 0 12px 2px rgba(240, 56, 96, 0.3);
			}
		}
	}
</style>
