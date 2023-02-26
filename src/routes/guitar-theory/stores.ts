import { writable, type Writable } from 'svelte/store';
import type { MajorScales } from './helpers';

export const key: Writable<MajorScales> = writable("C major");