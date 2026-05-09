<script lang="ts">
	import { modes, pentatonics, qualityLabels } from './helpers';
	import { quality } from '../../stores';
</script>

<div class="qualities-container">
	<div class="scale-group">
		{#each modes as qual}
			<button class:active={$quality === qual} onclick={() => quality.set(qual)}>
				{qualityLabels[qual]}
			</button>
		{/each}
	</div>

	<div class="scale-group">
		{#each pentatonics as qual}
			<button class:active={$quality === qual} onclick={() => quality.set(qual)}>
				{qualityLabels[qual]}
			</button>
		{/each}
	</div>
</div>

<style lang="scss">
	.qualities-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.scale-group {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}

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
			background: color-mix(in srgb, var(--accent-tonic) 10%, transparent);
		}

		&.active {
			background: var(--accent-tonic);
			color: var(--bg-base);
			box-shadow: 0 0 12px 2px color-mix(in srgb, var(--accent-tonic) 30%, transparent);
		}
	}
</style>
