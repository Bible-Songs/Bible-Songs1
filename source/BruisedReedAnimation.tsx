import type {RefObject} from 'react';
import cues from './bruised-reed-cues.json';
import scenes from './bruised-reed-scenes.json';
import timing from './bruised-reed-caption-timing.json';
import SermonAnimation from './SermonAnimation';
import type {Painter} from './SermonAnimation';
import {paintCare} from './reed-care-motion';
import {paintMeaning} from './reed-meaning-motion';
import {paintGovernment} from './reed-government-motion';

// 1.0.136 editorial revision: 255 captions chosen from Sibbes's argument, with moving-subject artwork.
const care=new Set(['reed-care','flame-care','gradual-growth','healing-care','burden-rest','weak-hand-jewel']);
const meaning=new Set(['reed-and-flax','wind-tossed-plants','triune-agreement-metaphor','fragile-vessel','refining-completion','heated-pliable-metal','grace-shared','flax-to-sunlight']);
const government=new Set(['wise-guidance','prayer-help','grace-discernment','resisting-evil','victorious-rule','white-horse','anchor-trust','free-bird','mercy-sceptre-welcome','mercy-and-power-sceptres','blind-and-sheep-guidance','bridle-of-will']);

for(const [index,scene] of scenes.entries()){
 const cue=cues[scene.cue],entry=timing[index],previous=scenes[index-1];
 if(!cue?.text.includes(scene.line)||entry?.cue!==scene.cue||!Number.isFinite(scene.start)
  ||(previous&&scene.start<=previous.start)||entry.words.map(word=>word.text).join(' ')!==scene.line
  ||!entry.words.length||entry.words.some((word,i)=>!Number.isFinite(word.start)||!Number.isFinite(word.end)
   ||word.end<=word.start||word.start<cue.start-.001
   ||(i>0&&word.start<(entry.words[i-1]?.end??Infinity))))throw Error('Invalid Bruised Reed scene at cue '+scene.cue);
 if(!care.has(scene.art)&&!meaning.has(scene.art)&&!government.has(scene.art))throw Error('Unknown Bruised Reed artwork '+scene.art);
}
const paint:Painter=(context,art,t,elapsed,variant)=>{
 if(care.has(art))paintCare(context,art,t,elapsed,variant);
 else if(meaning.has(art))paintMeaning(context,art,t,elapsed,variant);
 else paintGovernment(context,art,t,elapsed,variant);
};
export default function BruisedReedAnimation({audio,time,playing}:{audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean}){
 return <SermonAnimation audio={audio} time={time} playing={playing} label="The Bruised Reed animation"
  cues={cues} scenes={scenes} timing={timing} paint={paint} captionHold={4} captionGap/>;
}
