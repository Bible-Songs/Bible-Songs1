# Bible Songs release handoff

Check GitHub main for the actual latest commit and version before acting.

| Item | Baseline |
| --- | --- |
| Release | 1.0.144 |
| Bible catalog | Genesis 1–15, Luke 1–24, Romans 1–16 |
| Listening Library | God’s Jewels, The Immutability of God, Compel Them to Come In, Payday Someday, Sinners in the Hands of an Angry God, The Excellency of Christ, Christ Crucified, Prayer, the Cure for Care, Free Grace, The Way of Salvation, The Bruised Reed, The Nature of True Virtue, The Work of the Holy Spirit |
| Latest change | Replaced The Work of the Holy Spirit MP4 with the revised visuals |
| Previous archive | `GitHub History/2026-11-27_19-51-07-839662_SGT_093afe5a` (1.0.143) |

## 1.0.144 The Work of the Holy Spirit revised MP4 (Codex, 27 November)

- Replaced the Listening Library MP4 download with the verified 176,722,323-byte export from 1.0.143, using an immutable video-1.0.144 release URL. Earlier assets remain available at their original URLs.
- The 33:02 MP4 contains all 80 visual cuts at 960 × 640 and 24 fps, with the unchanged published AAC stream and captions. FFmpeg NVENC output decoded end to end.

## 1.0.143 The Work of the Holy Spirit visual revision (Codex, 27 November)

- Replaced the long repeated chapel opening and varied later illustrations. The new independent visual track has 80 cuts and 47 artwork setups. The longest stretch is 48.68 seconds across the sermon and 24 seconds in the opening.
- The narration and 68 timed captions use the existing recording and word positions. New desktop and phone checks verified scene motion, paused frames, seeking, caption hold and the blank interval.
- The revised MP4 will be added in its own follow-up release after export verification.

## 1.0.142 The Work of the Holy Spirit MP4 (Codex, 27 November)

- Added the full 33:02 MP4 to the Listening Library downloads. GitHub Release video-1.0.142 serves the 236,329,081-byte file. The site keeps the existing Watch animation and audio.
- Exported the 1.0.141 animation at 960 × 640 and 24 fps using FFmpeg h264_nvenc. The file decoded end to end, and its AAC stream matched the published audio.

## 1.0.141 The Work of the Holy Spirit animation (Codex, 27 November)

- Added the 33-minute Watch animation for C. H. Spurgeon’s sermon, using 68 scenes and 26 Canvas artwork setups from chapel to the closing appeal. The captions follow the sermon’s argument from dependence through regeneration, conviction, faith, adoption and pardon.
- Windows GPU Whisper aligned the corrected recording. Twelve caption word timings were interpolated within neighboring speech. The final schedule allows at least four seconds fully visible, a half-second fade, a one-second blank gap and at least 12 intervening spoken words.
- Re-rendered three chunks for transcription errors in the stars, potter and closing appeal passages. The updated recording and regenerated cues use audio-1.0.141. Updated the matching PDF and Word downloads. Prior audio release remains available at its original URL.

- Windows verification covered the clean install, strict production build, full Chrome suite, all 26 artwork setups in motion on desktop, five phone reduced-motion scenes, pause, seeking, caption hold and the visible blank gap.

## 1.0.140 The Work of the Holy Spirit (Codex, 27 November)

- Added C. H. Spurgeon’s sermon No. 178, preached 5 November 1857 on Galatians 3:3. Compared the full sermon body across the Spurgeon Library, Spurgeon Archive and CCEL transcriptions, then checked the date and four text corrections against the printed edition.
- The recording runs 33 minutes 2 seconds, with 160 timed cues from 164 Windows-rendered chunks. MP3 and M4A use the dedicated audio-1.0.140 release. Eight-page PDF and Word transcripts stay on Pages.
- Windows verification passed clean npm ci, strict checks and production build, and the full local Chrome account/library suite, including the new sermon search and PDF download.
- Keep the Windows exact-source archive guard in place. The previous opening-page behavior, catalog entries and animation routes are retained.

## 1.0.139 Listening Library opening page (Codex, 24 November)

