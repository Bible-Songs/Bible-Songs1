import type {RefObject} from 'react';
import cues from './gods-jewels-cues.json';
import scenes from './jewels-scenes.json';
import timing from './jewels-caption-timing.json';
import SermonAnimation from './SermonAnimation';
import {createJewelsPainter} from './jewels-paint';

for(const [index,scene] of scenes.entries()){
 const cue=cues[scene.cue],entry=timing[index];
 if(!cue?.text.includes(scene.line)||entry?.cue!==scene.cue
  ||entry.at.length!==Math.ceil(scene.line.split(' ').length/3)
  ||entry.at.some((start,part)=>!Number.isFinite(start)||start<scene.start
   ||start>=(scenes[index+1]?.start??Infinity)
   ||(part>0&&start<=(entry.at[part-1]??Infinity)))){
  throw new Error('Invalid God’s Jewels scene at cue '+scene.cue);
 }
}
const paint=createJewelsPainter(scenes);
export default function JewelsAnimation({audio,time,playing}:{
 audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean;
}){
 return <SermonAnimation audio={audio} time={time} playing={playing} label="God’s Jewels animation"
  cues={cues} scenes={scenes} timing={timing} paint={paint}/>;
}
