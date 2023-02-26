import { writable, type Writable } from 'svelte/store';
import type { Keys } from './helpers';
import { Keys as Key } from './helpers';

export const key: Writable<Keys> = writable(Key.C);