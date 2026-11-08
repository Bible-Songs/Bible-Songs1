#!/usr/bin/env python3
"""Voice 4: locally adapted composite Matcha speaker embedding + original singing DSP.
CPU inference. No Common Voice data, paid API, or separately trained acoustic model.
Run with ../voice-tools/pilot-venv/bin/python scripts/render-composite-vocal.py
"""
from pathlib import Path
import os,sys,json,re,wave,hashlib,math,argparse
ROOT=Path(__file__).resolve().parents[1];TOOLS=ROOT.parent/'voice-tools';RUN=ROOT.parent/'voice-training/voice4'
os.environ.setdefault('PHONEMIZER_ESPEAK_LIBRARY',str(TOOLS/'deps/espeakng_loader/libespeak-ng.dylib'))
os.environ.setdefault('ESPEAK_DATA_PATH',str(TOOLS/'deps/espeakng_loader/espeak-ng-data'))
os.environ.setdefault('MPLCONFIGDIR',str(RUN/'mpl-cache'));os.environ.setdefault('MPLBACKEND','Agg')
import numpy as np
import torch
from matcha.models.matcha_tts import MatchaTTS
from matcha.text import text_to_sequence,cleaned_text_to_sequence
from matcha.utils.utils import intersperse
from matcha.cli import load_hifigan
from vocal_dsp import frequency,RATE,stretch
p=argparse.ArgumentParser();p.add_argument('--preview-only',action='store_true');p.add_argument('--adapter',default=str(RUN/'selected-adapter.pt'));args=p.parse_args()
torch.set_num_threads(2);torch.set_num_interop_threads(1)
OUT=ROOT/'public/originals/genesis-1';CACHE=RUN/'speech-cache';CACHE.mkdir(exist_ok=True)
song=json.loads((OUT/'song.json').read_text());BEAT=60/song['bpm']
base_path=TOOLS/'matcha-checkpoints/matcha_vctk.ckpt';adapter_path=Path(args.adapter)
base=torch.load(base_path,map_location='cpu');model=MatchaTTS(**base['hyper_parameters']);model.load_state_dict(base['state_dict']);model.eval()
adapt=torch.load(adapter_path,map_location='cpu')
with torch.no_grad():model.spk_emb.weight[0]=adapt['speaker_embeddings'][:8].mean(0)
vocoder=load_hifigan(TOOLS/'matcha-checkpoints/hifigan_univ_v1',torch.device('cpu')).eval()
# Cache tied to the actual adapted embedding, model and renderer settings.
profile_hash=hashlib.sha256(model.spk_emb.weight[0].detach().numpy().tobytes()+b'voice4-v1-16steps-temp0.5').hexdigest()
def line_audio(line):
 key=hashlib.sha256((profile_hash+'|'+line).encode()).hexdigest();fp=CACHE/(key+'.npz')
 if fp.exists():
  c=np.load(fp);return c['audio'],c['groups'].tolist()
 words=re.findall(r"[A-Za-z]+(?:[’'][A-Za-z]+)?",line)
 phones=[];ranges=[];cursor=0
 for word in words:
  ids,clean=text_to_sequence(word,['english_cleaners2'])
  ranges.append((cursor,cursor+len(ids)));cursor+=len(ids)+1;phones+=ids+cleaned_text_to_sequence(' ')
 phones=phones[:-1];tokens=intersperse(phones,0);x=torch.tensor(tokens,dtype=torch.long)[None]
 # A stable per-line seed makes re-renders reproducible on this machine.
 torch.manual_seed(int(key[:8],16))
 with torch.inference_mode():
  result=model.synthesise(x,torch.tensor([len(tokens)]),n_timesteps=16,temperature=.5,spks=torch.tensor([0]),length_scale=.92)
  a=vocoder(result['mel']).squeeze().clamp(-1,1).numpy()
  att=result['attn'].reshape(len(tokens),-1);dur=att.sum(-1).numpy();bounds=np.concatenate([[0],np.cumsum(dur)])
 groups=[]
 for start,end in ranges:
  lo=bounds[2*start]*256/22050;hi=bounds[min(len(tokens),2*end+1)]*256/22050
  groups.append((float(lo),float(hi)))
 a=np.interp(np.arange(round(len(a)*RATE/22050))*22050/RATE,np.arange(len(a)),a)
 assert len(groups)==len(words) and all(e>s for s,e in groups)
 np.savez(fp,audio=a,groups=np.array(groups));return a,groups

