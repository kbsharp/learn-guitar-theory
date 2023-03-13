import { writable, type Writable } from 'svelte/store';
import type { Key } from './helpers';
import { Key as Keys } from './helpers';

export const key: Writable<Key> = writable(Keys.C);