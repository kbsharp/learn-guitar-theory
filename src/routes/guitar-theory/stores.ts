import { writable, type Writable } from 'svelte/store';
import type { MajorScale } from './helpers';
import { MajorScale as Scale } from './helpers';

export const key: Writable<MajorScale> = writable(Scale.C);