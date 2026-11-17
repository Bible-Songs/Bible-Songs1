# Bible Songs release handoff

Check GitHub main for the actual latest commit and version before acting.

| Item | Baseline |
| --- | --- |
| Release | 1.0.118 |
| Bible catalog | Genesis 1–15, Luke 1–24, Romans 1–16 |
| Listening Library | God’s Jewels, The Immutability of God, Compel Them to Come In, Payday Someday, Sinners in the Hands of an Angry God, The Excellency of Christ, Christ Crucified, Prayer, the Cure for Care |
| Latest change | Initials read without pauses (“C H Spurgeon”, “R G Lee”) in five sermons; superseded release audio deleted; audio-1.0.118 |
| Previous archive | `GitHub History/2026-11-17_13-36-56-243438_SGT_a097a0b7/files/` |

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
