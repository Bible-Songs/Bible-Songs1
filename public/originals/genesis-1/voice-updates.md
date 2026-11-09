# Voice improvements and female voice 5

All recordings are machine-generated using free local tools. They are experimental synthetic readings or musical settings, not human performances.

Voice 1 now uses the standard male Kokoro am_michael neural profile, replacing the older eSpeak reading/singing engine in the active selector. The original classic recordings remain preserved in the project and historical copies. Voice 2 retains the preferred af_heart reading profile. Voice 5 uses the distinctly female af_bella profile. These are licensed pretrained speech profiles, not newly trained singers or celebrity imitations.

Kokoro-82M weights are Apache-2.0: https://huggingface.co/hexgrad/Kokoro-82M . Profiles are documented at https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md . Local inference uses kokoro-onnx (MIT). Singing uses local Praat/Parselmouth pulse-synchronous processing with vowel/consonant timing, appropriate vocal registers, phrase-level gain and no short echo. Libraries and weights are not distributed in the web app. No paid service was used.

Readings have explicit sentence-boundary pauses, including a 0.65-second pause after seas in Genesis 1:10. The text and source voice identity of accepted readings are retained. Bible recordings contain complete Genesis 1 in the public-domain Berean Standard Bible: https://berean.bible/terms.htm . Song-lyrics recordings use the original adaptation, which is not the verbatim chapter. Melody and accompaniment are original synthesized arrangements. Earlier voice 3/4 speech-model and dataset attributions remain in their separate credit files.

Version 1.0.12 replaces the active Voice 3 and Voice 4 tracks with the pretrained Kokoro am_fenrir and am_onyx profiles, respectively. Each profile supplies both reading and singing for the Bible text and the adapted lyrics. Readings use whole sentences with punctuation and an explicit 0.65-second break after “seas.” For singing, Praat adjusts the speech to follow the original melody, using lower octaves appropriate to the male profiles and phoneme timings to protect consonants. The earlier Matcha-TTS recordings and their credits are preserved.
