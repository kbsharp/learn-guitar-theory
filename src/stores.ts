import { writable, type Writable } from 'svelte/store';
import type { Key } from './routes/guitar-theory/helpers';
import { Key as Keys, Quality } from './routes/guitar-theory/helpers';

export const key: Writable<Key> = writable(Keys.C);
export const quality: Writable<Quality> = writable(Quality.Major);