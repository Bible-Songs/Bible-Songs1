import type {RefObject} from 'react';
import SermonAnimation from './SermonAnimation';
import cues from './work-of-the-holy-spirit-cues.json';
import visualCuts from './work-of-the-holy-spirit-visual-cuts.json';
import scenes from './work-of-the-holy-spirit-scenes.json';
import timing from './work-of-the-holy-spirit-caption-timing.json';
import {paintHolySpirit} from './holy-spirit-paint';

const art=new Set(['chapel','pulpit','objector','manna','scripture','fountain','fountainDry','temple','stone',
 'workbench','seed','cradle','wind','street','burden','potter','cross','robe','adoption','chain','nicodemus',
 'flood','statue','gate','creatures','hope','arrival','assembly','pew','balcony','address','prayerClose',
 'templeExit','windowLight','stillPrayer','bookDetail','bookStudy','writing','preparation','almanac','crossNear','crossDusk',
 'threshold','porch','dawn','road','gift','tableWelcome','brace','labor','handwork','mirror']);
for(const [index,cut] of visualCuts.entries()){
 const previous=visualCuts[index-1];
 if(!art.has(cut.art)||!Number.isFinite(cut.start)||(previous?cut.start<=previous.start||cut.start-previous.start>60||cut.art===previous.art:cut.start!==0))
  throw new Error('Invalid Holy Spirit visual cut '+index);
}
if(scenes.length!==timing.length||scenes.length===0)throw new Error('Invalid Holy Spirit scene count');
for(const [index,scene] of scenes.entries()){
 const cue=cues[scene.cue],entry=timing[index],previous=scenes[index-1];
 const previousEnd=timing[index-1]?.words.at(-1)?.end;
 const first=entry?.words[0];
 if(!cue?.text.includes(scene.line)||entry?.cue!==scene.cue||!art.has(scene.art)
  ||!Number.isFinite(scene.start)||(previous&&scene.start<=previous.start)
  ||!first||entry.words.map(word=>word.text).join(' ')!==scene.line
  ||(previousEnd!==undefined&&first.start-previousEnd<5.499)
  ||entry.words.some((word,i)=>!Number.isFinite(word.start)||!Number.isFinite(word.end)
    ||word.end<=word.start||word.start<cue.start-.001||(i>0&&word.start<(entry.words[i-1]?.end??Infinity))))
  throw new Error('Invalid Holy Spirit scene at cue '+scene.cue);
}

export default function HolySpiritAnimation({audio,time,playing}:{audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean}){
 return <SermonAnimation audio={audio} time={time} playing={playing} label="The Work of the Holy Spirit animation"
  cues={cues} scenes={scenes} timing={timing} paint={paintHolySpirit} visualCuts={visualCuts} captionHold={4} captionGap gentleReducedMotion/>;
}
