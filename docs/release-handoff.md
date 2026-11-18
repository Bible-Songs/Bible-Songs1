# Bible Songs release handoff

Check GitHub main for the actual latest commit and version before acting.

| Item | Baseline |
| --- | --- |
| Release | 1.0.128 |
| Bible catalog | Genesis 1–15, Luke 1–24, Romans 1–16 |
| Listening Library | God’s Jewels, The Immutability of God, Compel Them to Come In, Payday Someday, Sinners in the Hands of an Angry God, The Excellency of Christ, Christ Crucified, Prayer, the Cure for Care |
| Latest change | Fix Pages dependency installation so the God’s Jewels animation reaches the live site |
| Previous archive | `GitHub History/2026-11-17_20-43-53-446284_SGT_fbc37ca9/files/` |

## 1.0.128 wheel caption hold (Codex)

- In God’s Jewels, keep “a wheel upon which to polish and perfect them.” visible through the next passage’s introductory narration. The next caption begins at 225.99 seconds, shortly before its words at 226.79, giving the completed wheel caption about seven seconds of reading time.

## 1.0.127 deployment repair (Codex)

- The 1.0.126 Pages build failed during `npm ci`: onnxruntime-node tried to download an unavailable optional Linux CUDA archive. The deployment workflow now sets `ONNXRUNTIME_NODE_INSTALL_CUDA=skip` for installation, the package’s supported flag. The static browser build needs no CUDA execution provider.

## 1.0.126 God’s Jewels animation (Codex)

- Added **Watch with animation** for the full *God’s Jewels* sermon. Its 73 scenes include the casket, mine, rotating lapidary wheel, prism, twelve-gem breastplate, counterfeit sapphire, and stones becoming gems. Existing artwork from the previous animations is reused where it matches the text.
- Captions are contiguous excerpts from the timed transcript, with a smooth left-to-right reveal and the current transcript passage following below. Local Whisper timings are checkpointed under `video-previews/jewels/`.
- Saved the reusable project skill at `.agents/skills/sermon-animation/SKILL.md` in the parent workspace. It covers scene planning, drawing reuse, verbatim captions, local Whisper timing, browser verification, publishing, and optional MP4 export.
- Local Whisper matched 72 of 73 caption onsets. The remaining onset and a few intermediate phrase starts were estimated from the transcript. Recheck the timing JSON if this recording is revised.
- Strict TypeScript, production build, skill validation, and focused Chrome checks passed for verbatim captions, partial reveal, backward seeking, 1.5× speed, transcript following, mobile layout, reduced motion, and opening Prayer. The standard regression suite hit the known Luke transition timeout. The same account/playback checks passed with the diagnostic test allowing twelve seconds before the natural chapter ending.

## 1.0.125 Excellency illustrations and Prayer download (Codex)

- *The Excellency of Christ* has 193 timed browser scenes using the existing recording. Codex replaced the artwork with scene-specific compositions and reused Claude’s content-led plan, Whisper timing shards, and shared caption player. Captions are exact excerpts from the timed transcript.
- *Prayer, the Cure for Care* adds a **Download MP4** link. The MP4 is hosted on `video-1.0.125` and contains the current `audio-1.0.124` recording, Canvas illustrations and timed captions. The original local MP4 retains the previous recording.
- Strict TypeScript and the production build passed. Chrome checked eight Excellency seek points, caption reveal, transcript following, 1.5× speed, mobile and reduced motion, and downloaded the Prayer MP4 at its advertised size. The MP4 audio hash matches the current recording. The verified video asset archive is `GitHub History/Release Assets/2026-11-18_video-1.0.125/`.

## 1.0.124 Excellency of Christ animation (Claude)

