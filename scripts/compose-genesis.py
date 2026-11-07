#!/usr/bin/env python3
"""Generate our original Genesis 1 instrumental sketch and editable MIDI; no samples or services."""
from pathlib import Path
import array, math, json, struct, wave, functools
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/originals/genesis-1'; OUT.mkdir(parents=True,exist_ok=True)
BPM=84; BEAT=60/BPM; RATE=16000; TICKS=480
verses=[
 ('Day one · Light', 'Genesis 1:1–5', ['Before the dawn, before the day,','The earth lay dark, without a form.','God’s Spirit moved above the deep;','God spoke, and light began to dawn.']),
 ('Day two · Sky', 'Genesis 1:6–8', ['God spoke, and stretched the sky above,','Between the waters, wide and high.','The evening passed, the morning came;','A second day beneath the sky.']),
 ('Day three · Land and life', 'Genesis 1:9–13', ['The waters drew to seas below;','The dry land rose where grass would grow.','Each tree bore fruit, each plant its seed;','God saw the good in all that grew.']),
 ('Day four · Sun, moon and stars', 'Genesis 1:14–19', ['The greater light would rule the day;','The lesser light would rule the night.','The stars would shine, the seasons turn;','God filled the heavens with their light.']),
 ('Day five · Sea and sky', 'Genesis 1:20–23', ['The waters teemed with living things;','The birds took flight across the sky.','God blessed their life to fill the seas,','To spread their wings and multiply.']),
 ('Day six · Life on earth', 'Genesis 1:24–31', ['God made the creatures of the earth,','And in His image, woman, man.','He blessed them, gave the earth to tend,','And plants for food across the land.']),
]
chorus=['Let there be light, let there be light;','The Maker speaks, the world awakes.','And all He made was very good;','We sing the wonder of His works.']
sections=[{'label':'Instrumental introduction','kind':'intro','lines':[],'bars':4}]
for i,(label,reference,lines) in enumerate(verses):
 sections.append({'label':label,'reference':reference,'kind':'verse','lines':lines,'bars':8})
 if i in [1,3,5]:sections.append({'label':'Refrain','reference':'Inspired by Genesis 1:3, 31','kind':'chorus','lines':chorus,'bars':8})
