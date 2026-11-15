import paydayCues from './payday-cues.json';
import {useEffect,useRef,useState} from 'react';
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
] as const;
const source=(filename:string)=>`${import.meta.env.BASE_URL}library/${filename}?v=${APP_VERSION}`;
const clock=(seconds:number)=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
const normalize=(text:string)=>text.toLowerCase().replace(/[’‘]/g,"'");
export default function ListeningLibrary({speed,onSpeed}:{speed:number;onSpeed:(value:number)=>void}){
 const [query,setQuery]=useState(''),[selected,setSelected]=useState<(typeof readings)[number]>(readings[0]);
 const [time,setTime]=useState(0),[duration,setDuration]=useState(0),[playing,setPlaying]=useState(false);
 const [volume,setVolume]=useState(.75),[message,setMessage]=useState('');
 const audio=useRef<HTMLAudioElement>(null);
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
 const term=normalize(query.trim());
 const filtered=readings.filter(reading=>normalize(reading.title+' '+reading.author).includes(term)||
  reading.cues.some(cue=>normalize(cue.text).includes(term)));
 return <div className="content document-library">
  <div className="page-heading"><h1>Listening Library</h1></div>
  <section className="listen-panel document-workspace">
   <div className="section-heading"><div><h2>Published readings</h2></div></div>
   <label>Search Listening Library<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search titles, authors or transcripts"/></label>
   {filtered.length?filtered.map(reading=><PublishedReading key={reading.filename} title={reading.title} author={reading.author}
    cues={reading.cues}
    speed={speed} onSpeed={onSpeed} time={reading===selected?time:null} onPlay={start=>play(reading,start)}/>):<p>No readings match your search.</p>}
  </section>
  <footer>© {new Date().getFullYear()} Bible Songs · Version {APP_VERSION} · <a href="https://github.com/hexgrad/kokoro">Kokoro speech profiles</a></footer>
  <audio ref={audio} preload="metadata" src={source(readings[0].filename)}
   onLoadedMetadata={event=>{const player=event.currentTarget;setDuration(player.duration);player.playbackRate=speed;}}
   onTimeUpdate={event=>setTime(event.currentTarget.currentTime)}
   onPlaying={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)}/>
  {message&&<p role="status">{message}</p>}
  <div className="player original-player">
   <div className="now-playing"><div><strong>{selected.title}</strong><span>{selected.author} · Drama</span></div><span className="player-version">Version {APP_VERSION}</span></div>
   <div className="player-center">
    <div className="transport">
     <button className="main-play" aria-label={playing?'Pause audio':'Play audio'} onClick={()=>playing?audio.current?.pause():play(selected)}>
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
