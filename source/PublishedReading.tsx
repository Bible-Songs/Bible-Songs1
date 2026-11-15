import {useEffect,useRef} from 'react';
import PlaybackSpeed from './PlaybackSpeed';
import {Pause,Play} from 'lucide-react';

export type Cue={start:number;text:string};
export default function PublishedReading({cues,title,author,time,onPlay,speed,onSpeed,downloads,playing,onToggle}:{cues:Cue[];title:string;author:string;playing:boolean;onToggle:()=>void;downloads:{url:string;name:string;format:string;size:string}[];time:number|null;onPlay:(start:number)=>void;speed:number;onSpeed:(value:number)=>void}){
 const transcript=useRef<HTMLDivElement>(null);
 const current=useRef<HTMLButtonElement>(null);
 let active=-1;
 if(time!==null)active=cues.findLastIndex(cue=>cue.start<=time);
 useEffect(()=>{
  const panel=transcript.current,button=current.current;
  if(!panel||!button)return;
  const bounds=panel.getBoundingClientRect(),cue=button.getBoundingClientRect();
  if(cue.top<bounds.top||cue.bottom>bounds.bottom)panel.scrollTop+=cue.top-bounds.top;
 },[active]);
 return <article>
  <h3>{title}</h3>
  <p>{author} · Drama</p>
  <div className="document-actions"><button className="document-reading-play" onClick={onToggle} aria-label={`${playing?'Pause':'Play'} ${title}`}>{playing?<Pause size={16}/>:<Play size={16}/>} {playing?'Pause':'Play'}</button><PlaybackSpeed speed={speed} onChange={onSpeed}/>{downloads.map(file=><a key={file.format} className="document-upload" href={file.url} download={file.name}>Download {file.format} · {file.size}</a>)}</div>
  <div ref={transcript} className="document-preview" aria-label={`${title} transcript`}>
   {cues.map((cue,index)=><button key={cue.start} ref={index===active?current:undefined}
    aria-current={index===active?'true':undefined} onClick={()=>onPlay(cue.start)}>{cue.text}</button>)}
  </div>
 </article>;
}