- Mike requested Listening Library as the opening page after sign-in, with publication when done. Home now initializes its active tab to Listening Library, including restored sessions. Bible remains available in navigation.
- Added a browser assertion that authenticated entry displays the Listening Library heading and active navigation button.
- Validation: clean npm ci, strict checks and production build passed. Full local account/library browser suite passed, including the opening-page assertion, account recovery, sermon playback/downloads and continuous Bible chapter transitions.
- Based on Claude's 1.0.138; existing animation, audio and downloads retained. Pre-push archive hook remains enabled; skip routine Pages/live checks.

## 1.0.138 Bruised Reed caption placement and motion (Claude, 22 November)

- Mike, on Android and desktop: a big gap between the picture and the caption, and no visible moving parts on the phone.
- Gap: the caption box reserved two rows (outgoing above incoming), each as tall as the longest caption in the book. With `captionGap` only one caption shows at a time, so `SermonCaptions` now uses one row (class `sermon-captions-single`), aligned to the top, sized for the 75th-percentile caption; longer captions grow it. Measured gap from picture to caption: 13 px on a phone, 14 px on desktop. Other animations keep the two-row layout.
- Phone motion: Mike's Android evidently requests reduced motion (an accessibility or battery setting), which painted one still frame at time 0, with the soldier's arrows still off-screen. New opt-in `gentleReducedMotion` on `SermonAnimation` (Bruised Reed only): on such devices, motion continues at a third of the speed, about 12 fps, with one-off actions shown complete. Other animations keep the still frame.
- Motion level: the care scenes (130 of 255) finished their single action in 6–12 s and then hardly moved for the rest of a roughly one-minute scene. Tending hands (reed, lamp, bandage) now ease back and return every 11 s; growth runs across the whole scene; setting down the burden and giving the jewel run more slowly (never reversed); wind, sway and breathing are stronger. The measured share of changing pixels 25 s into a scene is now 1–4% for every frequently used theme, up from 0.4–0.7%. Tool: `video-previews/bruised-reed-revision/motion-measure.mts`; phone and desktop screenshots: `phone-shots.mjs` and `art-review/phone-*.png`.
- Checks: npm run check/build, test:browser, excellency/check.mjs, and the focused Bruised Reed check (desktop; mobile with reduced motion) passed.

## 1.0.137 Bruised Reed artwork fixes (Claude, 22 November)

- Four weaknesses from the 1.0.136 review, at Mike's request. Artwork only; captions, timings and audio are unchanged.
- Sceptre of power (cue 659, "crushed in pieces by his sceptre of power"): the upright rod on a plinth read as a street lamp. It is now an iron rod, held from off-frame, that comes down on an earthen pot (the Psalm 2:9 picture), and the pot breaks into pieces as the man turns from the open door.
- Fragile glass: the fingertips now hold the bowl, then open once it is set down.
- Arms entering from the frame edge (reed, lamp, jewel, blacksmith) now run off-frame instead of ending as floating forearms. The reed and blacksmith hands enter from the right.
- Bridled horse: removed a stray track stroke that read as a log behind the horse.
- Checks: npm run check/build, test:browser and the focused Bruised Reed animation check (desktop; mobile with reduced motion) passed. The three-moment contact sheets are in `video-previews/bruised-reed-revision/art-review/focus-*.png`.

## 1.0.136 The Bruised Reed: animation revision and reference corrections (Claude, continuing Codex's work, 22 November)

