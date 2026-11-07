#!/usr/bin/env python3
"""Free, local synthetic singing draft using eSpeak formant voice and our note timing.
Requires numpy and the open-source espeak command. No API, samples or paid service.
"""
from pathlib import Path
import functools,json,math,re,shutil,subprocess,tempfile,wave
import numpy as np
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/originals/genesis-1'
SONG=json.loads((OUT/'song.json').read_text());RATE=16000;BEAT=60/SONG['bpm']
ESPEAK=shutil.which('espeak') or shutil.which('espeak-ng')
if not ESPEAK:raise SystemExit('Install free eSpeak/eSpeak NG before rendering vocals.')
VOICE='en-us+f3'
VERSE=[[64,67,69,67,64,62,64,60],[62,64,65,69,67,65,64,62],[64,67,72,71,69,67,64,65],[65,64,62,67,64,62,60,60]]
CHORUS=[[67,72,74,76,74,72,69,67],[69,72,76,74,72,71,69,67],[65,69,72,74,72,69,67,65],[67,69,67,64,62,64,60,60]]
TWO={'before','without','spirit','above','began','between','waters','evening','morning','second','beneath','below','greater','lesser','heavens','seasons','living','across','creatures','image','woman','maker','awakes','wonder','very'}
def readwav(path):
 with wave.open(str(path)) as w:
  rate=w.getframerate();a=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(float)/32768
  if w.getnchannels()!=1:a=a.reshape(-1,w.getnchannels()).mean(axis=1)
 if rate!=RATE:a=np.interp(np.arange(round(len(a)*RATE/rate))*rate/RATE,np.arange(len(a)),a)
 return a
@functools.lru_cache(maxsize=None)
def speak(word,pitch):
 with tempfile.TemporaryDirectory(prefix='bible-songs-vocal-') as folder:
  path=Path(folder)/'raw.wav'
  subprocess.run([ESPEAK,'-v',VOICE,'-z','-p',str(pitch),'-s','140','-a','140','-w',str(path),'-m','<prosody range="0">'+word+'</prosody>'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
  a=readwav(path)
 active=np.flatnonzero(abs(a)>.012)
 if len(active):a=a[max(0,active[0]-160):min(len(a),active[-1]+240)]
 return a

def frequency(a):
 values=[];n=1024
 for offset in range(0,max(1,len(a)-n),256):
  x=a[offset:offset+n]
  if len(x)<n or np.sqrt(np.mean(x*x))<.035:continue
  x=(x-np.mean(x))*np.hanning(n)
  spec=np.fft.rfft(x,n*2);acf=np.fft.irfft(spec*spec.conj())[:n]
  lo,hi=int(RATE/420),int(RATE/95)
  index=lo+int(np.argmax(acf[lo:hi]))
  if acf[index]>acf[0]*.35:values.append(RATE/index)
 return float(np.median(values)) if values else 200.

def stretch(a,length):
 # Phase-vocoder duration adjustment, followed by overlap-add reconstruction.
 n=512;hop=128;padded=np.pad(a,(n//2,n//2+n))
 frames=np.lib.stride_tricks.sliding_window_view(padded,n)[::hop]*np.hanning(n)
 d=np.fft.rfft(frames,axis=1).T
 frames_out=max(2,math.ceil(length/hop));positions=np.arange(frames_out)*(d.shape[1]-2)/max(1,frames_out-1)
 phase=np.angle(d[:,0]);advance=2*np.pi*hop*np.arange(d.shape[0])/n
 result=np.zeros((d.shape[0],frames_out),complex)
 for j,pos in enumerate(positions):
  i=int(pos);alpha=pos-i;pair=d[:,i:i+2]
  mag=(1-alpha)*abs(pair[:,0])+alpha*abs(pair[:,1]);result[:,j]=mag*np.exp(1j*phase)
  delta=np.angle(pair[:,1])-np.angle(pair[:,0])-advance
  phase+=advance+delta-2*np.pi*np.round(delta/(2*np.pi))
 win=np.hanning(n);out=np.zeros((frames_out-1)*hop+n);norm=np.zeros_like(out)
 for i,frame in enumerate(np.fft.irfft(result.T,n=n,axis=1)):
  at=i*hop;out[at:at+n]+=frame*win;norm[at:at+n]+=win*win
 out/=np.maximum(norm,1e-8)
 # Removing the centered STFT padding avoids onset lag.
 out=out[n//2:n//2+length]
 return np.pad(out,(0,max(0,length-len(out))))[:length]

calibration={p:frequency(speak('ah',p)) for p in range(0,100,5)}
@functools.lru_cache(maxsize=None)
def sing(word,note,beats):
 target=440*2**((note-69)/12)
 p=min(calibration,key=lambda p:abs(math.log(calibration[p]/target)))
 a=speak(word,p);f=frequency(a);ratio=target/f
 pitched=np.interp(np.arange(0,len(a),ratio),np.arange(len(a)),a)
 samples=round(beats*BEAT*RATE*.94);out=stretch(pitched,samples)
 # Tiny fades avoid splice clicks while keeping consonant attacks.
 fade=min(100,len(out)//4);out[:fade]*=np.linspace(0,1,fade);out[-fade:]*=np.linspace(1,0,fade)
 peak=max(abs(out).max(),.001);return out/peak*.65

with wave.open(str(OUT/'let-there-be-light-demo.wav')) as w:instrumental=readwav(OUT/'let-there-be-light-demo.wav')
vocals=np.zeros_like(instrumental);count=0
for section in SONG['sections']:
 for line_index,line in enumerate(section['lines']):
  words=re.findall(r"[A-Za-z]+(?:[’'][A-Za-z]+)?",line)
  counts=[3 if x.lower()=='multiply' else 2 if x.lower() in TWO else 1 for x in words]
  if sum(counts)!=8:raise ValueError((line,sum(counts)))
  melody=(CHORUS if section['kind']=='chorus' else VERSE)[line_index];beat=0
  for word,syllables in zip(words,counts):
   # Sustain each whole word on a melody note, preserving its pronunciation.
   note=melody[beat]-12;a=sing(word,note,syllables)
   start=round((section['start']+line_index*8*BEAT+beat*BEAT)*RATE)
   end=min(start+len(a),len(vocals));vocals[start:end]+=a[:end-start]
   beat+=syllables;count+=1
# A quiet short echo gives the explicitly synthetic voice some space.
for delay,amount in [(int(.085*RATE),.10),(int(.145*RATE),.06)]:vocals[delay:]+=vocals[:-delay]*amount
mix=instrumental*.50+vocals*.70
mix*=.90/max(abs(mix).max(),.01)
with wave.open(str(OUT/'let-there-be-light-synthetic-vocal.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes((mix*32767).astype('<i2').tobytes())
# Short in-chat preview of the first vocal section and following verse opening.
start=round(SONG['sections'][1]['start']*RATE);excerpt=mix[start:start+round(32*RATE)]
with wave.open(str(OUT/'vocal-preview.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes((excerpt*32767).astype('<i2').tobytes())
print('Rendered',count,'word events with free local formant synthesis; no paid APIs. Synthetic, not a human singer.')
