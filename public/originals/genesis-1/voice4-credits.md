# Voice 4 — Resonant composite: creation and attribution

This recording is machine-generated. It is an experimental synthetic singing draft, not a human performance.

The free Matcha-TTS/VCTK pretrained speech model supplied the acoustic network. Eight speaker embeddings were adapted locally on a small selected LibriTTS-R speech subset and then averaged to create a composite timbre. The acoustic network was frozen during this adaptation. This is not an independently trained singing model and was not trained on 1,000 speakers locally. No Common Voice recordings were used. No named singer was imitated and no artist endorsement is implied.

The model generated the original lyric phrases; original pitch-synchronous processing fitted the words to Bible Songs' melody and timing. HiFi-GAN generated the speech waveform. The vocal was mixed with Bible Songs' existing original instrumental. No source corpus recordings or models are distributed through the app, and no paid generation service was used.

## Sources

- **LibriTTS-R** — Yuma Koizumi, Heiga Zen, Shigeki Karita, Yifan Ding, Kohei Yatabe, Nobuyuki Morioka, Michiel Bacchiani, Yu Zhang, Wei Han and Ankur Bapna (2023), *LibriTTS-R: A Restored Multi-Speaker Text-to-Speech Corpus*. [Dataset](https://www.openslr.org/141/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changes: resampling, duration/quality selection, selection of a small subset of eight anonymous speaker profiles, and speaker-embedding adaptation. Text-held-out validation was retained.
- **CSTR VCTK 0.92** — Junichi Yamagishi, Christophe Veaux and Kirsten MacDonald (2019), University of Edinburgh, Centre for Speech Technology Research. [Dataset](https://doi.org/10.7488/ds/2645), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Used through the authors' pretrained Matcha-TTS checkpoint; speaker conditioning was changed locally. No original reader audio is included here.
- **Matcha-TTS** — Shivam Mehta, Ruibo Tu, Jonas Beskow, Éva Székely and Gustav Eje Henter (ICASSP 2024). [Official repository and MIT license](https://github.com/shivammehta25/Matcha-TTS). The pretrained VCTK checkpoint and original training are distinct from our small local adaptation.
- **HiFi-GAN** — Jungil Kong, Jaehyeon Kim and Jaekyoung Bae (2020). [Official repository and MIT license](https://github.com/jik876/hifi-gan). Universal V1 vocoder checkpoint supplied by the Matcha-TTS authors.

Original adapted lyrics, melody, arrangement and singing processing were prepared for Bible Songs. Scripture reference: [Berean Standard Bible](https://berean.bible/terms.htm), public domain. Lyrics are an original adaptation of Genesis 1, not a verbatim translation.

These credits describe the sources and changes; their creators do not endorse this app or this recording.
