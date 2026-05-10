<script lang="ts">
	import {
		FIFTHS_KEYS,
		FIFTHS_DISPLAY,
		RELATIVE_MINOR_KEYS,
		RELATIVE_MINOR_DISPLAY
	} from './helpers';

	interface Props {
		selectedKey: string;
		mode: 'major' | 'minor';
		onSelectMajor: (key: string) => void;
		onSelectMinor: (key: string) => void;
	}
	let { selectedKey, mode, onSelectMajor, onSelectMinor }: Props = $props();

	const CX = 130;
	const CY = 130;
	const OUTER_R2 = 118;
	const OUTER_R1 = 76;
	const INNER_R2 = 72;
	const INNER_R1 = 42;
	const GAP = 0.04; // radians gap between segments

	function wedgePath(i: number, r1: number, r2: number): string {
		const step = (2 * Math.PI) / 12;
		const center = (i / 12) * 2 * Math.PI - Math.PI / 2;
		const sa = center - step / 2 + GAP;
		const ea = center + step / 2 - GAP;

		const x1 = CX + r2 * Math.cos(sa);
		const y1 = CY + r2 * Math.sin(sa);
		const x2 = CX + r2 * Math.cos(ea);
		const y2 = CY + r2 * Math.sin(ea);
		const x3 = CX + r1 * Math.cos(ea);
		const y3 = CY + r1 * Math.sin(ea);
		const x4 = CX + r1 * Math.cos(sa);
		const y4 = CY + r1 * Math.sin(sa);

		return `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
	}

	function labelPos(i: number, r: number): { x: number; y: number } {
		const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
		return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
	}

	function isMajorActive(i: number): boolean {
		return mode === 'major' && FIFTHS_KEYS[i] === selectedKey;
	}

	function isMinorActive(i: number): boolean {
		return mode === 'minor' && RELATIVE_MINOR_KEYS[i] === selectedKey;
	}
</script>

<svg viewBox="0 0 260 260" class="circle" aria-label="Circle of fifths key selector">
	<!-- Outer ring: major keys -->
	{#each FIFTHS_KEYS as key, i}
		{@const pos = labelPos(i, 97)}
		{@const active = isMajorActive(i)}
		<path
			d={wedgePath(i, OUTER_R1, OUTER_R2)}
			class="segment major"
			class:active
			role="button"
			tabindex="0"
			aria-label="{key} major"
			aria-pressed={active}
			onclick={() => onSelectMajor(FIFTHS_KEYS[i])}
			onkeydown={(e) => e.key === 'Enter' && onSelectMajor(FIFTHS_KEYS[i])}
		/>
		<text
			x={pos.x}
			y={pos.y}
			class="label major-label"
			class:active
			text-anchor="middle"
			dominant-baseline="middle"
			style="pointer-events: none"
		>
			{FIFTHS_DISPLAY[i]}
		</text>
	{/each}

	<!-- Inner ring: relative minor keys -->
	{#each RELATIVE_MINOR_KEYS as _mkey, i}
		{@const pos = labelPos(i, 57)}
		{@const active = isMinorActive(i)}
		<path
			d={wedgePath(i, INNER_R1, INNER_R2)}
			class="segment minor"
			class:active
			role="button"
			tabindex="0"
			aria-label={RELATIVE_MINOR_DISPLAY[i]}
			aria-pressed={active}
			onclick={() => onSelectMinor(RELATIVE_MINOR_KEYS[i])}
			onkeydown={(e) => e.key === 'Enter' && onSelectMinor(RELATIVE_MINOR_KEYS[i])}
		/>
		<text
			x={pos.x}
			y={pos.y}
			class="label minor-label"
			class:active
			text-anchor="middle"
			dominant-baseline="middle"
			style="pointer-events: none"
		>
			{RELATIVE_MINOR_DISPLAY[i]}
		</text>
	{/each}

	<!-- Centre -->
	<circle cx={CX} cy={CY} r="38" class="centre-circle" />
	<text x={CX} y={CY - 7} class="centre-label" text-anchor="middle" dominant-baseline="middle">
		{selectedKey}{mode === 'minor' ? 'm' : ''}
	</text>
	<text x={CX} y={CY + 10} class="centre-mode" text-anchor="middle" dominant-baseline="middle">
		{mode}
	</text>
</svg>

<style lang="scss">
	.circle {
		width: 260px;
		height: 260px;
		flex-shrink: 0;
	}

	.segment {
		cursor: pointer;
		transition:
			fill 0.15s ease,
			filter 0.15s ease;

		&.major {
			fill: rgba(255, 255, 255, 0.04);
			stroke: rgba(255, 255, 255, 0.08);
			stroke-width: 0.5;

			&:hover:not(.active) {
				fill: rgba(12, 207, 223, 0.08);
			}

			&.active {
				fill: rgba(12, 207, 223, 0.2);
				stroke: rgba(12, 207, 223, 0.6);
				stroke-width: 1;
				filter: drop-shadow(0 0 4px rgba(12, 207, 223, 0.4));
			}
		}

		&.minor {
			fill: rgba(255, 255, 255, 0.03);
			stroke: rgba(255, 255, 255, 0.06);
			stroke-width: 0.5;

			&:hover:not(.active) {
				fill: rgba(240, 56, 96, 0.08);
			}

			&.active {
				fill: rgba(240, 56, 96, 0.2);
				stroke: rgba(240, 56, 96, 0.6);
				stroke-width: 1;
				filter: drop-shadow(0 0 4px rgba(240, 56, 96, 0.35));
			}
		}
	}

	.label {
		font-family: inherit;
		fill: var(--text-muted);
		transition: fill 0.15s ease;

		&.major-label {
			font-size: 10px;
			font-weight: 600;
			letter-spacing: 0.03em;

			&.active {
				fill: var(--accent-note);
			}
		}

		&.minor-label {
			font-size: 7.5px;
			font-weight: 500;

			&.active {
				fill: var(--accent-tonic);
			}
		}
	}

	.centre-circle {
		fill: rgba(255, 255, 255, 0.03);
		stroke: rgba(255, 255, 255, 0.08);
		stroke-width: 0.5;
	}

	.centre-label {
		font-family: inherit;
		font-size: 14px;
		font-weight: 700;
		fill: var(--text-primary);
		letter-spacing: 0.02em;
	}

	.centre-mode {
		font-family: inherit;
		font-size: 7px;
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		fill: var(--text-muted);
	}
</style>
