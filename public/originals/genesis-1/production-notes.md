# Let There Be Light — production draft

An original song adaptation inspired by Genesis 1. The lyrics summarize the six days of creation; they are not a verbatim chapter, nor a replacement for Scripture.

- Key: C major; tempo: 84 BPM; meter: 4/4.
- Form: 4-bar intro; day 1; day 2; refrain; day 3; day 4; refrain; day 5; day 6; refrain; 4-bar outro. Each lyric section is 8 bars.
- The WAV is an instrumental composition demo with synthesized lead, arpeggio and bass. It has no vocals, samples, third-party recordings or external service calls.
- The MIDI contains the editable original melody, accompaniment, bass and tempo. It is the source for a future recording, not a commercial recording of a singer.
- Suggested vocal: warm, clear, unhurried; prioritize intelligible words. Use the supplied melody rather than copying any artist or existing recording. Adjust syllable placement musically where needed.
- Future recording: keep a written agreement with the vocalist/producer permitting web playback and distribution. For a generation service, record the exact model, applicable licence/terms, generation date, plan and receipt before publishing. Do not infer rights from a free trial or a credit line.
- Scripture reference: Genesis 1, Berean Standard Bible (BSB), https://ebible.org/engbsb/GEN01.htm (public domain; licence: https://berean.bible/terms.htm). The separate scripture.json contains the unmodified chapter text, excluding verse-number markup and footnotes.
- Musical material was newly composed for this project; no similarity clearance search has been performed. No third-party copyrighted song or artist imitation was requested.

To regenerate the instrumental demo and MIDI, run `python3 scripts/compose-genesis.py`.

## Free synthetic vocal draft

The vocal version uses the free, open-source eSpeak formant synthesizer (`en-us+f3`) with local pitch and timing processing written in `scripts/render-vocals.py`, using NumPy. It is an intentionally robotic synthetic singing draft, not a human performer, a voice clone or a natural-sounding AI singer. Whole words are sustained to the original score; some multisyllable words hold one pitch across their duration. No paid tool or external generation API is used.

The program is installed locally; no eSpeak executable, voicebank or software source is distributed as part of the web app. The app distributes rendered original audio, original lyrics and original code. eSpeak software is GPLv3; program output is covered only when its contents constitute a covered work (GPLv3 section 2): https://www.gnu.org/licenses/gpl-3.0.html. The eCantorix project describes the same general speech-to-singing technique and states that its author believes output may be used for any purpose: https://github.com/divVerent/ecantorix. Its code/examples were not incorporated in this project.

Rebuild the instrumental and metadata with `python3 scripts/compose-genesis.py`, then run `python3 scripts/render-vocals.py` in a Python environment with NumPy installed. Install free eSpeak/eSpeak NG through your package manager. Full vocal mix: `let-there-be-light-synthetic-vocal.wav`; 32-second preview: `vocal-preview.wav`.
