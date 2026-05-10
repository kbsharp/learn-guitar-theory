# Guitar acoustic samples

Acoustic steel-string guitar samples used by `src/lib/audio.ts` for click-to-hear and "Play scale" playback.

## Source

Sourced from [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) (MIT licensed; samples in that project are derived from various free libraries including the VSCO 2 Community Edition, FluidR3_GM, and others — all royalty-free).

## Coverage

13 samples spanning the playable guitar range, roughly every minor third (3 semitones), with denser coverage at the top:

E2 · G2 · A#2 · C#3 · E3 · G3 · A#3 · C#4 · E4 · G4 · A#4 · C#5 · D5

`Tone.Sampler` interpolates between these to play any pitch — at most ~1-2 semitones of pitch shift in any direction, which is inaudible. Total size: ~2 MB MP3.

## Why these and not synthesis

Software synthesis of a believable acoustic guitar is essentially an unsolved problem at our scale. Every serious music app (Yousician, Fender Play, Soundslice) plays back real recordings. We do the same.
