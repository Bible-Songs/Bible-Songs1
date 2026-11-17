import type {RefObject} from 'react';
import cues from './excellency-cues.json';
import scenes from './excellency-scenes.json';
import timing from './excellency-caption-timing.json';
import SermonAnimation from './SermonAnimation';
import {createExcellencyPainter} from './excellency-paint';

const paintExcellency=createExcellencyPainter(scenes);

// Validate the scene plan once: every scene names a drawn scene and quotes words spoken in its cue.
for(const [index,scene] of scenes.entries()){
 const cue=cues[scene.cue],entry=timing[index];
 if(!cue?.text.includes(scene.line)||!scene.objects.length||!Number.isFinite(scene.start)
  ||entry?.cue!==scene.cue||entry.at.length!==Math.ceil(scene.line.split(' ').length/3)
  ||entry.at.some((start,part)=>!Number.isFinite(start)||start<scene.start||start>=(scenes[index+1]?.start??Infinity)
   ||(part>0&&start<=(entry.at[part-1]??Infinity)))){
  throw new Error('Invalid Excellency scene at cue '+scene.cue);
 }
}

export default function ExcellencyAnimation({audio,time,playing}:{
 audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean;
}){
 return <SermonAnimation audio={audio} time={time} playing={playing} label="The Excellency of Christ animation"
  cues={cues} scenes={scenes} timing={timing} paint={paintExcellency}/>;
}
