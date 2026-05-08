<script lang="ts">
	import { onMount } from 'svelte';

	let { term, definition }: { term: string; definition: string } = $props();

	let open = $state(false);
	let el: HTMLSpanElement;

	function handleDocClick(e: MouseEvent) {
		if (open && el && !el.contains(e.target as Node)) open = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}

	onMount(() => {
		document.addEventListener('click', handleDocClick);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('click', handleDocClick);
			document.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<span class="help-tip" bind:this={el}>
	<button
		class="help-btn"
		type="button"
		onclick={(e) => {
			e.stopPropagation();
			open = !open;
		}}
		aria-label="Help: {term}"
		aria-expanded={open}
	>?</button>

	{#if open}
		<div class="popover" role="tooltip">
			<strong class="popover-term">{term}</strong>
			<p class="popover-def">{definition}</p>
		</div>
	{/if}
</span>

<style lang="scss">
	.help-tip {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	.help-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1px solid var(--color-fret);
		background: transparent;
		color: var(--text-muted);
		font-size: 8px;
		font-weight: 700;
		font-family: inherit;
		letter-spacing: 0;
		cursor: pointer;
		margin-left: 5px;
		opacity: 0.6;
		transition: opacity 0.15s ease, border-color 0.15s ease;
		flex-shrink: 0;

		&:hover,
		&[aria-expanded='true'] {
			opacity: 1;
			border-color: var(--text-muted);
		}
	}

	.popover {
		position: absolute;
		bottom: calc(100% + 10px);
		left: 50%;
		transform: translateX(-50%);
		width: 240px;
		background: var(--bg-surface);
		border: 1px solid var(--color-fret);
		border-radius: var(--radius-sm);
		padding: 12px 14px;
		z-index: 200;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
	}

	.popover-term {
		display: block;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent-note);
		margin-bottom: 6px;
	}

	.popover-def {
		margin: 0;
		font-size: 12px;
		line-height: 1.65;
		color: var(--text-primary);
		opacity: 0.85;
	}
</style>