- **Watch with animation** now also appears on *The Excellency of Christ* (91 min, full sermon). Following Codex’s Prayer approach: the browser draws each scene on a Canvas from code (no image or video files), captions are exact excerpts of the words being spoken and wipe in left to right on the recording clock, the previous caption dims, and the transcript follows below.
- 198 scenes, 27 drawn scene types in `source/excellency-paint.ts` (sealed book, throne with the Lamb and elders’ crowns, lion, lamb, lion and lamb, heavens, scales, gate, meadow, hearth, path, Gethsemane, three crosses, stable and star, sun, storm stilled, Dagon’s temple, great white throne, lamps, feast, fountain, door, rose and lily, three lights, dawn). Scene plan: `source/excellency-scenes.json` (validated at load: every caption must occur in its cue). Phrase timings: `source/excellency-caption-timing.json` from Whisper small.en on short local clips (731 of 738 phrase onsets matched by Whisper; 7 estimated from text position).
- New reusable `source/SermonAnimation.tsx` (Codex’s caption/sync logic generalised; same CSS classes). `source/ListeningLibrary.tsx` now keeps a map of animated sermons, so adding another sermon is one entry. `PrayerAnimation.tsx` is unchanged; it could later move onto `SermonAnimation`.
- Local work: `video-previews/excellency-canvas/` (draft_plan.py, review.py with the hand corrections, timing.py, check-animation.mjs).
- Years in sermon headers were read as “one thousand eight hundred fifty-five”. `improved/plan.mjs` now speaks years as people say them (eighteen fifty-five, nineteen oh six); the header chunk of God’s Jewels, Immutability, Compel, Christ Crucified and Prayer was re-rendered (one chunk each) and their audio moved to release audio-1.0.124. Transcripts keep the numerals.
- Prayer’s recording is 1.684 s shorter after its header, so every Prayer caption timing for cue 2 onward was shifted by −1.684 s in `source/prayer-caption-timing.json` (Whisper re-check: “How often Luther…” and “Look, mamma…” keep the same small lead as before).
- `SermonAnimation` clamps the caption wipe to the end of the recording (the final Excellency caption ends 0.75 s before the audio does).
- Checks: strict check, build, `npm run test:browser` (first run after build timed out as before, rerun passed), `improved/check.mjs` (8 sermons, 32 downloads, release routing), `excellency/check.mjs`, `video-previews/excellency-canvas/check-animation.mjs` (198 verbatim captions, 8 seeks, mid-phrase wipe, 1.5× speed, hide, Prayer still opens, 390 px mobile with reduced motion).
- Superseded audio (audio-1.0.117 Prayer, audio-1.0.118 God’s Jewels, Immutability, Compel, Christ Crucified) is to be deleted after deploy per Mike’s standing instruction; local copies remain in `GitHub History/Release Assets/`.

## 1.0.123 verbatim captions (Codex)

- All 77 captions for *Prayer, the Cure for Care* are exact contiguous excerpts from their corresponding timed transcript cues. The smooth reveal, caption dimming, illustrations, and transcript following are preserved.
- For future animated sermons, write a timed scene plan for that sermon. Use only words spoken in the recording for its captions. Keep the animation optional and check its timing against recorded speech.
- Strict TypeScript, production build, the 77-caption transcript comparison, and focused Chrome playback, seeking, and mobile checks passed. The full browser suite passed on rerun after the known Luke chapter-transition timeout.

## 1.0.122 caption reveal (Codex)

- Caption text reveals continuously from left to right using the recording clock and existing phrase timings. Already revealed text remains visible, and the previous caption dims before the next one starts. With reduced motion enabled the wipe becomes a discrete reveal.

## 1.0.121 full sermon animation (Codex)

- Extended **Watch with animation** through the final amen of *Prayer, the Cure for Care* using the existing GitHub release audio and transcript cues.
- Redrew the stones with angular faces, irregular silhouettes, and texture. New scenes include the foggy crossroads, telescope, mountain tarn, and storm settling into calm.
- The transcript pane sits immediately below the illustration during animation, keeping the current cue at the top. Clicking a passage still seeks the recording and selects its accompanying scene.
- Captions reveal up to three words at a time. Local speech recognition matched 51 of the 53 quotation onsets. The remaining two onsets and the intermediate phrase timings were estimated from the transcript. The preceding caption dims before the new text appears. Recheck `source/prayer-caption-timing.json` if the recording changes.
- Strict TypeScript and production build passed. Focused Chrome checks passed for the Luther caption timing and dimming, seeking across the full sermon, transcript following, mobile layout, and the final amen. The browser regression suite passed on rerun after the known Luke chapter-transition timeout.

## 1.0.120 animation pilot (Codex)

- In the Listening Library, select **Watch with animation** on *Prayer, the Cure for Care*. The Canvas illustrations and captions follow the existing audio clock and transcript cues. At 5:00 the animation ends and sermon audio continues. The pilot respects reduced-motion preferences.
- The existing GitHub release audio is reused. The illustrations are drawn by the app from `source/PrayerAnimation.tsx`, with styles in `source/prayer-animation.css`.
- Strict TypeScript and production build passed. Local Chrome verified start, pause, transcript seeking, mobile layout, the 5:00 cutoff, replay and hiding the animation. The full browser suite passed on rerun after the existing Luke chapter-transition timeout.

## 1.0.119 history cleanup (Claude) — every other checkout must re-clone

