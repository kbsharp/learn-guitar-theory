<script lang="ts">
	import { convertFlatToSharp, majorScales } from './helpers';
	import { key } from '../../stores';
</script>

<div class="keys-container">
	{#each majorScales as scale}
		<button
			class={`button ${$key === scale ? 'active' : ''}`}
			name={scale}
			onclick={() => key.set(scale)}
		>
			{convertFlatToSharp(scale)}
		</button>
	{/each}
</div>

<style lang="scss">
	.keys-container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 6px;

		button {
			background: transparent;
			border: 1px solid var(--accent-note);
			color: var(--accent-note);
			border-radius: var(--radius-sm);
			padding: 8px 18px;
			font-family: inherit;
			font-size: 13px;
			font-weight: 600;
			letter-spacing: 0.05em;
			cursor: pointer;
			transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

			&:hover:not(.active) {
				background: rgba(12, 207, 223, 0.1);
			}

			&.active {
				background: var(--accent-note);
				color: var(--bg-base);
				box-shadow: 0 0 12px 2px rgba(12, 207, 223, 0.3);
			}
		}
	}
</style>
