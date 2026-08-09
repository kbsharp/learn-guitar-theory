<script lang="ts">
	/**
	 * The one Play/Stop control used by every audio feature. Same shape, same
	 * position in the page header on every tool, so the "make it make sound"
	 * affordance is always in the same place.
	 */
	interface Props {
		/** What it says when idle, e.g. "Play chord". */
		label: string;
		playing?: boolean;
		/** Samples still downloading — the button says so rather than failing silently. */
		loading?: boolean;
		/** Nothing to play yet, e.g. no chord selected. `hint` says why. */
		disabled?: boolean;
		/** Replaces the label while disabled — tell the user what to do first. */
		hint?: string;
		onclick: () => void;
	}

	let {
		label,
		playing = false,
		loading = false,
		disabled = false,
		hint,
		onclick
	}: Props = $props();

	let text = $derived(
		loading ? 'Loading audio…' : disabled && hint ? hint : playing ? 'Stop' : label
	);
</script>

<button
	class="play-btn"
	class:playing
	class:loading
	disabled={loading || disabled}
	{onclick}
	aria-label={playing ? `Stop ${label.toLowerCase()}` : label}
>
	<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
		{#if playing}
			<rect x="2" y="2" width="6" height="6" />
		{:else}
			<path d="M2 1.5v7l6-3.5z" />
		{/if}
	</svg>
	<span>{text}</span>
</button>

<style lang="scss">
	.play-btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-family: inherit;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		background: var(--accent-tonic);
		border: 1px solid var(--accent-tonic);
		color: var(--bg-base);
		border-radius: var(--radius-sm);
		padding: 6px 14px;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease,
			opacity 0.2s ease;

		svg {
			flex-shrink: 0;
		}

		&:hover:not(:disabled) {
			box-shadow: 0 0 12px color-mix(in srgb, var(--accent-tonic) 50%, transparent);
		}

		&:disabled,
		&.playing {
			cursor: default;
			opacity: 0.75;
		}
	}
</style>