sections.append({'label':'Instrumental ending','kind':'outro','lines':[],'bars':4})
# Newly written melodic phrases: four two-bar lines per verse or refrain.
verse_melody=[[64,67,69,67,64,62,64,60],[62,64,65,69,67,65,64,62],[64,67,72,71,69,67,64,65],[65,64,62,67,64,62,60,60]]
chorus_melody=[[67,72,74,76,74,72,69,67],[69,72,76,74,72,71,69,67],[65,69,72,74,72,69,67,65],[67,69,67,64,62,64,60,60]]
chords=[[48,52,55],[43,47,50],[45,48,52],[41,45,48],[48,52,55],[41,45,48],[43,47,50],[48,52,55]]
events=[];bar=0
for section in sections:
 section['start']=round(bar*4*BEAT,3)
 for b in range(section['bars']):
  at=(bar+b)*4;chord=chords[b%8]
  events += [(at,4,chord[0]-12,2,.20),(at+2,2,chord[0]-12,2,.13)]
  for n in range(8):events.append((at+n*.5,.7,chord[[0,1,2,1,0,2,1,2][n]]+12,1,.10))
  if section['kind'] in ['verse','chorus']:
   melody=(chorus_melody if section['kind']=='chorus' else verse_melody)[b//2]
   for n in range(4):events.append((at+n,.92,melody[(b%2)*4+n],0,.27))
 bar+=section['bars'];section['end']=round(bar*4*BEAT,3)
DURATION=bar*4*BEAT+2
mix=array.array('f',[0])*int(DURATION*RATE)
@functools.lru_cache(maxsize=None)
def tone(note,beats,kind):
 length=int((beats*BEAT+.12)*RATE); f=440*2**((note-69)/12)
 result=array.array('f')
 for i in range(length):
  t=i/RATE;attack=min(1,t/.015);release=max(0,min(1,(length-i)/(RATE*.14)))
  envelope=attack*release*math.exp(-t*(2 if kind==1 else .8 if kind==0 else 1.3))
  harmonics=(math.sin(2*math.pi*f*t)+.22*math.sin(4*math.pi*f*t)+.07*math.sin(6*math.pi*f*t)) if kind!=2 else math.sin(2*math.pi*f*t)
  result.append(harmonics*envelope)
 return result
for at,beats,note,kind,volume in events:
 start=int(at*BEAT*RATE)
 for j,sample in enumerate(tone(note,beats,kind)):
  if start+j<len(mix):mix[start+j]+=sample*volume
peak=max(abs(x) for x in mix);scale=.88/max(peak,.01)
pcm=array.array('h',(int(x*scale*32767) for x in mix))
with wave.open(str(OUT/'let-there-be-light-demo.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(pcm.tobytes())
def vlq(n):
 b=[n&127];n>>=7
 while n:b.insert(0,(n&127)|128);n>>=7
 return bytes(b)
def track(entries):
 entries.sort(key=lambda x:(x[0],x[1][0]>>4!=8));data=b'';last=0
 for tick,message in entries:data+=vlq(tick-last)+message;last=tick
 data+=b'\x00\xff\x2f\x00'
 return b'MTrk'+struct.pack('>I',len(data))+data
tracks=[track([(0,b'\xff\x51\x03'+int(60000000/BPM).to_bytes(3,'big')),(0,b'\xff\x58\x04\x04\x02\x18\x08')])]
for kind in range(3):
 entries=[(0,bytes([0xc0+kind,[10,0,32][kind]]))]
 for at,beats,note,k,volume in events:
  if kind==k:
   entries.extend([(round(at*TICKS),bytes([0x90+kind,note,round(volume*300)])),(round((at+beats)*TICKS),bytes([0x80+kind,note,0]))])
 tracks.append(track(entries))
(OUT/'let-there-be-light.mid').write_bytes(b'MThd'+struct.pack('>IHHH',6,1,len(tracks),TICKS)+b''.join(tracks))
song={'id':'genesis-1-light','title':'Let There Be Light','book':'Genesis','chapter':1,'status':'Instrumental demo · vocals pending','description':'An original song adaptation inspired by Genesis 1. This demo plays the original melody and accompaniment; it contains no sung vocals.','bpm':BPM,'key':'C major','meter':'4/4','duration':round(DURATION,3),'audio':'originals/genesis-1/let-there-be-light-demo.wav','midi':'originals/genesis-1/let-there-be-light.mid','lyrics':'originals/genesis-1/lyrics.txt','sections':sections,'rights':{'scripture':'Berean Standard Bible (BSB) — public domain','source':'https://ebible.org/engbsb/GEN01.htm','license':'https://berean.bible/terms.htm','composition':'New lyrics, melody and synthesized arrangement prepared for Bible Songs. No external recordings or samples used.','vocal':'No vocal recording has been produced or licensed yet.','adaptation':'These song lyrics are an adaptation, not the verbatim Berean Standard Bible chapter.'}}
if (OUT/'let-there-be-light-synthetic-vocal.wav').exists():
 song['vocalAudio']='originals/genesis-1/let-there-be-light-synthetic-vocal.wav'
 song['vocalPreview']='originals/genesis-1/vocal-preview.wav'
 song['status']='Synthetic vocal draft + instrumental demo'
 song['description']='An original Genesis 1 song adaptation with a synthetic vocal draft and instrumental demo; BSB reference text.'
 song['rights']['vocal']='Free local eSpeak formant synthesis and original pitch/timing processing. No human voice clone or paid API.'
if (OUT/'song.json').exists():
 prior=json.loads((OUT/'song.json').read_text())
 for field in ['warmVocalAudio','warmVocalPreview','recordings']:
  if field in prior:song[field]=prior[field]
 if 'warmVocal' in prior.get('rights',{}):song['rights']['warmVocal']=prior['rights']['warmVocal']
 if 'recordings' in song:song['status']='Two original synthetic vocal choices + instrumental'
(OUT/'song.json').write_text(json.dumps(song,indent=2,ensure_ascii=False)+'\n')
lyrics='LET THERE BE LIGHT\nOriginal song adaptation inspired by Genesis 1\nNot a verbatim Bible translation.\n\n'
for section in sections:
 if section['lines']:lyrics+=section['label']+'\n'+'\n'.join(section['lines'])+'\n\n'
(OUT/'lyrics.txt').write_text(lyrics)
(OUT/'production-notes.md').write_text('''# Let There Be Light — production draft

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
''')
print('Created original instrumental demo:',round(DURATION,1),'seconds;',len(events),'note events')
