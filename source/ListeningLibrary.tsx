import edwardsCues from './edwards-cues.json';
import excellencyCues from './excellency-cues.json';
import paydayCues from './payday-cues.json';
import downloadSizes from './library-download-sizes.json';
import {useEffect,useMemo,useRef,useState} from 'react';
import {Pause,Play,Volume2} from 'lucide-react';
import compelCues from './compel-cues.json';
import immutabilityCues from './immutability-cues.json';
import PublishedReading from './PublishedReading';
import sermonCues from './gods-jewels-cues.json';
import PlaybackSpeed from './PlaybackSpeed';
import {APP_VERSION} from './version';

const readings=[
 {title:'God’s Jewels',author:'C. H. Spurgeon',filename:'gods-jewels-spurgeon.m4a',cues:sermonCues},
 {title:'The Immutability of God',author:'C. H. Spurgeon',filename:'immutability-of-god-spurgeon.m4a',cues:immutabilityCues},
 {title:'Compel Them to Come In',author:'C. H. Spurgeon',filename:'compel-them-to-come-in-spurgeon.m4a',cues:compelCues},
 {title:'Payday Someday',author:'R. G. Lee',filename:'payday-someday-rg-lee.m4a',cues:paydayCues},
 {title:'Sinners in the Hands of an Angry God',author:'Jonathan Edwards',filename:'sinners-in-the-hands-of-an-angry-god-edwards.m4a',cues:edwardsCues},
 {title:'The Excellency of Christ',author:'Jonathan Edwards',filename:'excellency-of-christ-edwards.m4a',cues:excellencyCues},
] as const;
export const libraryTitles=readings.map(({title,filename})=>({title,filename}));
const source=(filename:string)=>`${import.meta.env.BASE_URL}library/${filename}?v=${APP_VERSION}`;
const clock=(seconds:number)=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
const normalize=(text:string)=>text.toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const searchFields=['Title','Author','Transcript'] as const;
const searchIndex=readings.map(reading=>({
 reading,
 Title:normalize(reading.title),
 Author:normalize(reading.author),
 Transcript:normalize(reading.cues.map(cue=>cue.text).join(' ')),
}));
export default function ListeningLibrary({speed,onSpeed,hiddenReadings,onRemove}:{speed:number;onSpeed:(value:number)=>void;hiddenReadings:string[];onRemove:(id:string)=>void}){
 const [queries,setQueries]=useState({Title:'',Author:'',Transcript:''});
 const [selected,setSelected]=useState<(typeof readings)[number]>(()=>readings.find(reading=>!hiddenReadings.includes(reading.filename))??readings[0]);
 const [time,setTime]=useState(0),[duration,setDuration]=useState(0),[playing,setPlaying]=useState(false);
 const [volume,setVolume]=useState(.75),[message,setMessage]=useState('');
 const audio=useRef<HTMLAudioElement>(null);
 const selectedHidden=hiddenReadings.includes(selected.filename);
 useEffect(()=>{
  if(!selectedHidden)return;
  const player=audio.current;
  player?.pause();
  const replacement=readings.find(reading=>!hiddenReadings.includes(reading.filename));
  if(!replacement||!player)return;
  player.src=source(replacement.filename);
  setSelected(replacement);setDuration(0);setTime(0);
 },[selectedHidden,hiddenReadings]);
 const initialSource=useRef(source(selected.filename));
 useEffect(()=>{
  if(audio.current){audio.current.playbackRate=speed;audio.current.volume=volume;}
 },[speed,volume]);
 function play(reading:typeof selected,start?:number){
  const player=audio.current;
  if(!player)return;
  if(reading!==selected){
   player.src=source(reading.filename);
   setSelected(reading);setDuration(0);
  }
  if(start!==undefined){player.currentTime=start;setTime(start);}
  player.playbackRate=speed;
  void player.play().then(()=>setMessage('')).catch(error=>{
   if(error?.name!=='AbortError')setMessage('The audio could not start. Please try again.');
  });
 }
 const filtered=useMemo(()=>{
  const terms=searchFields.map(field=>[field,normalize(queries[field])] as const);
  return searchIndex.filter(entry=>!hiddenReadings.includes(entry.reading.filename)&&terms.every(([field,term])=>entry[field].includes(term))).map(entry=>entry.reading);
 },[queries,hiddenReadings]);
 return <div className="content document-library">
  <div className="page-heading"><h1>Listening Library</h1></div>
  <section className="listen-panel document-workspace">
   <div className="section-heading"><div><h2>Published readings</h2></div></div>
   <div className="library-search" role="group" aria-label="Search Listening Library">
    {searchFields.map(field=><label key={field}>{field}<input type="search" value={queries[field]}
     onChange={event=>setQueries({...queries,[field]:event.target.value})} placeholder={`Search ${field.toLowerCase()}`}/></label>)}
   </div>
   {filtered.length?filtered.map(reading=><PublishedReading key={reading.filename} title={reading.title} author={reading.author}
    onRemove={()=>{if(window.confirm(`Remove ${reading.title} from your library? You can restore it in Recovery centre.`))onRemove(reading.filename);}}
    downloads={(['MP3','M4A','PDF','Word'] as const).map(format=>{
     const name=reading.filename.replace(/\.m4a$/,'.'+(format==='Word'?'docx':format.toLowerCase()));
     const bytes=downloadSizes[reading.filename][format];
     const size=bytes<1_000_000?`${(bytes/1_000).toFixed(1)} KB`:`${(bytes/1_000_000).toFixed(1)} MB`;
     return {format,name,url:source(name),size};
    })}
    cues={reading.cues}
    speed={speed} onSpeed={onSpeed} playing={reading===selected&&playing}
    onToggle={()=>reading===selected&&playing?audio.current?.pause():play(reading)} time={reading===selected?time:null} onPlay={start=>play(reading,start)}/>):<p>{readings.every(reading=>hiddenReadings.includes(reading.filename))?'Your library is empty. Restore a reading in Recovery centre.':'No readings match your search.'}</p>}
  </section>
  <footer>© {new Date().getFullYear()} Bible Songs · Version {APP_VERSION} · <a href="https://github.com/hexgrad/kokoro">Kokoro speech profiles</a></footer>
  <audio ref={audio} preload="metadata" src={initialSource.current}
   onLoadedMetadata={event=>{const player=event.currentTarget;setDuration(player.duration);player.playbackRate=speed;}}
   onTimeUpdate={event=>setTime(event.currentTarget.currentTime)}
   onPlaying={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)}/>
  {message&&<p role="status">{message}</p>}
  <div className="player original-player">
   <div className="now-playing"><div><strong>{selected.title}</strong><span>{selected.author} · Drama</span></div><span className="player-version">Version {APP_VERSION}</span></div>
   <div className="player-center">
    <div className="transport">
     <button className="main-play" aria-label={playing?'Pause audio':'Play audio'} disabled={selectedHidden} onClick={()=>playing?audio.current?.pause():play(selected)}>
      {playing?<Pause size={20} fill="currentColor"/>:<Play size={20} fill="currentColor"/>}
     </button>
     <PlaybackSpeed speed={speed} onChange={onSpeed}/>
    </div>
    <div className="progress"><span>{clock(time)}</span><input aria-label="Seek reading audio" type="range" min="0" max={duration} step=".1"
     value={Math.min(time,duration)} onChange={event=>{if(audio.current)audio.current.currentTime=Number(event.target.value);}}/><span>{clock(duration)}</span></div>
   </div>
   <div className="player-right"><Volume2 size={18}/><input aria-label="Volume" type="range" min="0" max="1" step=".01"
    value={volume} onChange={event=>setVolume(Number(event.target.value))}/></div>
  </div>
 </div>;
}
