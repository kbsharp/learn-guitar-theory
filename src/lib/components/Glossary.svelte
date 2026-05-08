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
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
	<dialog
		class="glossary-dialog"
		bind:this={dialog}
		onclick={handleBackdrop}
		aria-label="Music theory glossary"
	>
		<div class="dialog-inner">
			<div class="dialog-header">
				<span class="dialog-title">Glossary</span>
				<button class="close-btn" type="button" onclick={closeGlossary} aria-label="Close glossary"
					>✕</button
				>
			</div>

			<input
				class="search"
				type="search"
				placeholder="Search terms..."
				bind:value={query}
				aria-label="Search glossary"
			/>

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
		transition: color 0.2s ease, background 0.2s ease;

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
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
	}

	.dialog-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 24px 0;
		flex-shrink: 0;
	}

	.dialog-title {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--accent-note);
	}

	.close-btn {
		background: transparent;
		border: none;
		color: var(--text-muted);
		font-size: 14px;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: var(--radius-sm);
		transition: color 0.15s ease;
		line-height: 1;

		&:hover {
			color: var(--text-primary);
		}
	}

	.search {
		margin: 16px 24px 0;
		background: var(--bg-base);
		border: 1px solid var(--color-fret);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-family: inherit;
		font-size: 13px;
		padding: 10px 14px;
		outline: none;
		transition: border-color 0.15s ease;
		flex-shrink: 0;

		&::placeholder {
			color: var(--text-muted);
			opacity: 0.6;
		}

		&:focus {
			border-color: var(--text-muted);
		}
	}

	.terms-list {
		overflow-y: auto;
		padding: 16px 24px 24px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.category-label {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin: 18px 0 8px;

		&:first-child {
			margin-top: 0;
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
		font-size: 12px;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 4px;
		letter-spacing: 0.02em;
	}

	.term-def {
		margin: 0;
		font-size: 12px;
		line-height: 1.6;
		color: var(--text-muted);
	}

	.no-results {
		font-size: 12px;
		color: var(--text-muted);
		text-align: center;
		padding: 24px 0;
		margin: 0;
	}
</style>
