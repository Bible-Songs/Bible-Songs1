#!/usr/bin/env python3
"""Trained multi-speaker composite voices + the original voice 4 singing renderer.
CPU inference. Uses a locally fine-tuned speech checkpoint, not a singing-trained model.
Use --checkpoint, --output-dir and --profile; evaluate a preview before publishing.
Voice 3 defaults: slower source phrasing (1.3), basic pitch tracker, fixed consonant edges.
WORLD/adaptive options are research alternatives, not used in the published voice 3.
"""
from pathlib import Path
import os,sys,json,re,wave,hashlib,math,argparse
ROOT=Path(__file__).resolve().parents[1];TOOLS=ROOT.parent/'voice-tools';RUN=ROOT.parent/'voice-training/voice3/chatgpt-render'
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
p=argparse.ArgumentParser();p.add_argument('--preview-only',action='store_true');p.add_argument('--checkpoint',required=True);p.add_argument('--output-dir',required=True);p.add_argument('--profile',choices=['male','female','all'],default='male');p.add_argument('--voice-number',type=int,default=3);p.add_argument('--length-scale',type=float,default=1.3);p.add_argument('--temperature',type=float,default=.5);p.add_argument('--steps',type=int,default=16);p.add_argument('--pitch-tracker',choices=['basic','world'],default='basic');p.add_argument('--consonants',choices=['fixed','adaptive'],default='fixed');args=p.parse_args()
torch.set_num_threads(2);torch.set_num_interop_threads(1)
SONG=ROOT/'public/originals/genesis-1';OUT=Path(args.output_dir);OUT.mkdir(parents=True,exist_ok=True);CACHE=RUN/'speech-cache';CACHE.mkdir(parents=True,exist_ok=True)
song=json.loads((SONG/'song.json').read_text());BEAT=60/song['bpm']
checkpoint=Path(args.checkpoint)
# The checkpoint is local/trusted. Identity metadata is never printed or shipped.
ck=torch.load(checkpoint,map_location='cpu');model=MatchaTTS(**{**ck['hyper_parameters'],'optimizer':None,'scheduler':None});model.load_state_dict(ck['state_dict']);model.eval()
import csv
idx=json.loads((ROOT.parent/'voice-training/libritts-r/prepared/filelists/speaker_index.json').read_text())
with (ROOT.parent/'voice-training/libritts-r/extracted/LibriTTS_R/speakers.tsv').open() as f:
 gender={r[0]:r[1] for r in csv.reader(f,delimiter='\t') if len(r)>1}
rows=[i for reader,i in idx.items() if args.profile=='all' or gender.get(reader)==('M' if args.profile=='male' else 'F')]
assert len(rows)>=8
with torch.no_grad():model.spk_emb.weight[0]=model.spk_emb.weight[rows].mean(0)
vocoder=load_hifigan(TOOLS/'matcha-checkpoints/hifigan_univ_v1',torch.device('cpu')).eval()
checkpoint_hash=hashlib.sha256(checkpoint.read_bytes()).hexdigest()
profile_hash=hashlib.sha256(checkpoint_hash.encode()+model.spk_emb.weight[0].detach().numpy().tobytes()+f'voice4-v1-{args.steps}steps-temp{args.temperature}'.encode()+(f'length{args.length_scale}'.encode() if args.length_scale!=.92 else b'')).hexdigest()
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
  result=model.synthesise(x,torch.tensor([len(tokens)]),n_timesteps=args.steps,temperature=args.temperature,spks=torch.tensor([0]),length_scale=args.length_scale)
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

basic_frequency=frequency
if args.pitch_tracker=='world':
 import pyworld as pw
 def frequency(a):
  # Track the source word's voiced F0; never resynthesize or stretch phonemes with WORLD.
  if len(a)>=800:
   f,t=pw.dio(a.astype(np.float64),RATE,f0_floor=60,f0_ceil=500)
   f=pw.stonemask(a.astype(np.float64),f,t,RATE);voiced=f[f>0]
   if len(voiced)>=3:return float(np.median(voiced))
  return basic_frequency(a)

