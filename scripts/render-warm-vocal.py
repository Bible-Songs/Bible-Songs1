#!/usr/bin/env python3
"""Offline warm vocal experiment: free Kokoro voice + original singing DSP.
No performer recordings, voice cloning, paid inference, or singer-trained fine-tune.
Model files and Python packages live outside the GitHub repo, in ../voice-tools.
"""
from pathlib import Path
import argparse,json,re,sys,wave,hashlib,math
p=argparse.ArgumentParser();p.add_argument('--runtime-dir',default=str(Path(__file__).resolve().parents[2]/'voice-tools'));args=p.parse_args()
TOOLS=Path(args.runtime_dir);sys.path.insert(0,str(TOOLS/'deps'))
import numpy as np
from kokoro_onnx import Kokoro
from vocal_dsp import frequency,RATE,stretch
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/originals/genesis-1';CACHE=TOOLS/'warm-cache';CACHE.mkdir(exist_ok=True)
song=json.loads((OUT/'song.json').read_text());BEAT=60/song['bpm'];VOICE='af_heart'
VERSE=[[64,67,69,67,64,62,64,60],[62,64,65,69,67,65,64,62],[64,67,72,71,69,67,64,65],[65,64,62,67,64,62,60,60]]
CHORUS=[[67,72,74,76,74,72,69,67],[69,72,76,74,72,71,69,67],[65,69,72,74,72,69,67,65],[67,69,67,64,62,64,60,60]]
TWO={'before','without','spirit','above','began','between','waters','evening','morning','second','beneath','below','greater','lesser','heavens','seasons','living','across','creatures','image','woman','maker','awakes','wonder','very'}
model=Kokoro(str(TOOLS/'kokoro-v1.0.onnx'),str(TOOLS/'voices-v1.0.bin'))
def readwav(path):
 with wave.open(str(path)) as w:return np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768

def line_audio(line):
 key=hashlib.sha256((VOICE+'|word-boundaries-v2|'+line).encode()).hexdigest();fp=CACHE/(key+'.npz')
 if fp.exists():
  cached=np.load(fp);return cached['audio'],json.loads(str(cached['timings']))
 words=re.findall(r"[A-Za-z]+(?:[’'][A-Za-z]+)?",line)
 phonemes=' '.join(model.tokenizer.phonemize(word,lang='en-us') for word in words)
 a,sr,ts=model.create_timed(phonemes,voice=VOICE,speed=.80,lang='en-us',is_phonemes=True,sentence_pause=0,clause_pause=0)
 if not ts:raise RuntimeError('This renderer requires phoneme timing output from the model.')
 a=np.interp(np.arange(round(len(a)*RATE/sr))*sr/RATE,np.arange(len(a)),a)
 groups=[];start=None;end=0
 for t in ts:
  if t.phoneme.isspace():
   if start is not None:groups.append((start,end));start=None
  else:
   if start is None:start=t.start
   end=t.end
 if start is not None:groups.append((start,end))
 words=re.findall(r"[A-Za-z]+(?:[’'][A-Za-z]+)?",line)
 if len(groups)!=len(words):raise RuntimeError((line,len(groups),len(words)))
 np.savez(fp,audio=a,timings=json.dumps(groups));return a,groups

