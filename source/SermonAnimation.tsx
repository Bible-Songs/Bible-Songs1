// Scene artwork follows its original timing; captions reveal independently and retain
// completed outgoing words above the incoming caption before fading.
import {useEffect,useMemo,useRef} from 'react';
import type {RefObject} from 'react';
import './prayer-animation.css';
import SermonCaptions from './SermonCaptions';
import {timedCaption} from './caption-timeline';
import type {CaptionWord} from './caption-timeline';

export type Scene={readonly cue:number;readonly art:string;readonly line:string;readonly start?:number};
// One timing entry per scene, in scene order: the start of each three-word phrase of its caption.
export type CaptionTiming={readonly cue:number;readonly at:readonly number[];readonly words?:readonly CaptionWord[]};
export type Painter=(context:CanvasRenderingContext2D,art:string,t:number,elapsed:number,variant:number)=>void;
type Cue={readonly start:number;readonly text:string};

export const width=960,height=480;

// captionGap: keep each completed caption until 1.5 s before the next (at least captionHold after its last word),
// then fade over 0.5 s, leaving 1 s caption-free before the next caption (Mike's 1-second target, 22 Nov 2026).
export default function SermonAnimation({audio,time,playing,label,cues,scenes,timing,paint,captionHold=3,captionGap=false}:{
 audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean;label:string;
 cues:readonly Cue[];scenes:readonly Scene[];timing:readonly CaptionTiming[];paint:Painter;
 captionHold?:number;captionGap?:boolean;
}){
 const figure=useRef<HTMLElement>(null);
 const canvas=useRef<HTMLCanvasElement>(null);
 const captions=useMemo(()=>scenes.map((scene,index)=>{
  const words=timing[index]?.words;
  if(words?.length)return {id:index,line:scene.line,start:words[0]?.start??0,end:words.at(-1)?.end??0,words};
  return timedCaption(index,scene.line,timing[index]?.at??[],cues[scene.cue]?.start??0);
 }),[scenes,timing,cues]);
 useEffect(()=>{figure.current?.scrollIntoView({block:'start'});},[]);
 // A scene begins with its transcript passage; a second scene in the same passage begins just before its words.
 const sceneStart=(i:number)=>{
  const entry=scenes[i];if(!entry)return Infinity;
  if(entry.start!==undefined)return entry.start;
  const cueStart=cues[entry.cue]?.start??Infinity;
  return scenes[i-1]?.cue===entry.cue?Math.max(cueStart,(timing[i]?.at[0]??cueStart)-.8):cueStart;
 };
 const index=Math.max(0,scenes.findLastIndex((_,i)=>sceneStart(i)<=time));
 const scene=scenes[index]??scenes[0];
 if(!scene)throw new Error('Missing animation scenes for '+label);
 const change=sceneStart(index);
 const art=scene.art;
 useEffect(()=>{
  const context=canvas.current?.getContext('2d');
  if(!context)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame=0,last=-1;
  function draw(){
   if(!context)return;
   const position=audio.current?.currentTime??time;
   if(!playing||Math.abs(position-last)>=1/24){
    const elapsed=reduced?14:Math.max(0,position-change);
    paint(context,art,reduced?0:position,elapsed,index);last=position;
   }
   if(playing&&!reduced)frame=requestAnimationFrame(draw);
  }
  draw();
  return ()=>cancelAnimationFrame(frame);
 },[art,audio,change,index,paint,playing,scene,time]);
 return <figure ref={figure} className="prayer-animation" aria-label={label}>
  <div className="prayer-animation-stage">
   <canvas ref={canvas} width={width} height={height} aria-hidden="true"/>
  </div>
  <SermonCaptions captions={captions} audio={audio} time={time} playing={playing} minimumHold={captionHold} fadeAfterHold={captionGap}/>
 </figure>;
}
