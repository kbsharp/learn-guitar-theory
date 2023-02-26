<script lang="ts">
	import { majorScales, type MajorScales } from './helpers';
	import { key } from './stores';

	function handleClick(scale: MajorScales) {
		key.set(scale);
	}
</script>

<div>
	{#each majorScales as scale}
		<button on:click={() => handleClick(scale)}>{scale}</button>
	{/each}
</div>