- With Mike’s explicit approval, every commit was rewritten to drop `public/library/*.mp3`, `public/library/*.m4a`, `public/readings/luke-*/*.m4a` and `public/readings/romans-*/*.m4a`. Those files are no longer part of the site (served from GitHub Releases since 1.0.114). The current file tree of 1.0.118 was verified identical before and after; all 136 commits kept with new IDs; release tags audio-1.0.114/115/117/118 moved to the rewritten commits.
- Pushed with a force-push (one-time exception to the normal fast-forward rule) from a separate checkout; the dated source snapshot was made with `GitHub History/tools/snapshot.py`.
- **ChatGPT/Codex: do not pull into an old checkout.** Re-clone, or `git fetch origin && git reset --hard origin/main` on a clean main, and delete old local branches. Old commit IDs in earlier notes and archives refer to the pre-rewrite history.
- Full pre-rewrite backup: `GitHub History/Repository backups/2026-11-17_before-history-rewrite.git` (git mirror; can be pushed back if ever needed).

## 1.0.118 initials and audio cleanup (Claude)

- Mike found the pauses in “C. H. Spurgeon” too long. The header chunk of God’s Jewels, Immutability, Compel, Christ Crucified and Payday (“R. G. Lee”) re-rendered with the initials rule (one chunk each; cue timings rebuilt). Sinners and Excellency have no initials.
- Current audio: audio-1.0.118 (God’s Jewels, Immutability, Compel, Payday, Christ Crucified), audio-1.0.117 (Prayer, the Cure for Care), audio-1.0.115 (Sinners), audio-1.0.114 (Excellency, Luke, Romans).
- With Mike’s instruction (“no need to keep old copies”), superseded assets were deleted after the 1.0.118 deploy: the whole audio-1.0.116 release and Payday on audio-1.0.117. Local copies remain under `GitHub History/Release Assets/`.
- Checks: build, `improved/check.mjs` (8 sermons, 32 downloads, release routing, wording, seeking), `excellency/check.mjs`; `npm run test:browser` again timed out once on the first run right after a build and passed on the next runs — looks like a cold-start timing issue in the test, not an app fault.

## 1.0.117 Prayer, the Cure for Care (Claude)

- New sermon: Prayer, the Cure for Care (C. H. Spurgeon, No. 2351, delivered January 12, 1888; MTP vol. 40), 27.9 min, 137 transcript passages. Supplied text matched spurgeon.org; CCEL vol. 40 is a modernised edition, so only 4 corrections (stray quote before “whom the master”, stray full stop, run-together header, reference). Table: `improved/prayer-the-cure-for-care-spurgeon/corrections.md`.
- New audio-only rules in `improved/plan.mjs`: “Dr.” → “Doctor” (Kokoro paused after “Doctor.”), drachm → dram, two or more initials read without full stops (“C H Spurgeon”, “R G Lee”). Payday’s four “Dr. Lee” chunks re-rendered.
- Physical iPhone playback verified by Mike on 1.0.116.
- Checks: strict check, build, `improved/check.mjs` (8 sermons, 32 sized downloads, release routing, wording, seeking), `excellency/check.mjs`, `npm run test:browser` passed 4 of 5 runs (one TimeoutError, not reproduced in 4 reruns — known flaky).
- Claude now has a project skill `/new-sermon` (`.claude/skills/new-sermon/SKILL.md` in Mike’s workspace) mirroring the checklist in `docs/shared-project-workflow.md`.

## 1.0.116 Christ Crucified (Claude)

- New sermon: Christ Crucified (C. H. Spurgeon, Nos. 7–8), 46.3 min, 220 transcript passages. Supplied text matched spurgeon.org; 26 corrections from a comparison with CCEL vol. 1, including a dropped line (“everything might be a god, but not forsooth the God of heaven; vice might be…”), “hut”→“but” ×3, “ire same”→“are some”, “balls”→“halls”, “snail”→“shall”. Table: `improved/christ-crucified-spurgeon/corrections.md`.
- Payday Someday: “as long as our mother lives” now short i (Codex’s open correction). Root cause: the noun-lookbehind matched “mot*her* lives”; fixed with word boundaries and every live/lives/liveth occurrence reviewed by eye.
- Section numbers I./II./III. were read “Roman two/three”; now “One/Two/Three” (Christ Crucified, God’s Jewels, Immutability, Compel).
- “ · Drama” removed from sermon cards and the library player (Mike: all sermons use the same style). The Bible reader’s Drama option is unchanged.
- Audio routing: `source/mediaUrl.ts` maps each sermon to its current release — audio-1.0.116 (God’s Jewels, Immutability, Compel, Payday, Christ Crucified), audio-1.0.115 (Sinners), audio-1.0.114 (Excellency, Luke, Romans). The superseded 1.0.115 files for God’s Jewels, Immutability, Compel and Payday remain for review.
- New-sermon checklist added to `docs/shared-project-workflow.md`.
- Checks: strict check, build, `npm run test:browser` (failed once without a captured message, then passed twice in a row — watch for flakiness), `improved/check.mjs` (7 sermons, 28 sized downloads, release routing, corrected wording, seeking, no Drama label), `excellency/check.mjs`.

