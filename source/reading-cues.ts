export type SentenceCue = {offset: number; start: number};

type Verse = {verse: number; text: string};
type VerseSegment = {verse?: number; start: number; sentenceCues?: SentenceCue[]};

export type ReadingBoundary = SentenceCue & {verse: number};
export type VoiceOrder = 'rotating' | 'random';

export function nextReadingVoice(voices: string[], current: string, order: VoiceOrder) {
 if (order === 'random') {
  const alternatives = voices.filter(voice => voice !== current);
  return alternatives[Math.floor(Math.random() * alternatives.length)];
 }
 const next = voices[(voices.indexOf(current) + 1) % voices.length];
 return next === current ? undefined : next;
}

export function readingBoundaries(verses: Verse[], segments: VerseSegment[]): ReadingBoundary[] {
 const boundaries: ReadingBoundary[] = [];
 for (const [index, verse] of verses.entries()) {
  const segment = segments.find(item => item.verse === verse.verse);
  if (!segment) continue;
  const previous = verses[index - 1];
  if (!previous || /[.!?…][”’"']*\s*$/.test(previous.text)) {
   boundaries.push({verse: verse.verse, offset: 0, start: segment.start});
  }
  for (const cue of segment.sentenceCues ?? []) {
   boundaries.push({...cue, verse: verse.verse});
  }
 }
 return boundaries;
}
