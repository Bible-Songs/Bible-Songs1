"""Local pitch analysis and duration processing used by the vocal renderers."""
import math
import numpy as np
RATE=16000

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

