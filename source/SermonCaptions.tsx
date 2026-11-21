import {useEffect,useRef,useState} from 'react';
import type {RefObject} from 'react';
import {captionOpacity,CAPTION_HOLD} from './caption-timeline';
import type {TimedCaption} from './caption-timeline';

export default function SermonCaptions({captions,audio,time,playing,minimumHold=CAPTION_HOLD}:{
 captions:readonly TimedCaption[];audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean;
 minimumHold?:number;
}){
 const box=useRef<HTMLElement>(null),measure=useRef<HTMLSpanElement>(null);
 const [position,setPosition]=useState(time);
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const change=()=>setReduced(media.matches);change();
  media.addEventListener('change',change);return ()=>media.removeEventListener('change',change);
 },[]);
 useEffect(()=>{
  let frame=0,last=-Infinity;
  function tick(){
   const at=audio.current?.currentTime??time;
   if(Math.abs(at-last)>=1/24){setPosition(at);last=at;}
   if(playing)frame=requestAnimationFrame(tick);
  }
  tick();return ()=>cancelAnimationFrame(frame);
 },[audio,time,playing]);
 useEffect(()=>{
  const container=box.current,ruler=measure.current;if(!container||!ruler)return;
  function resize(){
   if(!container||!ruler)return;
   let height=0;
   for(const caption of captions){ruler.textContent=caption.line;height=Math.max(height,ruler.getBoundingClientRect().height);}
   ruler.textContent='';container.style.setProperty('--caption-row-height',`${height}px`);
  }
  resize();const observer=new ResizeObserver(resize);observer.observe(container);
  return ()=>observer.disconnect();
 },[captions]);
 const duration=audio.current?.duration??Infinity;
 const current=captions.findLastIndex(c=>c.start<=position);
 const visible=captions.filter((caption,index)=>index<=current&&captionOpacity(caption,captions[index+1],position,duration,minimumHold)>0);
 return <figcaption ref={box} className="prayer-animation-caption sermon-captions" aria-label="Spoken captions">
  <span ref={measure} className="sermon-caption-measure" aria-hidden="true"/>
  {visible.map(caption=>{
   const outgoing=caption!==captions[current];
   const opacity=captionOpacity(caption,captions[caption.id+1],position,duration,minimumHold);
   const finish=Number.isFinite(duration)&&duration>0?duration-.05:Infinity;
   return <span key={caption.id} className={`prayer-animation-line ${outgoing?'sermon-caption-outgoing':'sermon-caption-current'}`}
    data-caption-id={caption.id} data-reveal-end={Math.min(caption.end,finish)} aria-label={caption.line} style={{opacity}}>
    {caption.words.map((word,index)=>{
     const start=Math.min(word.start,finish-.01),end=Math.min(word.end,finish);
     const progress=reduced?Number(position>=start):Math.min(1,Math.max(0,(position-start)/(end-start)));
     return <span key={index} aria-hidden="true">{index>0&&' '}<span className="prayer-animation-word"
      data-reveal-start={start} data-reveal-end={end} style={{clipPath:`inset(0 ${(1-progress)*100}% 0 0)`}}>{word.text}</span></span>;
    })}
   </span>;
  })}
 </figcaption>;
}
