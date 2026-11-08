# Voice 3 — Clear ensemble: creation and attribution

This recording is machine-generated, experimental synthetic singing, not a human performance.

A Matcha-TTS acoustic speech model was fine-tuned locally from the authors' VCTK checkpoint using a LibriTTS-R training set containing 247 speaker profiles. The selected checkpoint is step 500 of the second training run. The vocal style averages the embeddings of 124 male-labelled training profiles; no named reader or artist was targeted. This is a composite style of one speech model, not a separately trained singer, a Common Voice-trained model, or a local model trained on 1,000 speakers.

For this recording, lyric phrases are synthesized more slowly than the initial experiment. The model's word alignment and Bible Songs' pitch-synchronous processing fit the generated words to the original melody and timing. This preserves short consonant edges while sustaining the word body. It does not use the unsuccessful held-vowel mapping experiment. HiFi-GAN generates the speech waveform, and the result is mixed with the unchanged original instrumental. No paid service is used, and no source corpus recordings or model weights are distributed in the app.

## Sources and changes

- **LibriTTS-R** — Yuma Koizumi, Heiga Zen, Shigeki Karita, Yifan Ding, Kohei Yatabe, Nobuyuki Morioka, Michiel Bacchiani, Yu Zhang, Wei Han and Ankur Bapna (2023), *LibriTTS-R: A Restored Multi-Speaker Text-to-Speech Corpus*. [Dataset](https://www.openslr.org/141/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changes: resampling to 22.05 kHz, quality/duration filtering, training/validation selection and local speech-model fine-tuning; synthetic audio subsequently fitted to music.
- **CSTR VCTK 0.92** — Junichi Yamagishi, Christophe Veaux and Kirsten MacDonald (2019), University of Edinburgh/CSTR. [Dataset](https://doi.org/10.7488/ds/2645), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Used through the authors' pretrained acoustic model, which was fine-tuned locally; original speaker conditioning was replaced and then averaged for this vocal.
- **Matcha-TTS** — Shivam Mehta, Ruibo Tu, Jonas Beskow, Éva Székely and Gustav Eje Henter (ICASSP 2024). [Official repository and MIT license](https://github.com/shivammehta25/Matcha-TTS). Model setup, data preparation and speech fine-tuning were performed locally during the earlier Claude-assisted work; the final singing renderer, parameter selection and app integration were completed during the ChatGPT-assisted handover.
- **HiFi-GAN** — Jungil Kong, Jaehyeon Kim and Jaekyoung Bae (2020). [Official repository and MIT license](https://github.com/jik876/hifi-gan). Universal V1 checkpoint supplied through the Matcha-TTS releases. The upstream checkpoint does not specify its complete training-data provenance; it is not claimed to have been trained locally.

Original adapted lyrics, melody, arrangement and singing processing were prepared for Bible Songs. Scripture reference: [Berean Standard Bible](https://berean.bible/terms.htm), public domain. The lyrics adapt Genesis 1; they are not the chapter sung verbatim. Source creators do not endorse this app or recording.
