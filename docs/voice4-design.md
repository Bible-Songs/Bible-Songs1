# Voice 4 — Resonant composite

Voice 4 is an experimental synthetic singing option. It uses the existing Matcha-TTS/VCTK pretrained acoustic model and HiFi-GAN waveform generator. Local training adapts only eight small speaker-embedding vectors using a selected LibriTTS-R speech subset; encoder, duration predictor and flow decoder weights remain frozen. Averaging the adapted vectors produces the composite profile.

This is genuine speaker-profile adaptation, rather than a second full acoustic-model training run. It is not a singing-trained model, a model trained locally on 1,000 speakers, or a Common Voice-based voice. No named artist was used as a target. The eight anonymous training profiles were selected by approximate lower-register speaking pitch, not by identifying people or inferring gender.

The local pilot dataset has 258 training clips and 13 text-held-out validation clips from eight profiles. Validation loss is only a technical diagnostic; it does not establish natural singing, perceptual voice distinctness or performance on unseen speakers. Local training records, checkpoints and source corpora are kept outside the GitHub checkout under `voice-training/voice4/`.

The renderer, `scripts/render-composite-vocal.py`, generates lyric phrases, uses the model's alignment for word boundaries, and applies the project's original PSOLA pitch and duration processing to match the original melody. The final mix uses the unchanged instrumental. It is generated entirely on the local CPU with free tools; voice 3's separate GPU training is not modified.

Source attribution, links, licenses and changes are recorded in `public/originals/genesis-1/voice4-credits.md` and linked from the app. Raw reader recordings, pretrained models and private API credentials are not uploaded.

## Future voice 3 integration

Voice 4 uses recording ID `composite`, full recording `let-there-be-light-composite-vocal.wav` and preview `composite-vocal-preview.wav` in `public/originals/genesis-1/`. Keep those entries when adding voice 3. Add voice 3 as a separate recording with its own creation note and sources; do not replace voice 4 or the classic/warm tracks. This app merges generated recordings, not model weights. Voice 4 embeddings should not be assumed interchangeable with voice 3's fine-tuned acoustic model.

Version 1.0.5 introduces voice 4. Increment the version for a subsequent release, keep both home/sign-in version displays, run the build/playback checks and retain the required dated GitHub snapshot.

## Local adaptation result

The selected dataset contains about 17.88 minutes of training speech and 52.4 seconds of validation speech. A file/text-overlap check found no shared audio paths or exact normalized transcript strings across these two subsets. Validation uses the same eight profiles with held-out utterances; this is not an unseen-speaker test.

A 20-step pilot was followed by a longer continuation. The run was deliberately stopped after the last reported step 820 because later validation checks did not improve on step 300. Step 300 was selected for rendering. Initial pilot speech-validation loss was 2.20138; the selected checkpoint measured 2.05661. These figures do not measure musical quality. Only speaker embeddings were adapted, and the rest of the model remained frozen.

The final mono 16 kHz recording lasts 230.571375 seconds and the preview lasts 32 seconds. Audio checks verify finite samples, no digital clipping, every selector asset, all 28 unique synthesized lyric phrases and preservation of the existing five audio files. The full recording remains an experimental draft for listener review.
