# Bible Songs release handoff

Check GitHub main for the actual latest commit and version before acting.

| Item | Baseline |
| --- | --- |
| Release | 1.0.115 |
| Bible catalog | Genesis 1–15, Luke 1–24, Romans 1–16 |
| Listening Library | God’s Jewels, The Immutability of God, Compel Them to Come In, Payday Someday, Sinners in the Hands of an Angry God, The Excellency of Christ |
| Latest change | Revised recordings, transcripts, PDF and Word for the five sermons before The Excellency of Christ; revised audio on release audio-1.0.115 |
| Previous archive | `GitHub History/2026-11-16_10-46-23-493284_SGT_b40a3363/files/` |

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
