# Reading and singing controls (version 1.0.9)

The top control selects the words: **Bible (Berean Standard Bible)** or **Song lyrics**. The control beneath selects **Reading** or **Singing**. Every page opening defaults to Bible and Reading; the user's vocal preference is still remembered.

All four existing voices have all four combinations. Bible reading contains the complete Genesis 1 chapter, verses 1–31. Bible singing is a new original melodic setting of that same public-domain chapter, distinct from the adapted lyrics of “Let There Be Light.” Song-lyrics reading speaks those adapted lyrics, and song-lyrics singing plays the existing song recording for the selected voice. Instrumental-only is available for song-lyrics singing.

`public/originals/genesis-1/listening.json` records the twelve new audio files, durations, text-source hashes and verse/line timing. Existing song singing comes from song.json. Reading uses plain local speech synthesis without musical pitch fitting or accompaniment. Bible singing uses original melody/accompaniment and local Praat processing. New recordings are AAC/M4A to reduce download size. Voice identities, licenses and credits are retained; no paid services, new model training or source corpus redistribution were involved.

The text reader follows the chosen source. Verse timings allow the current Bible verse to be highlighted. Switching text, mode or voice resets playback and uses the corresponding audio rather than relabelling another track. Audio and download URLs include the app version to avoid serving an old cached recording. The visible version is also placed directly beside the heart in the fixed bottom player.

The adapted-lyrics line “God’s Spirit moved above the deep” has a focused revision in voices 3 and 4: model-predicted phoneme timing protects consonants rather than stretching all voiced sounds, and “Spirit” receives slight emphasis. Other established voice processing is retained. This is a targeted refinement requiring listener judgment, not a claim of perfect pronunciation.

Validation covers all sixteen combinations, actual browser playback and metadata, defaults on reopening, instrumental fallback, mobile overflow and fixed-player version visibility. Local generated WAVs, source caches, models and rendering libraries remain outside GitHub. The public app ships generated recordings and text/credits only. See listening-credits.md in the recording directory for attribution.