- Codex built the editorial revision (whole-book outline, 255 captions chosen from Sibbes's argument, independent caption review, scene map, three moving-subject art modules, Whisper alignment of all 255) and ran out of usage at 18:13. Claude finished it. Work folder: `video-previews/bruised-reed-revision/`.
- Player: opt-in `captionGap` on `SermonAnimation` (`fadeAfterHold` in `SermonCaptions`/`captionOpacity`). By default the old caption only began fading when the next began, so a blank interval was impossible. With it a caption stays until 1.5 s before the next (at least 4 s after its last word), fades over 0.5 s and leaves exactly 1 s caption-free; all 254 gaps measure 1.0 s. Mike chose this over fading straight after the hold, which left the screen caption-free 80% of the time. Bruised Reed uses `captionHold={4} captionGap`; Prayer, Excellency and Jewels are unchanged.
- Artwork: `reed-care-motion.ts`, `reed-meaning-motion.ts`, `reed-government-motion.ts` replace `bruised-reed-paint.ts` (removed). All 26 themes inspected at two moments for subject motion; the prayer scene was re-posed (kneeler faces the open book, companion's hand on his back) because the companion's arm across his face read as a scuffle.
- Audio corrections (Mike heard "Revelation 2210"): the reference converter had left 17 references broken. Fixed in `improved/bruised-reed-sibbes/prepare.py`: Revelation 22:17; Revelation 2 and 3 (twice); Matthew 12 and 13; Matthew 26.; Galatians 2.; Matthew 18:6; Matthew 23:15; Matthew 23:37, 38; Isaiah 50:4 (twice), 50:11; Psalm 50:15, 50:21; Psalm 110:1, 110:3 (scan read l as 1 and cx as ex); Romans 14:1; Proverbs 27:19; Matthew 4:6. Also "commandmg" → commanding, two paragraphs the scan split were rejoined, and one paragraph's reversed quotation marks corrected. A search of all twelve transcripts found no other lost colon.
- Re-rendered only the changed chunks (the rest reused by text); every new chunk was checked with Whisper. Release `audio-1.0.136` replaces `audio-1.0.133` for The Bruised Reed; the older release is left in place. Caption timings were remapped by passage text and start offset, and the two captions in changed passages were re-aligned.
- Skills: shared `.agents/skills/sermon-animation/SKILL.md` gained the player-gap and caption-component rules; a Claude copy was prepared.

## 1.0.135 The Nature of True Virtue (Claude, 22 November)

- New Listening Library item: Jonathan Edwards, The Nature of True Virtue (written about 1755, published 1765), all eight chapters with Edwards's four footnotes read as "Footnote." after the citing paragraph. The transcript uses Edwards's own "Chapter N." headings.
- Mike's Word file was a modernised printing with a repeated block in Chapter 4, a lost Corollary at the end of Chapter 2, a skipped passage on pity in Chapter 6 and about 40 OCR errors, so Mike chose the public-domain text: Hickman's 1834 *Works*, vol. 1, via CCEL. It was word-diffed against Mike's file, and every non-modernising difference was decided by the 1765 Boston first edition (archive.org `twodissertations00edwa`). 29 CCEL errors were corrected; the 1834 editor's notes [227]/[231] and the contents list are removed. Details: `improved/nature-of-true-virtue-edwards/corrections.md`.
- `plan.mjs`: `speakEdwardsVirtue` for this slug only (&c., viz., i.e., Chap./sect., (1.)/(2.), cæteris, Mr. → Mister, Wollaston → Wooleston; quotation marks not spoken). General fixes: `fixNumbers` moves `(1.)` like `1.`, and `(Chap.` is an abbreviation. All ten other sermons re-plan to byte-identical plan.json, so no published audio changes.
- Audio: 2:48:01.8, 806 chunks, 791 transcript passages, narrator warm throughout. Audit: peak 0.747, no clipping, no pause of 0.9 s or more, speech-rate range 12–19 chars/s (titles and comma lists). Release `audio-1.0.135`: MP3 120,981,629 bytes and M4A 120,563,646 bytes, archived in `GitHub History/Release Assets/2026-11-22_audio-1.0.135`.
- `tests/account-library.mts` expects 12 table rows (11 after a removal). `improved/check.mjs` and `excellency/check.mjs` expect 48 downloads.
- Checks: `npm ci`, `npm run check`, `npm run build`, `npm run test:browser`, `improved/check.mjs` (True Virtue release audio and wording) and `excellency/check.mjs`.
- No animation yet; one can be added in a later release.

## 1.0.134 The Bruised Reed animation (Codex, 22 November)

- Adds Watch with animation on the card and quick-action table for the complete 4:01:39 recording, including both introductory sections and all 28 chapters. 296 scenes use exact contiguous spoken excerpts. Original recording, transcript and downloads are retained.
- Reuses appropriate Excellency painter primitives and adds a title-specific painter: bent reed with intact fibres, smouldering wick, seed/growth imagery, lock, anchor, clock and other subjects from Sibbes. Representative artwork contact sheets were inspected and refined, including distinct mustard seed/acorn and fire/water subjects.
- New per-word timing support in SermonAnimation is optional; existing animations keep their previous phrase timings and holds. This book explicitly uses captionHold=4 and a 12-intervening-word planning target. Final audit: all 296 caption starts aligned to the active recording; 1,776 caption words, with six internal word positions interpolated between measured neighbours. Every complete caption holds at least four seconds; actual minimum spacing is 23 spoken words and no overlap exception is needed. Audit: video-previews/bruised-reed/timing-audit.json in the parent workspace.
- Work/checkpoints: /Users/mike/Documents/ChatGPT/Bible Song/video-previews/bruised-reed/. Two local Whisper small.en workers, four CPU threads each; separate checkpoints and selective stronger-decoding retries. 296-scene plan, raw recognized word times, source choices, audit and artwork review sheets are retained locally. No MP4 export requested.
- Verification: clean npm ci, strict checks, production build, strict local tooling check, representative artwork/contact-sheet inspection, focused Chrome checks of all 296 caption holds, partial reveal, pause, 1.5x, deep seeking/transcript following, mobile/reduced motion and all three preceding animations passed. Full account/library browser suite passed, including actual sermon playback/download and continuous Bible transitions. The final tests reject provisional timing markers. The final check caught a 29 ms pre-cue repaired-word boundary; assembly now clamps that measured-word repair to the authoritative cue start.
- Mike explicitly authorized publishing when done. Keep pre-push archive hook enabled, verify remote commit and confirm its archive. Skip Pages deployment/live checks.

## 1.0.133 The Bruised Reed (Claude, 22 November)

- New Listening Library item: Richard Sibbes, The Bruised Reed (1630). It's a whole book: the Epistle Dedicatory, To the General Reader and 28 chapters, about 41,500 words. Its transcript uses the book's own chapter headings.
- Mike's supplied PDF was Monergism Books' copyrighted 2018 edition, so Mike chose the public-domain text: Grosart, Complete Works of Richard Sibbes, vol. 1 (1862), which reprints the 1635 fifth edition. It was rebuilt by a word vote across three archive.org scans, then checked with an independent macOS Vision OCR and the page images. Grosart's footnotes and endnote letters are removed, and his reference misprints are corrected. Details are in `improved/bruised-reed-sibbes/corrections.md`, and the tools are in its `source/`.
- Scripture references are written in modern form. Audio-only forms for this book: Ans./Obs./Quest./Doct./Object., "&c." and "breeches". Quotation marks are not spoken, so transcript quote fixes never force a re-render.
- `tests/account-library.mts` now expects 11 table rows (10 after a removal). `improved/check.mjs` and `excellency/check.mjs` expect 44 downloads.
- Audio: 4:01:39.4, 1,171 chunks, 1,165 transcript passages, narrator warm throughout, rendered with 6 workers. Audit: peak 0.713, no clipping, longest pause 0.82 s. Release `audio-1.0.133`: MP3 173,993,691 bytes and M4A 173,246,078 bytes. Sizes and checksums are verified, and the files are archived in `GitHub History/Release Assets/2026-11-22_audio-1.0.133`.
- `improved/check.mjs` and `excellency/check.mjs` now count only the card downloads. The 1.0.132 table's 22 MP3/PDF links had raised their count to 66.
- Checks: `npm ci`, `npm run check`, `npm run build`, `npm run test:browser`, `improved/check.mjs` (Bruised Reed release audio, wording, seek to 8726 s) and `excellency/check.mjs` all passed.
- No animation yet. ChatGPT will add one in a later release (see `Shared Notes/2026-11-22 Claude to ChatGPT - Bruised Reed animation start.md`).

## 1.0.132 Listening Library table (Codex, 22 November)

- Added the requested seven-column table below search. Default Title A–Z; Author A–Z uses title tie-breaking. Existing search filters table and cards together.
- Title focuses and scrolls to the matching sermon. Audio, animation and MP3/PDF actions jump there and use existing media and controls. Unavailable animations show a dash. Delete uses confirmed, recoverable library removal, without deleting media.
- Horizontal scrolling keeps the table within mobile screens. All ten sermons remain intact.
- Clean npm ci, strict checks and production build passed. Full Chrome browser suite passed twice, including new sorting/filtering, card focus, animation launch, PDF download, removal/recovery and mobile overflow checks, plus existing sermon seeking/download and continuous Bible playback. BIBLE_TEST_URL can select a local preview port.
- Mike authorized publication. Preserve the pre-push archive hook and confirm remote commit/archive. Skip routine Pages/live checks.

## 1.0.131 The Way of Salvation (Claude, 22 November)

- New sermon: C. H. Spurgeon, The Way of Salvation (No. 209, 15 August 1858). 28:43.3, 151 passages. spurgeon.org and CCEL share the same scanning errors, so the text was checked word for word against the 1858 New Park Street Pulpit printing (spurgeon.org PDF scan, OCR'd locally and read by eye). 25 corrections are listed in `improved/way-of-salvation-spurgeon/corrections.md`.
- Voices: warm narrator. Voice 3 for the imagined hearer, composite (voice 4) for the Brahmin and Satan, and classic for God the Father, as in Immutability.
- Rendered with the normal process-pool `render-improved.py`, 6 workers (the sandbox is now off). Chunk 30's 0.9 s Kokoro tail was trimmed to 0.55 s, and the original is kept in `rejected/`. Audit: peak 0.84, no clipping, longest silence 0.96 s. Whisper `small.en` matched seven review passages.
- Audio release `audio-1.0.131`: MP3 20,680,829 bytes and M4A 20,591,721 bytes. PDF and Word are in `public/library/`.
- Fixed the two stale comments that said Free Grace shipped without an M4A (`ListeningLibrary.tsx`, `upload-release.py`).

## 1.0.130 Free Grace (Claude, 21 November)

- New sermon: John Wesley, Free Grace. 33:20.7, 149 passages. The text was corrected against the 1890 edition (`improved/free-grace-wesley/corrections.md`). The Greek and "Esau" use spoken respellings.
- Rendered in Claude's locked session with `published-library/render-threads.py`, which uses threads instead of the process pool because the sandbox blocks semaphores. The model, voices and speed are unchanged. The M4A was encoded outside the sandbox with the `finish.sh` settings.
- Audio release `audio-1.0.130`: `free-grace-wesley.mp3` 24,008,934 bytes and `free-grace-wesley.m4a` 23,909,109 bytes. Sizes and checksums are verified, and the files are archived in `GitHub History/Release Assets/2026-11-21_audio-1.0.130`. PDF and Word are in `public/library/`.
- The player falls back to the MP3 when a sermon has no M4A size entry. Free Grace has both.
- Checks: strict check and build. `npm run test:browser` passed. `improved/check.mjs` passed on port 5190: 36 sized downloads, Free Grace on 1.0.130. Its playing-audio regex now includes 1.0.130. Whisper checked the six review passages against the text. Mike approved publication.

## 1.0.129 caption retention (Codex, 21 November)

- Mike authorized applying a three-second completed-caption hold across Prayer, Excellency and God's Jewels. Shared caption timing is now independent of illustration changes. The outgoing caption finishes revealing above the incoming caption, stays fully visible for at least three media seconds at 1x, then fades. Two reserved rows prevent collisions. Original words, phrase onsets, illustration timing and recordings are unchanged. The 19 short word-spacing cases are approved exceptions; the actual three-second overlap interval is needed in 17 of them.
- New shared files: source/SermonCaptions.tsx and source/caption-timeline.ts. PrayerAnimation and SermonAnimation use them. A captionHold override supports future integrations; these existing three animations retain three seconds.
- All 35 flagged transitions passed desktop/mobile browser checks. The updated retained audit covers all 343 captions / 340 transitions and reports zero holds below three seconds, with unchanged wording and the 19 approved spacing warnings. Evidence: ../video-previews/caption-audit-2026-11-21/retained-audit.json and ../video-previews/caption-retention-2026-11-21/browser-checks.json.
- All 35 local MP4 review clips are complete and decode with audio and video; index: ../video-previews/caption-retention-2026-11-21/index.html. They use actual components and the active .124 Prayer/Jewels and .114 Excellency recordings. No full-sermon MP4 was regenerated or uploaded.
- Clean install, strict checks, production build and the full account/library browser suite passed. Existing chromiumSandbox:true and Luke metadata-readiness fixes are preserved. Mike approved publication on 21 November after reviewing the local candidate. Publication uses the normal pre-push archive hook; confirm the matching archive after remote commit verification.
- Mike separately confirmed four seconds of completed-caption hold and a 12-word spacing target for future videos. The project skill records that future rule without changing this existing three-second trial.

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
