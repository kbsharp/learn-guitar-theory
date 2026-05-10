<script lang="ts">
	import { glossary, type GlossaryTerm } from '$lib/glossary';
	import { onMount } from 'svelte';

	let open = $state(false);
	let query = $state('');
	let dialog: HTMLDialogElement | undefined = $state();

	const categories: Record<GlossaryTerm['category'], string> = {
		concept: 'Concepts',
		chord: 'Chord types',
		scale: 'Scales & modes',
		interval: 'Intervals & notation'
	};

	let filtered = $derived(
		query.trim().length > 0
			? glossary.filter(
					(t) =>
						t.term.toLowerCase().includes(query.toLowerCase()) ||
						t.definition.toLowerCase().includes(query.toLowerCase())
				)
			: glossary
	);

	let grouped = $derived(
		query.trim().length > 0
			? null
			: (Object.keys(categories) as GlossaryTerm['category'][]).map((cat) => ({
					cat,
					label: categories[cat],
					terms: glossary.filter((t) => t.category === cat)
				}))
	);

	function openGlossary() {
		open = true;
	}

	function closeGlossary() {
		open = false;
		query = '';
	}

	function handleBackdrop(e: MouseEvent) {
		if (e.target === dialog) closeGlossary();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeGlossary();
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	});
</script>

<button class="glossary-trigger" type="button" onclick={openGlossary} aria-label="Open glossary">
	Glossary
</button>

{#if open}
	<dialog
		class="glossary-dialog"
		bind:this={dialog}
		onclick={handleBackdrop}
		aria-label="Music theory glossary"
	>
		<div class="dialog-inner">
			<div class="dialog-chrome">
				<div class="dialog-header">
					<span class="dialog-title">Glossary</span>
					<button
						class="close-btn"
						type="button"
						onclick={closeGlossary}
						aria-label="Close glossary">✕</button
					>
				</div>

				<input
					class="search"
					type="search"
					placeholder="Search terms..."
					bind:value={query}
					aria-label="Search glossary"
				/>
			</div>

			<div class="terms-list">
				{#if grouped}
					{#each grouped as group}
						{#if group.terms.length > 0}
							<p class="category-label">{group.label}</p>
							{#each group.terms as entry}
								<div class="term-entry">
									<strong class="term-name">{entry.term}</strong>
									<p class="term-def">{entry.definition}</p>
								</div>
							{/each}
						{/if}
					{/each}
				{:else if filtered.length > 0}
					{#each filtered as entry}
						<div class="term-entry">
							<strong class="term-name">{entry.term}</strong>
							<p class="term-def">{entry.definition}</p>
						</div>
					{/each}
				{:else}
					<p class="no-results">No terms match "{query}"</p>
				{/if}
			</div>
		</div>
	</dialog>
{/if}

<style lang="scss">
	.glossary-trigger {
		background: transparent;
		border: none;
		color: var(--text-muted);
		font-family: inherit;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		padding: 6px 14px;
		border-radius: var(--radius-sm);
		transition:
			color 0.2s ease,
			background 0.2s ease;

		&:hover {
			color: var(--text-primary);
			background: rgba(255, 255, 255, 0.04);
		}
	}

	.glossary-dialog {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		background: rgba(0, 0, 0, 0.6);
		border: none;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 500;

		&::backdrop {
			display: none;
		}
	}

	.dialog-inner {
		background: var(--bg-surface);
		border: 1px solid var(--color-fret);
		border-radius: var(--radius-md);
		width: 520px;
		max-width: calc(100vw - 32px);
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
	}

	/* Fixed chrome — never scrolls */
	.dialog-chrome {
		flex-shrink: 0;
		padding: 22px 24px 18px;
		border-bottom: 1px solid var(--color-fret);
		background: var(--bg-surface);
	}

	.dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.dialog-title {
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--text-primary);
	}

	.close-btn {
		background: transparent;
		border: none;
		color: var(--text-muted);
		font-size: 16px;
		cursor: pointer;
		padding: 4px 8px;
		margin-right: -8px;
		border-radius: var(--radius-sm);
		transition: color 0.15s ease;
		line-height: 1;

		&:hover {
			color: var(--text-primary);
		}
	}

	.search {
		width: 100%;
		box-sizing: border-box;
		background: var(--bg-base);
		border: 1px solid var(--color-fret);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-family: inherit;
		font-size: 13px;
		padding: 10px 14px;
		outline: none;
		transition: border-color 0.15s ease;

		&::placeholder {
			color: var(--text-muted);
			opacity: 0.5;
		}

		&:focus {
			border-color: var(--text-muted);
		}
	}

	/* Scrollable content area */
	.terms-list {
		overflow-y: auto;
		padding: 8px 12px 24px;
		display: flex;
		flex-direction: column;
	}

	.category-label {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent-note);
		opacity: 0.6;
		margin: 24px 12px 4px;

		&:first-child {
			margin-top: 12px;
		}
	}

	.term-entry {
		padding: 10px 12px;
		border-radius: var(--radius-sm);
		transition: background 0.15s ease;

		&:hover {
			background: rgba(255, 255, 255, 0.03);
		}
	}

	.term-name {
		display: block;
		font-size: 13px;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 5px;
		letter-spacing: 0.01em;
	}

	.term-def {
		margin: 0;
		font-size: 12px;
		line-height: 1.65;
		color: var(--text-muted);
	}

	.no-results {
		font-size: 12px;
		color: var(--text-muted);
		text-align: center;
		padding: 32px 0;
		margin: 0;
	}
</style>