def psola_core(a,target,output_length,f0_hint=None):
 # Pitch-synchronous grains retain the short-time vocal tract spectrum.
 # Consonants are preserved at the beginning/end of the word; the vowel body sustains.
 f=f0_hint if f0_hint is not None else frequency(a);period=max(30,round(RATE/f));period=min(period,max(31,len(a)//4))
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

def adaptive_psola(a,target,output_length,voiced_times,voiced_f0):
 if len(voiced_times)<3:return psola(a,target,output_length)
 begin=max(0,round((voiced_times[0]-.012)*RATE));end=min(len(a),round((voiced_times[-1]+.012)*RATE))
 if end-begin<max(100,round(RATE/float(np.median(voiced_f0)))*3):return psola(a,target,output_length)
 head=a[:begin];tail=a[end:];body=a[begin:end]
 remaining=output_length-len(head)-len(tail)
 if remaining<max(100,len(body)//2):return psola(a,target,output_length)
 core=psola_core(body,target,remaining,f0_hint=float(np.median(voiced_f0)))
 result=np.concatenate([head,core,tail]);fade=min(64,len(result)//8);result[:fade]*=np.linspace(0,1,fade);result[-fade:]*=np.linspace(1,0,fade)
 return result

def readwav(path):
 with wave.open(str(path)) as w:return np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(float)/32768

def write(path,a):
 with wave.open(str(path),'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes((np.clip(a,-1,1)*32767).astype('<i2').tobytes())
instrumental=readwav(SONG/'let-there-be-light-demo.wav');vocals=np.zeros_like(instrumental);count=0
sections=[song['sections'][1]] if args.preview_only else song['sections']
for section in sections:
 for j,line in enumerate(section['lines']):
  a,groups=line_audio(line);words=re.findall(r"[A-Za-z]+(?:[’'][A-Za-z]+)?",line)
  counts=[3 if x.lower()=='multiply' else 2 if x.lower() in TWO else 1 for x in words];assert sum(counts)==8
  melody=(CHORUS if section['kind']=='chorus' else VERSE)[j];beat=0
  if args.consonants=='adaptive':
   import pyworld as pw
   line_f0,line_t=pw.dio(a.astype(np.float64),RATE,f0_floor=60,f0_ceil=500)
   line_f0=pw.stonemask(a.astype(np.float64),line_f0,line_t,RATE)
  for word,syllables,(start,end) in zip(words,counts,groups):
   raw=a[max(0,round(start*RATE)-32):min(len(a),round(end*RATE)+32)]
   length=round(syllables*BEAT*RATE*(.9 if beat+syllables==8 else .97))
   note=melody[beat]-12;target=440*2**((note-69)/12)
   if args.consonants=='adaptive':
    raw_start=max(0,round(start*RATE)-32)/RATE
    mask=(line_t>=raw_start)&(line_t<end)&(line_f0>0)
    voice=adaptive_psola(raw,target,length,line_t[mask]-raw_start,line_f0[mask])
   else:voice=psola(raw,target,length)
   peak=max(.1,float(max(abs(voice))));voice=voice/peak*.56
   dynamics=.78+.16*math.sin(math.pi*(beat+syllables/2)/8)
   if section['kind']=='chorus':dynamics*=1.06
   dest=round((section['start']+j*8*BEAT+beat*BEAT+.012)*RATE);end=min(dest+len(voice),len(vocals))
   vocals[dest:end]+=voice[:end-dest]*dynamics;beat+=syllables;count+=1
  print('Rendered:',section['label'],j+1,flush=True)
for lag,amount in [(round(.055*RATE),.055),(round(.105*RATE),.03)]:vocals[lag:]+=vocals[:-lag]*amount
mix=.36*instrumental+.83*vocals;mix*=.9/max(.01,float(max(abs(mix))))
start=round(song['sections'][1]['start']*RATE)
# Preview always has a complete vocal section; preview-only stops at its end.
preview_len=32*RATE
write(OUT/'preview.wav',mix[start:start+preview_len])
write(OUT/'dry-preview.wav',vocals[start:start+preview_len])
if not args.preview_only:write(OUT/'full-song.wav',mix)
report={'status':'preview-rendered' if args.preview_only else 'full-song-rendered','voice_number':args.voice_number,'profile':args.profile,'profile_speaker_count':len(rows),'checkpoint_step':ck['global_step'],'checkpoint_path':str(checkpoint),'checkpoint_sha256':checkpoint_hash,'embedding_hash':profile_hash,'word_events':count,'sample_rate':RATE,'full_duration_seconds':len(mix)/RATE,'peak':float(np.max(np.abs(mix))),'method':'Locally fine-tuned Matcha-TTS speech model; mean of selected speaker embeddings; original voice4 word-alignment and PSOLA renderer','device':'cpu','speech_not_singing_training':True,'length_scale':args.length_scale,'temperature':args.temperature,'flow_steps':args.steps,'pitch_tracker':args.pitch_tracker,'consonants':args.consonants}
(OUT/'RENDER-RESULT.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report),flush=True)