def psola_core(a,target,output_length):
 # Pitch-synchronous grains retain the short-time vocal tract spectrum.
 # Consonants are preserved at the beginning/end of the word; the vowel body sustains.
 f=frequency(a);period=max(30,round(RATE/f));period=min(period,max(31,len(a)//4))
 if len(a)<period*3:return stretch(a,output_length)
 # Derive input glottal epochs from local waveform peaks at near-periodic intervals.
 epochs=[];center=period
 while center<len(a)-period:
  lo=max(0,center-period//4);hi=min(len(a),center+period//4)
  peak=lo+int(np.argmax(a[lo:hi]));epochs.append(peak);center=peak+period
 if len(epochs)<2:return stretch(a,output_length)
 epochs=np.array(epochs);out=np.zeros(output_length+2*period);norm=np.zeros_like(out)
 win=np.hanning(2*period);at=float(period)
 while at<output_length+period:
  relative=(at-period)/max(1,output_length);wanted=relative*(len(a)-1)
  source=epochs[int(np.argmin(abs(epochs-wanted)))];grain=a[source-period:source+period]
  if len(grain)!=2*period:at+=RATE/target;continue
  begin=round(at)-period;end=begin+2*period
  if begin>=0 and end<=len(out):out[begin:end]+=grain*win;norm[begin:end]+=win
  # Small delayed vibrato; original expression rather than artist-specific imitation.
  elapsed=(at-period)/RATE;depth=min(1,max(0,(elapsed-.30)/.25))*9
  fnow=target*2**((depth*math.sin(2*math.pi*4.8*elapsed))/1200)
  at+=RATE/fnow
 out/=np.maximum(norm,.4);out=out[period:period+output_length]
 fade=min(120,len(out)//5);out[:fade]*=np.linspace(0,1,fade);out[-fade:]*=np.linspace(1,0,fade)
 return out

def psola(a,target,output_length):
 # Keep brief consonant edges intact; stretch and tune the vowel-rich center.
 edge=min(round(.035*RATE),len(a)//6,output_length//6)
 core=psola_core(a[edge:-edge] if edge else a,target,output_length-2*edge)
 result=np.concatenate([a[:edge],core,a[-edge:]]) if edge else core
 fade=min(100,len(result)//5);result[:fade]*=np.linspace(0,1,fade);result[-fade:]*=np.linspace(1,0,fade)
 return result

instrumental=readwav(OUT/'let-there-be-light-demo.wav');vocals=np.zeros_like(instrumental);count=0
for section in song['sections']:
 for j,line in enumerate(section['lines']):
  a,groups=line_audio(line);words=re.findall(r"[A-Za-z]+(?:[’'][A-Za-z]+)?",line)
  counts=[3 if x.lower()=='multiply' else 2 if x.lower() in TWO else 1 for x in words];assert sum(counts)==8
  melody=(CHORUS if section['kind']=='chorus' else VERSE)[j];beat=0
  for word,syllables,(start,end) in zip(words,counts,groups):
   raw=a[max(0,round(start*RATE)-64):min(len(a),round(end*RATE)+64)]
   length=round(syllables*BEAT*RATE*(.88 if beat+syllables==8 else .98))
   note=melody[beat]-12;target=440*2**((note-69)/12)
   voice=psola(raw,target,length)
   peak=max(.10,float(max(abs(voice))));voice=voice/peak*.59
   position=(beat+syllables/2)/8;dynamics=.76+.19*math.sin(math.pi*position)
   if section['kind']=='chorus':dynamics*=1.08
   dest=round((section['start']+j*8*BEAT+beat*BEAT+.012)*RATE);end=min(dest+len(voice),len(vocals))
   vocals[dest:end]+=voice[:end-dest]*dynamics;beat+=syllables;count+=1
  print('Rendered:',section['label'],j+1,flush=True)
# Conservative room tail; keep words forward and the accompaniment below them.
for lag,amount in [(round(.055*RATE),.07),(round(.105*RATE),.045)]:vocals[lag:]+=vocals[:-lag]*amount
mix=.40*instrumental+.80*vocals;mix*=.90/max(.01,float(max(abs(mix))))
def write(path,a):
 with wave.open(str(path),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes((a*32767).astype('<i2').tobytes())
write(OUT/'let-there-be-light-warm-vocal.wav',mix)
start=round(song['sections'][1]['start']*RATE);write(OUT/'warm-vocal-preview.wav',mix[start:start+32*RATE])
print('Warm expressive draft complete:',count,'word events. Original voice, free local rendering.')
