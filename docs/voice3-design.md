# Voice 3 — Clear ensemble (version 1.0.6)

Voice 3 combines the locally fine-tuned Matcha-TTS speech model from the Claude handover with the voice 4 word-alignment/PSOLA singing renderer. It uses run 2's step-500 checkpoint and the mean embedding of 124 male-labelled training profiles. It is a composite style of one model, not 124 human recordings combined into a song or a separately singing-trained network.

The underlying training set contains 247 LibriTTS-R profiles and about 35.92 hours of selected speech. This describes the dataset, not an assertion that the selected checkpoint processed every clip. No Common Voice synthesis training or paid services were used. Model weights, reader metadata and source corpus recordings remain outside GitHub. Sources and changes are attributed in `public/originals/genesis-1/voice3-credits.md`.

## Renderer change

Direct transfer of the original voice 4 renderer improved the old singing experiment, but the fine-tuned model generated source phrases too quickly for clear word stretching. Increasing the source duration scale from 0.92 to 1.3 produced a clearer diagnostic result. The published recipe uses 16 flow steps, temperature 0.5, the original basic pitch estimator and fixed consonant edges. It does not use held-vowel mapping or WORLD waveform resynthesis. Alternative pitch-tracking/consonant experiments are not the selected recipe.

The original accompaniment, classic/warm recordings and voice 4 were not changed. The new renderer is `scripts/render-trained-vocal.py`; its default duration scale is 1.3. The local immutable selected checkpoint is `voice-training/voice3/selected/voice3-step500.ckpt`, SHA256 `7eb0618b65c8e8111910e8ba05721bab42faa3d9385695c5c9cf2d1951d97c83`.

## Diagnostics and limits

A local Whisper small.en recognizer compared identical song intervals. The selection sample was Day one: ordered reference-word recall improved from 65.4% with the direct renderer transfer to 96.2% with slower source phrases. Voice 4 scored 84.6% on that interval. Other sections, checked after selection, scored 100% on the first refrain and 85.7% on Day six; voice 4 scored 100% on both. These scores are speech-recognizer diagnostics, not human listening ratings or evidence of natural singing. Word-error rate is recorded separately because ordered recall does not penalize inserted words.

The training watchdog and trainer were deliberately stopped after the last heartbeat at step 1139, with saved checkpoints retained. Later checkpoints had worse sung-word recognition in the matched direct-renderer test despite improving speech loss. No claim is made that more training can never help. Rendering quality and the user's listening judgment determine whether further work is useful.

The full recording lasts 230.571375 seconds; its preview lasts 32 seconds. Technical checks cover audio integrity, existing recording preservation, selector assets, playback, saved selection, credits and mobile layout. This release is an experimental vocal for Mike to review before voice 5 is developed. Voices 5–10 remain queued for separate releases and must be labelled as styles of a shared model whenever that is how they are made.
