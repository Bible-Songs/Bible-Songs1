import type {RefObject} from 'react';
import cues from './bruised-reed-cues.json';
import scenes from './bruised-reed-scenes.json';
import timing from './bruised-reed-caption-timing.json';
import SermonAnimation from './SermonAnimation';
import {createBruisedReedPainter} from './bruised-reed-paint';

for(const [index,scene] of scenes.entries()){
 const cue=cues[scene.cue],entry=timing[index],previous=scenes[index-1];
 if(!cue?.text.includes(scene.line)||entry?.cue!==scene.cue||!Number.isFinite(scene.start)
  ||(previous&&scene.start<=previous.start)||entry.words.map(word=>word.text).join(' ')!==scene.line
  ||!entry.words.length||entry.words.some((word,i)=>!Number.isFinite(word.start)||!Number.isFinite(word.end)
   ||word.end<=word.start||word.start<cue.start-.001
   ||(i>0&&word.start<(entry.words[i-1]?.end??Infinity))))throw Error('Invalid Bruised Reed scene at cue '+scene.cue);
}
const paint=createBruisedReedPainter(scenes);
export default function BruisedReedAnimation({audio,time,playing}:{audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean}){
 return <SermonAnimation audio={audio} time={time} playing={playing} label="The Bruised Reed animation"
  cues={cues} scenes={scenes} timing={timing} paint={paint} captionHold={4}/>;
}