## 1.0.115 library improvements (Claude)

- Texts checked against CCEL (Spurgeon vols. 1, 5, 52; Edwards) and spurgeon.org. Immutability: restored three dropped passages (“secondly, the persons…”, “he has promised… He varies not in the goodness”, “Jacob have I loved…”), fixed “sons of Jacob”, quotes. God’s Jewels: 13 scanning errors (crown, Kidderminster, living soul, great ocean, sits, ones, were, jeweller…). Compel: opening quotes. Sinners: 18 Roman-numeral references to modern form, Isaiah 33:12-14, Meshach, etc. Payday: removed a third-person summary that was not part of the sermon, rebuilt 542 PDF-wrapped lines into 129 paragraphs, one run-on fixed.
- Audio: verb live/lives/liveth spoken with short i (all 44 occurrences in six sermons verified with the Kokoro phonemizer); Isaiah’s words in Immutability now a male voice (was female); headers read with pauses and “Number”, “Reverend”; list numbers start their own sentence; long sentences split at clause punctuation; chunks no longer cross paragraphs.
- Word/PDF: sermon details in the heading area instead of repeated under Chapter 1 (all six sermons, Excellency included); hymn line breaks kept.
- Revised MP3/M4A are on [audio-1.0.115](https://github.com/Bible-Songs/Bible-Songs1/releases/tag/audio-1.0.115) via `source/mediaUrl.ts`. The superseded 1.0.114 files for these five remain (left for ChatGPT/Mike to review and decide); Excellency audio stays on audio-1.0.114 and is still in use.
- Local work: `voice-training/listening/published-library/improved/` (prepare.py, plan.mjs, finish.sh, check.mjs, upload-release.py) and `render-improved.py` (reuses identical chunks). Archive of release audio: `GitHub History/Release Assets/2026-11-16_audio-1.0.115/`.
- Checks: strict check, build, `npm run test:browser`, improved/check.mjs (5 sermons: release audio, corrected wording, seeking; 24 sized downloads), excellency/check.mjs.

## 1.0.114 audio migration

- [Hosted audio](https://github.com/Bible-Songs/Bible-Songs1/releases/tag/audio-1.0.114) contains 412 assets. The exact audio, download URLs, byte counts and GitHub-verified SHA-256 checksums are in `GitHub History/Release Assets/2026-11-16_audio-1.0.114/` on Mike’s Mac.
- The clean production build is 508,178,006 bytes. Checks covered strict TypeScript, the production build, every migrated asset name, and the size labels for all 24 sermon downloads. Chrome and WebKit with iPhone emulation verified release asset seeking and playback speed on M4A and an MP3 download. A physical iPhone was unavailable.
- The local Chrome app suite passed account and recovery flows, seeking and download for The Excellency of Christ, Luke and Romans sentence seeking, and continuous playback from Luke 1 to Luke 2.

## 1.0.113 notes (Claude)

- Source: Mike’s `06 The Excellency of Christ - Jonathan Edwards.docx`, identical to the CCEL online text. Checked against *Works of President Edwards*, Worcester ed. reprint, vol. 4 (1852; confirmed in 1855 reprint) on archive.org. 19 corrections applied (e.g. “divine dignity”, Psalm 65:7, Psalm 89:8–9, Matthew 11:28–30, “he embraced them”, “committed himself to God”); the modern editor’s bracketed summaries in Parts Two and Three were removed. Editorial headings (Introduction, Part One–Three, A–E) kept as chapter markers. Book abbreviations spelled out.
- Drama: narrator `warm` throughout; Christ’s quoted words `classic` (24 passages); crowd/enemies `voice3` (2). Audio-only spoken forms: verse ranges read “to”, section letters “A.”, Sion read Zion. Transcript keeps written text.
- Local render folder: `voice-training/listening/published-library/excellency/` (supplied.docx/txt, corrections.md, prepare.py, plan.mjs, plan.json, 466 PCM chunks, render.log, final.wav, finish.sh, check.mjs). Renderer `render-excellency.py`; transcripts via `transcripts.py excellency-of-christ-edwards` then LibreOffice PDF export. To correct a passage, edit text.txt, rerun plan.mjs, delete only affected chunk files, rerun the renderer and finish.sh.

For the next release, update this note with version, changed titles and files, checks run, and any follow-up. Report the final commit and confirmed archive path in the release reply.
