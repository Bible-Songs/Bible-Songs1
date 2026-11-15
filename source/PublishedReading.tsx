import {useEffect,useRef,useState} from 'react';
import {APP_VERSION} from './version';

type Cue={start:number;text:string};
export default function PublishedReading({cues,visible,onPlay,title,filename,size}:{cues:Cue[];visible:boolean;onPlay:()=>void;title:string;filename:string;size:string}){
 const [active,setActive]=useState(-1);
 const audio=useRef<HTMLAudioElement>(null);
 const transcript=useRef<HTMLDivElement>(null);
 const current=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  const panel=transcript.current,button=current.current;
  if(!visible||!panel||!button)return;
  const bounds=panel.getBoundingClientRect(),cue=button.getBoundingClientRect();
  if(cue.top<bounds.top||cue.bottom>bounds.bottom)panel.scrollTop+=cue.top-bounds.top;
 },[active,visible]);
 function update(time:number){
  let index=active;
  if(index<0 || cues[index].start>time)index=0;
  while(index+1<cues.length&&cues[index+1].start<=time)index++;
  setActive(index);
 }
 return <article>
  <h3>{title}</h3>
  <p>C. H. Spurgeon · Drama · {size}</p>
  {visible&&<audio ref={audio} controls preload="none"
   src={`${import.meta.env.BASE_URL}library/${filename}?v=${APP_VERSION}`}
   onPlay={onPlay} onTimeUpdate={event=>update(event.currentTarget.currentTime)}
   onSeeked={event=>update(event.currentTarget.currentTime)}/>}
  <div ref={transcript} className="document-preview" aria-label={`${title} transcript`}>
   {cues.map((cue,index)=><button key={cue.start} ref={index===active?current:undefined}
    aria-current={index===active?'true':undefined} onClick={()=>{
     const player=audio.current;
     if(!player)return;
     player.currentTime=cue.start;
     update(cue.start);
     void player.play().catch(()=>{});
    }}>{cue.text}</button>)}
  </div>
 </article>;
}
