// Reusable sermon animation: a Canvas scene drawn by code plus a caption that wipes in from left to right
// with the recording. Same behaviour as PrayerAnimation (Codex, 1.0.120–1.0.123): the previous caption dims
// before the next one starts, the transcript follows below, and reduced motion turns the wipe into a reveal.
import {useEffect,useRef} from 'react';
import type {RefObject} from 'react';
import './prayer-animation.css';

export type Scene={readonly cue:number;readonly art:string;readonly line:string};
export type CaptionTiming={readonly cue:number;readonly at:readonly number[]};
export type Painter=(context:CanvasRenderingContext2D,art:string,t:number,elapsed:number,variant:number)=>void;
type Cue={readonly start:number;readonly text:string};

export const width=960,height=480;

function phrasesOf(line:string){
 const words=line.split(' ');
 return words.flatMap((_,index)=>index%3===0?[words.slice(index,index+3).join(' ')]:[]);
}

export default function SermonAnimation({audio,time,playing,label,cues,scenes,timing,paint}:{
 audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean;label:string;
 cues:readonly Cue[];scenes:readonly Scene[];timing:readonly CaptionTiming[];paint:Painter;
}){
 const figure=useRef<HTMLElement>(null);
 const canvas=useRef<HTMLCanvasElement>(null);
 const caption=useRef<HTMLSpanElement>(null);
 useEffect(()=>{figure.current?.scrollIntoView({block:'start'});},[]);
 const starts=new Map(timing.map(({cue,at})=>[cue,at]));
 const index=Math.max(0,scenes.findLastIndex(entry=>(cues[entry.cue]?.start??Infinity)<=time));
 const scene=scenes[index]??scenes[0];
 if(!scene)throw new Error('Missing animation scenes for '+label);
 const previous=scenes[index-1];
 const phraseStarts=starts.get(scene.cue);
 const change=cues[scene.cue]?.start??0;
 const fadeDuration=Math.min(.75,(phraseStarts?.[0]??change)-change);
 const previousOpacity=fadeDuration>0?.5*Math.max(0,1-(time-change)/fadeDuration):0;
 const nextChange=cues[scenes[index+1]?.cue??-1]?.start??Infinity;
 const art=scene.art;
 useEffect(()=>{
  const context=canvas.current?.getContext('2d');
  if(!context)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const words=Array.from(caption.current?.querySelectorAll<HTMLSpanElement>('[data-reveal-start]')??[]);
  let frame=0,last=-1;
  function draw(){
   if(!context)return;
   const position=audio.current?.currentTime??time;
   if(!playing||Math.abs(position-last)>=1/24){
    const elapsed=reduced?14:Math.max(0,position-change);
    paint(context,art,reduced?0:position,elapsed,index);last=position;
   }
   // a caption spoken in the final moments must finish revealing before the recording ends
   const finish=(audio.current?.duration||Infinity)-.05;
   for(const word of words){
    const start=Math.min(Number(word.dataset['revealStart']),finish-.01),end=Math.min(Number(word.dataset['revealEnd']),finish);
    const progress=reduced?Number(position>=start):Math.min(1,Math.max(0,(position-start)/(end-start)));
    word.style.clipPath=`inset(0 ${(1-progress)*100}% 0 0)`;
   }
   if(playing&&!reduced)frame=requestAnimationFrame(draw);
  }
  draw();
  return ()=>cancelAnimationFrame(frame);
 },[art,audio,change,index,paint,playing,scene,time]);
 const phrases=phrasesOf(scene.line);
 return <figure ref={figure} className="prayer-animation" aria-label={label}>
  <div className="prayer-animation-stage">
   <canvas ref={canvas} width={width} height={height} aria-hidden="true"/>
  </div>
  <figcaption className="prayer-animation-caption">
   {previous&&previousOpacity>0&&<span className="prayer-animation-previous" aria-hidden="true" style={{opacity:previousOpacity}}>{previous.line}</span>}
   <span className="prayer-animation-line" ref={caption} aria-label={scene.line}>{phrases.map((phrase,part)=>{
    const start=phraseStarts?.[part]??change;
    const end=phraseStarts?.[part+1]??Math.min(start+1.15,nextChange);
    const words=phrase.split(' ');
    const length=phrase.length+1;
    let offset=0;
    return words.map((word,i)=>{
     const from=start+(end-start)*offset/length;
     offset+=word.length+1;
     const to=start+(end-start)*offset/length;
     return <span key={`${scene.cue}-${part}-${i}`} aria-hidden="true">
      {(part>0||i>0)&&' '}<span className="prayer-animation-word" data-reveal-start={from} data-reveal-end={to}>{word}</span>
     </span>;
    });
   })}</span>
  </figcaption>
 </figure>;
}