VERSE=[[64,67,69,67,64,62,64,60],[62,64,65,69,67,65,64,62],[64,67,72,71,69,67,64,65],[65,64,62,67,64,62,60,60]]
CHORUS=[[67,72,74,76,74,72,69,67],[69,72,76,74,72,71,69,67],[65,69,72,74,72,69,67,65],[67,69,67,64,62,64,60,60]]
TWO={'before','without','spirit','above','began','between','waters','evening','morning','second','beneath','below','greater','lesser','heavens','seasons','living','across','creatures','image','woman','maker','awakes','wonder','very'}

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

def readwav(path):
 with wave.open(str(path)) as w:return np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768

def write(path,a):
 with wave.open(str(path),'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
instrumental=readwav(OUT/'let-there-be-light-demo.wav');vocals=np.zeros_like(instrumental);count=0
sections=[song['sections'][1]] if args.preview_only else song['sections']
for section in sections:
 for j,line in enumerate(section['lines']):
  a,groups=line_audio(line);words=re.findall(r"[A-Za-z]+(?:[’'][A-Za-z]+)?",line)
  counts=[3 if x.lower()=='multiply' else 2 if x.lower() in TWO else 1 for x in words];assert sum(counts)==8
  melody=(CHORUS if section['kind']=='chorus' else VERSE)[j];beat=0
  for word,syllables,(start,end) in zip(words,counts,groups):
   raw=a[max(0,round(start*RATE)-32):min(len(a),round(end*RATE)+32)]
   length=round(syllables*BEAT*RATE*(.9 if beat+syllables==8 else .97))
   note=melody[beat]-12;target=440*2**((note-69)/12)
   voice=psola(raw,target,length);peak=max(.1,float(max(abs(voice))));voice=voice/peak*.56
   dynamics=.78+.16*math.sin(math.pi*(beat+syllables/2)/8)
   if section['kind']=='chorus':dynamics*=1.06
   dest=round((section['start']+j*8*BEAT+beat*BEAT+.012)*RATE);end=min(dest+len(voice),len(vocals))
   vocals[dest:end]+=voice[:end-dest]*dynamics;beat+=syllables;count+=1
  print('Rendered:',section['label'],j+1,flush=True)
for lag,amount in [(round(.055*RATE),.055),(round(.105*RATE),.03)]:vocals[lag:]+=vocals[:-lag]*amount
mix=.36*instrumental+.83*vocals;mix*=.9/max(.01,float(max(abs(mix))))
start=round(song['sections'][1]['start']*RATE)
# Preview always has a complete vocal section; preview-only stops at its end.
preview_len=round((song['sections'][1]['end']-song['sections'][1]['start'])*RATE) if args.preview_only else 32*RATE
write(OUT/'composite-vocal-preview.wav',mix[start:start+preview_len])
write(RUN/'voice4-dry-preview.wav',vocals[start:start+preview_len])
if not args.preview_only:write(OUT/'let-there-be-light-composite-vocal.wav',mix)
report={'status':'preview-rendered' if args.preview_only else 'full-song-rendered','profile':'Voice 4 — Resonant composite','adapter_step':adapt['step'],'adapter_path':str(adapter_path),'embedding_hash':profile_hash,'word_events':count,'sample_rate':RATE,'full_duration_seconds':len(mix)/RATE,'peak':float(np.max(np.abs(mix))),'method':'Frozen pretrained Matcha-TTS/VCTK acoustic model; 8 LibriTTS-R-adapted speaker embeddings averaged; original PSOLA pitch/timing and accompaniment','not_a_separately_trained_acoustic_model':True,'device':'cpu'}
(RUN/'RENDER-RESULT.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report),flush=True)
