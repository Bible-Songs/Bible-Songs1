import type {RefObject} from 'react';
import cues from './excellency-cues.json';
import scenes from './excellency-scenes.json';
import timing from './excellency-caption-timing.json';
import SermonAnimation from './SermonAnimation';
import {isArt,paintExcellency} from './excellency-paint';

// Validate the scene plan once: every scene names a drawn scene and quotes words spoken in its cue.
for(const scene of scenes){
 const cue=cues[scene.cue];
 if(!isArt(scene.art)||!cue||!cue.text.includes(scene.line))throw new Error('Invalid Excellency scene at cue '+scene.cue);
}

export default function ExcellencyAnimation({audio,time,playing}:{
 audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean;
}){
 return <SermonAnimation audio={audio} time={time} playing={playing} label="The Excellency of Christ animation"
  cues={cues} scenes={scenes} timing={timing} paint={paintExcellency}/>;
}
