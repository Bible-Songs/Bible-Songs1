import edwardsCues from './edwards-cues.json';
import excellencyCues from './excellency-cues.json';
import christCrucifiedCues from './christ-crucified-cues.json';
import prayerCureCues from './prayer-the-cure-for-care-cues.json';
import paydayCues from './payday-cues.json';
import freeGraceCues from './free-grace-cues.json';
import wayOfSalvationCues from './way-of-salvation-cues.json';
import downloadSizes from './library-download-sizes.json';
import {useEffect,useMemo,useRef,useState} from 'react';
import {Pause,Play,Volume2} from 'lucide-react';
import compelCues from './compel-cues.json';
import immutabilityCues from './immutability-cues.json';
import PublishedReading from './PublishedReading';
import PrayerAnimation from './PrayerAnimation';
import JewelsAnimation from './JewelsAnimation';
import ExcellencyAnimation from './ExcellencyAnimation';
import type {ComponentType,RefObject} from 'react';
import sermonCues from './gods-jewels-cues.json';
import PlaybackSpeed from './PlaybackSpeed';
import {mediaUrl} from './mediaUrl';
import {APP_VERSION} from './version';

const readings=[
 {title:'God’s Jewels',author:'C. H. Spurgeon',filename:'gods-jewels-spurgeon.m4a',cues:sermonCues},
 {title:'The Immutability of God',author:'C. H. Spurgeon',filename:'immutability-of-god-spurgeon.m4a',cues:immutabilityCues},
 {title:'Compel Them to Come In',author:'C. H. Spurgeon',filename:'compel-them-to-come-in-spurgeon.m4a',cues:compelCues},
 {title:'Payday Someday',author:'R. G. Lee',filename:'payday-someday-rg-lee.m4a',cues:paydayCues},
 {title:'Sinners in the Hands of an Angry God',author:'Jonathan Edwards',filename:'sinners-in-the-hands-of-an-angry-god-edwards.m4a',cues:edwardsCues},
 {title:'The Excellency of Christ',author:'Jonathan Edwards',filename:'excellency-of-christ-edwards.m4a',cues:excellencyCues},
 {title:'Christ Crucified',author:'C. H. Spurgeon',filename:'christ-crucified-spurgeon.m4a',cues:christCrucifiedCues},
 {title:'Prayer, the Cure for Care',author:'C. H. Spurgeon',filename:'prayer-the-cure-for-care-spurgeon.m4a',cues:prayerCureCues},
 {title:'Free Grace',author:'John Wesley',filename:'free-grace-wesley.m4a',cues:freeGraceCues},
 {title:'The Way of Salvation',author:'C. H. Spurgeon',filename:'way-of-salvation-spurgeon.m4a',cues:wayOfSalvationCues},
] as const;
export const libraryTitles=readings.map(({title,filename})=>({title,filename}));
type AnimationProps={audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean};
// Sermons with an optional Canvas animation (drawn by the browser from the audio clock and cue timings).
const animations:ReadonlyMap<string,ComponentType<AnimationProps>>=new Map([
 ['gods-jewels-spurgeon.m4a',JewelsAnimation],
 ['prayer-the-cure-for-care-spurgeon.m4a',PrayerAnimation],
 ['excellency-of-christ-edwards.m4a',ExcellencyAnimation],
]);
const source=(filename:string)=>mediaUrl(`library/${filename}`);
type ReadingFile=(typeof readings)[number]['filename'];
// The .m4a filename is each sermon's id; a sermon whose size entry has no M4A plays its MP3.
const playback=(filename:ReadingFile)=>source('M4A' in downloadSizes[filename]?filename:filename.replace(/\.m4a$/,'.mp3'));
function readingDownloads(filename:ReadingFile){
 const sizes=downloadSizes[filename];
 const formatDownload=(format:'MP3'|'M4A'|'PDF'|'Word'|'MP4',bytes:number)=>{
  const name=filename.replace(/\.m4a$/,'.'+(format==='Word'?'docx':format.toLowerCase()));
  const size=bytes<1_000_000?`${(bytes/1_000).toFixed(1)} KB`:`${(bytes/1_000_000).toFixed(1)} MB`;
  return {format,name,url:source(name),size};
 };
 const downloads=[formatDownload('MP3',sizes.MP3)];
 if('M4A' in sizes)downloads.push(formatDownload('M4A',sizes.M4A));
 downloads.push(formatDownload('PDF',sizes.PDF),formatDownload('Word',sizes.Word));
 if('MP4' in sizes)downloads.push(formatDownload('MP4',sizes.MP4));
 return downloads;
}
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
 const [sort,setSort]=useState<'Title'|'Author'>('Title');
 const cards=useRef(new Map<string,HTMLDivElement>());
 const [queries,setQueries]=useState({Title:'',Author:'',Transcript:''});
 const [selected,setSelected]=useState<(typeof readings)[number]>(()=>readings.find(reading=>!hiddenReadings.includes(reading.filename))??readings[0]);
 const [time,setTime]=useState(0),[duration,setDuration]=useState(0),[playing,setPlaying]=useState(false);
 const [volume,setVolume]=useState(.75),[message,setMessage]=useState('');
 const [watching,setWatching]=useState(false);
 const audio=useRef<HTMLAudioElement>(null);
 const selectedHidden=hiddenReadings.includes(selected.filename);
 useEffect(()=>{
  if(!selectedHidden)return;
  const player=audio.current;
  player?.pause();
  const replacement=readings.find(reading=>!hiddenReadings.includes(reading.filename));
  if(!replacement||!player)return;
  player.src=playback(replacement.filename);
  setSelected(replacement);setDuration(0);setTime(0);
 },[selectedHidden,hiddenReadings]);
 const initialSource=useRef(playback(selected.filename));
 useEffect(()=>{
  if(audio.current){audio.current.playbackRate=speed;audio.current.volume=volume;}
 },[speed,volume]);
 function play(reading:typeof selected,start?:number){
  const player=audio.current;
  if(!player)return;
  if(reading!==selected){
   player.src=playback(reading.filename);
   setSelected(reading);setDuration(0);
  }
  if(!animations.has(reading.filename))setWatching(false);
  if(start!==undefined){player.currentTime=start;setTime(start);}
  player.playbackRate=speed;
  void player.play().then(()=>setMessage('')).catch(error=>{
   if(error?.name!=='AbortError')setMessage('The audio could not start. Please try again.');
  });
 }
 function jump(reading:typeof selected){
  const card=cards.current.get(reading.filename);
  card?.scrollIntoView({block:'start',behavior:'smooth'});
  card?.focus({preventScroll:true});
 }
 function remove(reading:typeof selected){
  if(window.confirm(`Remove ${reading.title} from your library? You can restore it in Recovery centre.`))onRemove(reading.filename);
 }
 function watch(reading:typeof selected){
  setWatching(true);
  if(reading!==selected||audio.current?.ended)play(reading,0);
  else if(!playing)play(reading);
 }
 const filtered=useMemo(()=>{
  const terms=searchFields.map(field=>[field,normalize(queries[field])] as const);
  return searchIndex.filter(entry=>!hiddenReadings.includes(entry.reading.filename)&&terms.every(([field,term])=>entry[field].includes(term))).map(entry=>entry.reading);
 },[queries,hiddenReadings]);
 const sorted=[...filtered].sort((a,b)=>(sort==='Author'?a.author.localeCompare(b.author):0)||a.title.localeCompare(b.title));
 return <div className="content document-library">
  <div className="page-heading"><h1>Listening Library</h1></div>
  <section className="listen-panel document-workspace">
   <div className="section-heading"><div><h2>Published readings</h2></div></div>
   <div className="library-search" role="group" aria-label="Search Listening Library">
    {searchFields.map(field=><label key={field}>{field}<input type="search" value={queries[field]}
     onChange={event=>setQueries({...queries,[field]:event.target.value})} placeholder={`Search ${field.toLowerCase()}`}/></label>)}
   </div>
   <div className="library-table-toolbar"><label>Sort by <select value={sort} onChange={event=>setSort(event.target.value==='Author'?'Author':'Title')}><option value="Title">Title — A to Z</option><option value="Author">Author — A to Z</option></select></label><span>{filtered.length} readings</span></div>
   <div className="library-table-scroll" role="region" aria-label="Listening Library table" tabIndex={0}>
    <table className="library-table"><caption>Published readings — quick actions</caption><thead><tr>{['Delete','Title','Author','Audio Play','Watch with Animation','Download MP3','Download PDF'].map(heading=><th key={heading} scope="col">{heading}</th>)}</tr></thead>
     <tbody>{sorted.map(reading=><tr key={reading.filename}>
      <td><button className="library-remove" onClick={()=>remove(reading)} aria-label={`Remove ${reading.title} from table`}>×</button></td>
      <th scope="row"><button className="library-title-link" onClick={()=>jump(reading)}>{reading.title}</button></th>
      <td>{reading.author}</td>
      <td><button onClick={()=>{jump(reading);if(reading===selected&&playing)audio.current?.pause();else play(reading);}} aria-label={`${reading===selected&&playing?'Pause':'Play'} audio for ${reading.title}`}>{reading===selected&&playing?'Pause':'Play'}</button></td>
      <td>{animations.has(reading.filename)?<button onClick={()=>{watch(reading);jump(reading);}} aria-label={`Watch animation for ${reading.title}`}>Watch</button>:<span aria-label="Animation not available">—</span>}</td>
      {(['MP3','PDF'] as const).map(format=>{const file=readingDownloads(reading.filename).find(item=>item.format===format);return <td key={format}>{file&&<a href={file.url} download={file.name} onClick={()=>jump(reading)} aria-label={`Download ${format} for ${reading.title}`}>{format}</a>}</td>;})}
     </tr>)}</tbody>
    </table>
   </div>
   {filtered.length?filtered.map(reading=><div key={reading.filename} className="library-reading-target" tabIndex={-1} ref={element=>{if(element)cards.current.set(reading.filename,element);else cards.current.delete(reading.filename);}}><PublishedReading key={reading.filename} title={reading.title} author={reading.author}
    onRemove={()=>remove(reading)}
    downloads={readingDownloads(reading.filename)}
    cues={reading.cues}
    followAnimation={watching&&reading===selected&&animations.has(reading.filename)}
    speed={speed} onSpeed={onSpeed} playing={reading===selected&&playing}
    onToggle={()=>reading===selected&&playing?audio.current?.pause():play(reading)} time={reading===selected?time:null} onPlay={start=>play(reading,start)}>
    {animations.has(reading.filename)&&<>
     <button className="document-upload prayer-animation-control" type="button"
      aria-expanded={watching&&reading===selected} onClick={()=>{
       if(watching&&reading===selected){setWatching(false);return;}
       watch(reading);
      }}>{watching&&reading===selected?'Hide animation':'Watch with animation'}</button>
     {watching&&reading===selected&&(()=>{const Animation=animations.get(reading.filename);return Animation?<Animation audio={audio} time={time} playing={playing}/>:null;})()}
    </>}
   </PublishedReading></div>):<p>{readings.every(reading=>hiddenReadings.includes(reading.filename))?'Your library is empty. Restore a reading in Recovery centre.':'No readings match your search.'}</p>}
  </section>
  <footer>© {new Date().getFullYear()} Bible Songs · Version {APP_VERSION} · <a href="https://github.com/hexgrad/kokoro">Kokoro speech profiles</a></footer>
  <audio ref={audio} preload="metadata" src={initialSource.current}
   onLoadedMetadata={event=>{const player=event.currentTarget;setDuration(player.duration);player.playbackRate=speed;}}
   onTimeUpdate={event=>setTime(event.currentTarget.currentTime)}
   onPlaying={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)}/>
  {message&&<p role="status">{message}</p>}
  <div className="player original-player">
   <div className="now-playing"><div><strong>{selected.title}</strong><span>{selected.author}</span></div><span className="player-version">Version {APP_VERSION}</span></div>
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
