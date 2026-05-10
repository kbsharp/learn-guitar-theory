<script lang="ts">
	interface NextLink {
		href: string;
		label: string;
	}

	let {
		context,
		body,
		next,
		practice
	}: { context: string; body: string; next?: NextLink; practice?: string } = $props();
</script>

<div class="explanation-panel">
	<span class="context">{context}</span>
	<p class="body">{body}</p>
	{#if next}
		<a class="next-link" href={next.href}>
			{next.label}
			<svg
				width="12"
				height="12"
				viewBox="0 0 16 16"
				fill="none"
				aria-hidden="true"
			>
				<path
					d="M3 8h10M9 4l4 4-4 4"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
	{/if}
</div>

{#if practice}
	<div class="practice-tip">
		<span class="practice-label">Try this now</span>
		<p class="practice-body">{practice}</p>
	</div>
{/if}

<style lang="scss">
	.explanation-panel {
		max-width: 640px;
		margin: 36px auto 0;
		padding-left: 16px;
		border-left: 2px solid var(--color-fret);
	}

	.context {
		display: block;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--accent-tonic);
		margin-bottom: 10px;
	}

	.body {
		margin: 0;
		font-size: 13px;
		line-height: 1.75;
		color: var(--text-primary);
		opacity: 0.8;
	}

	.next-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 14px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--accent-note);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--accent-note) 30%, transparent);
		padding-bottom: 2px;
		transition:
			border-color 0.15s ease,
			gap 0.15s ease;

		svg {
			transition: transform 0.15s ease;
		}

		&:hover {
			border-bottom-color: var(--accent-note);

			svg {
				transform: translateX(2px);
			}
		}
	}

	/* ── Practice tip — concrete physical instruction below the explanation ── */
	.practice-tip {
		max-width: 640px;
		margin: 16px auto 0;
		padding: 14px 18px;
		background: color-mix(in srgb, var(--accent-tonic) 4%, transparent);
		border: 1px solid color-mix(in srgb, var(--accent-tonic) 12%, transparent);
		border-radius: var(--radius-sm);
	}

	.practice-label {
		display: block;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--accent-tonic);
		margin-bottom: 8px;
	}

	.practice-body {
		margin: 0;
		font-size: 12px;
		line-height: 1.7;
		color: var(--text-primary);
		opacity: 0.85;
	}
</style>
