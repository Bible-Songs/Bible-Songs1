import {APP_VERSION} from './version';
import {useEffect,useRef,useState} from 'react';
import {Music2,Compass,Heart,BookOpen,Search,Play,Pause,Volume2,Repeat,ArrowUpRight,Headphones,Download} from 'lucide-react';
import song from '../public/originals/genesis-1/song.json';
import scripture from '../public/originals/genesis-1/scripture.json';
import listening from '../public/originals/genesis-1/listening.json';
type SentenceCue={offset:number;start:number};
type Segment={key:string;verse?:number;section?:string;text?:string;start:number;end:number;sentenceCues?:SentenceCue[]};
type ReadingTrack={voiceId:string;content:string;mode:string;audio:string;duration:number;segments:Segment[];creation:string};
type Chapter={number:number;chapter:string;source:string;verses:{verse:number;text:string}[];recordings:ReadingTrack[]};
const listeningTracks=listening.recordings as ReadingTrack[];
const chapters:Chapter[]=[
 {number:1,...scripture,recordings:listeningTracks},
 ...Object.values(import.meta.glob<Chapter>('../public/readings/genesis-*/chapter.json',{eager:true,import:'default'})),
].sort((a,b)=>a.number-b.number);
const base=import.meta.env.BASE_URL;
const mediaUrl=(path:string)=>`${base}${path}?v=${APP_VERSION}`;
const photo=base+'lake.jpg';
const fmt=(n:number)=>`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`;
export default function Home({user,onSignOut,signingOut=false}:{user:{id:string;email?:string};onSignOut?:()=>Promise<void>;signingOut?:boolean}){
 const key=`bible-songs:original-favorites:${user.id}`;
 const [tab,setTab]=useState('Discover'),[query,setQuery]=useState(''),[liked,setLiked]=useState(false),[playing,setPlaying]=useState(false),[time,setTime]=useState(0),[duration,setDuration]=useState(song.duration),[volume,setVolume]=useState(.75),[repeat,setRepeat]=useState(false),[message,setMessage]=useState(''),[content,setContent]=useState<'bible'|'lyrics'>('bible'),[mode,setMode]=useState<'reading'|'singing'>('reading'),[recording,setRecording]=useState('classic');
 const [chapter,setChapter]=useState(chapters[0]);
 const isReading=mode==='reading',isBible=content==='bible';
 const hasMusic=!isBible||chapter.number===1;
 const tracks=isBible?chapter.recordings:listeningTracks;
 const getTrack=(voiceId:string)=>tracks.find(t=>t.voiceId===voiceId&&t.content===content&&t.mode===mode);
 const availableRecordings=song.recordings.filter(r=>!isBible&&!isReading||r.id!=='instrumental'&&getTrack(r.id));
 const selectedRecording=availableRecordings.find(r=>r.id===recording)||availableRecordings[0]||song.recordings[0];
 const selectedEntry=getTrack(selectedRecording.id);
 const trackAudio=(voice:typeof selectedRecording)=>!isBible&&!isReading?voice.audio:getTrack(voice.id)?.audio||'';
 const selectedAudio=trackAudio(selectedRecording);
 const trackTitle=isBible?chapter.chapter:song.title;
 const cueTime=time+.001;
 const currentSegment=selectedEntry?.segments.find(s=>cueTime>=s.start&&cueTime<s.end);
 const vocal=selectedRecording.id!=='instrumental';
 const audio=useRef<HTMLAudioElement>(null),chapterControls=useRef<HTMLElement>(null);
 useEffect(()=>{try{setLiked(localStorage.getItem(key)==='true');const saved=localStorage.getItem(key+':voice');if(song.recordings.some(r=>r.id===saved))setRecording(saved!)}catch{}},[key]);
 useEffect(()=>{if(audio.current)audio.current.volume=volume},[volume]);
 useEffect(()=>{setTime(0);setPlaying(false);setDuration(selectedEntry?.duration||song.duration);audio.current?.pause();audio.current?.load();try{localStorage.setItem(key+':voice',selectedRecording.id)}catch{}},[selectedAudio,key]);
 async function play(track:HTMLAudioElement){
  try{await track.play();setMessage('')}catch(error){
   if(!(error instanceof DOMException&&error.name==='AbortError'))setMessage('The audio could not start. Please try again.');
  }
 }
 function toggle(){const track=audio.current;if(track){if(playing)track.pause();else void play(track);}}
 function playFrom(start:number){
  const track=audio.current;
  if(!track)return;
  track.currentTime=start;
  setTime(start);
  void play(track);
 }
 function favorite(){const next=!liked;setLiked(next);try{localStorage.setItem(key,String(next))}catch{setMessage('Favorites could not be saved on this browser.')}}
 function read(){setContent('bible');setMode('reading');setTab('Discover');setQuery('');requestAnimationFrame(()=>chapterControls.current?.scrollIntoView({behavior:'smooth',block:'start'}))}
 function chooseChapter(number:number){
  const next=chapters.find(item=>item.number===number);
  if(!next)return;
  setChapter(next);
  if(next.number!==1)setMode('reading');
 }
 function chooseBible(){
  setContent('bible');
  if(chapter.number!==1)setMode('reading');
 }
 function search(value:string){
  setQuery(value);
  setTab('Song library');
  const match=chapters.find(item=>item.chapter.toLowerCase()===value.trim().toLowerCase());
  if(match){setContent('bible');chooseChapter(match.number);}
 }
 const visible=(tab!=='My favorites'||liked)&&[...chapters.map(item=>item.chapter),song.title].some(title=>title.toLowerCase().includes(query.trim().toLowerCase()));
 const currentSection=isBible?undefined:mode==='singing'?song.sections.find(s=>time>=s.start&&time<s.end):currentSegment?song.sections[Number(currentSegment.key.split('-')[0])]:undefined;
 return <div className="shell original-library"><aside className="sidebar"><a className="brand" href={base}><span className="brand-icon"><Music2 size={25}/></span>Bible Songs</a><div className="tagline">SCRIPTURE. SET TO MUSIC.</div><nav>{[{name:'Discover',Icon:Compass},{name:'Song library',Icon:BookOpen},{name:'My favorites',Icon:Heart}].map(({name,Icon})=><button className={tab===name?'active':''} onClick={()=>{setTab(name);setQuery('')}} key={name}><Icon size={19}/>{name}</button>)}</nav><div className="side-label">BIBLE READINGS</div><button className="daily" onClick={read}><BookOpen size={20}/><span>Genesis 1–{chapters.at(-1)?.number}<small>Choose a chapter</small></span></button><div className="side-bottom"><div className="verse-mark">“</div><p>In the beginning<br/>God created the heavens<br/>and the earth.</p><span>GENESIS 1:1 · BSB</span><div className="side-foot">Original music, rooted in Scripture.<br/>A new library, beginning with Genesis.</div></div></aside>
 <main><header><div className="breadcrumb">Your daily rhythm of faith</div><div className="header-actions"><label className="search"><Search size={17}/><input placeholder="Search chapters and songs" value={query} onChange={e=>search(e.target.value)}/></label><div className="account-menu">{user.email&&<><span className="account-email" title={user.email}>{user.email}</span><span className="avatar">{user.email[0].toUpperCase()}</span></>}{onSignOut&&<button className="signout-button" disabled={signingOut} onClick={onSignOut}>{signingOut?'Signing out…':'Sign out'}</button>}</div></div></header>
 <div className="content"><div className="page-heading"><div><div className="eyebrow"><span/> BIBLE SONGS ORIGINALS</div><h1>{tab==='My favorites'?'Keep the music close.':tab==='Song library'?'Our original song library.':'A new beginning, in song.'}</h1><p>Hear Genesis 1–{chapters.at(-1)?.number}, then explore the original musical setting of Genesis 1.</p></div><span className="edition">ORIGINAL COLLECTION <Music2 size={15}/></span></div>
 {visible?<><section className="hero" style={{backgroundImage:`linear-gradient(90deg,rgba(15,37,31,.79),rgba(15,37,31,.08)),url(${photo})`}}><div className="hero-content"><span className="hero-label"><span/> {isBible?chapter.chapter.toUpperCase():'GENESIS 1'} · {isBible?'BEREAN STANDARD BIBLE':'ORIGINAL SONG LYRICS'}</span><h2>{isBible?(chapter.number===1?<>The story<br/>of creation.</>:chapter.chapter):<>Let There<br/>Be Light.</>}</h2><p>{vocal?selectedRecording.name:'Instrumental only'} <span>·</span> {isReading?'Spoken reading':'Musical setting · C major · 84 BPM'}</p><button className="cream-button" onClick={toggle}>{playing?<Pause size={17}/>:<Play size={17} fill="currentColor"/>}{playing?'Pause':isReading?'Play reading':vocal?'Play singing':'Play instrumental'}</button></div><div className="hero-caption">{isBible?`${chapter.chapter.toUpperCase()} · COMPLETE CHAPTER`:'OUR ORIGINAL ADAPTATION'}</div></section>
 <section className="original-status"><Music2 size={22}/><div><strong>Choose the voice for your listening moment</strong><p>{isBible?`Hear the complete ${chapter.chapter} chapter in the Berean Standard Bible. ${hasMusic?'Choose reading or singing.':'Choose one of five reading voices.'}`:'These original song lyrics adapt Genesis 1; they are not the complete chapter word for word.'} All voices are synthetic and made with free local tools.</p></div><button className={liked?'liked':''} onClick={favorite} aria-label={liked?'Remove favorite':'Save favorite'}><Heart size={21} fill={liked?'currentColor':'none'}/></button></section>
 <section className="listen-panel vocal-choice-panel" ref={chapterControls}><div className="section-heading"><div><h2>Your choice of vocal</h2><p>Select the words, choose reading or singing, then choose a voice.</p></div><div className="listening-controls">
  {isBible&&<label className="chapter-picker">Chapter
   <select value={chapter.number} onChange={event=>{setQuery('');chooseChapter(Number(event.target.value));}}>
    {chapters.map(item=><option key={item.number} value={item.number}>{item.chapter}</option>)}
   </select>
  </label>}
  <div className="listening-toggle content-toggle" role="group" aria-label="Choose text"><button type="button" aria-pressed={isBible} onClick={chooseBible}>Bible (Berean Standard Bible)</button><button type="button" aria-pressed={!isBible} onClick={()=>setContent('lyrics')}>Song lyrics</button></div><div className="listening-toggle" role="group" aria-label="Choose reading or singing"><button type="button" aria-pressed={isReading} onClick={()=>setMode('reading')}>Reading</button><button type="button" aria-pressed={!isReading} disabled={!hasMusic} onClick={()=>setMode('singing')}>Singing</button></div>{!hasMusic&&<small className="chapter-mode-note">Singing is available for Genesis 1.</small>}</div></div><fieldset className="voice-choices"><legend className="visually-hidden">Choose a vocal or instrumental recording</legend>{availableRecordings.map(option=><label className={'voice-option '+(recording===option.id?'chosen':'')} key={option.id}><div className="voice-option-heading"><input type="radio" name="recording" value={option.id} checked={selectedRecording.id===option.id} onChange={()=>setRecording(option.id)}/><strong>{option.name}</strong><span>{option.badge}</span></div><p>{isReading?'Hear '+option.name.replace(/^Voice [0-9]+ · /,'')+' as a spoken reading, without music.':isBible?'Hear the complete Bible chapter set to an original melody in this synthetic voice.':option.description}</p></label>)}</fieldset><details className="voice-creation-notes"><summary>How each voice was created</summary>{song.recordings.filter(r=>r.id!=='instrumental').map(option=><article key={option.id}><h3>{option.name}</h3><p>{!isBible&&!isReading?option.creation:getTrack(option.id)?.creation||option.creation}</p></article>)}<p className="voice-note">These are original synthetic options, not celebrity sound-alikes or artist-endorsed recordings. The neural voices are experimental and may still sound artificial.</p></details></section>
 <section className="listen-panel original-reader">
  <div className="section-heading"><div>
   <h2>{isBible?`${chapter.chapter} — Berean Standard Bible`:'The song lyrics'}</h2>
   <p>{isBible?`Complete chapter · verses 1–${chapter.verses.length} · public-domain text`:'An original adaptation of Genesis 1'}</p>
  </div><Headphones size={23}/></div>
  {isBible?<><p className="reader-note">Tap or click a sentence to play from there.</p>
   <div className="scripture-text">{chapter.verses.map(verse=>{
    const segment=selectedEntry?.segments.find(item=>item.verse===verse.verse);
    const cues=segment?[{offset:0,start:segment.start},...(segment.sentenceCues??[])]:[];
    return <p key={verse.verse}><sup>{verse.verse}</sup>{cues.length?cues.map((cue,index)=>{
     const next=cues[index+1];
     const active=segment===currentSegment&&cueTime>=cue.start&&(!next||cueTime<next.start);
     return <span key={cue.offset}><button type="button" className="text-cue" aria-current={active?'true':undefined}
      onClick={()=>playFrom(cue.start)}>{verse.text.slice(cue.offset,next?.offset).trimEnd()}</button>{next?' ':null}</span>;
    }):verse.text}</p>;
   })}</div>
   <a className="source-link" href={chapter.source} target="_blank" rel="noreferrer">View the Scripture source <ArrowUpRight size={14}/></a>
  </>:<><p className="reader-note">Tap or click a lyric line to play from there. These lyrics are an original adaptation of Genesis 1.</p>
   <div className="lyric-sections">{song.sections.map((section,index)=>section.lines.length>0&&
    <article key={index} className={playing&&currentSection===section?'current-section':''}>
     <span>{section.label}</span><small>{section.reference}</small>
     <p>{section.lines.map((line,lineIndex)=>{
      const segment=selectedEntry?.segments.find(item=>item.key===`${index}-${lineIndex}`);
      const lineDuration=(section.end-section.start)/section.lines.length;
      const start=isReading?segment?.start:section.start+lineIndex*lineDuration;
      const end=isReading?segment?.end:section.start+(lineIndex+1)*lineDuration;
      const active=start!==undefined&&end!==undefined&&cueTime>=start&&cueTime<end;
      return <span key={lineIndex}>{start===undefined?line:<button type="button" className="text-cue"
       aria-current={active?'true':undefined} onClick={()=>playFrom(start)}>{line}</button>}<br/></span>;
     })}</p>
    </article>
   )}</div>
  </>}
 </section><section className="listen-panel"><div className="section-heading"><div><h2>{isBible?'About this chapter':'From composition to song'}</h2><p>{isBible?'The complete Berean Standard Bible text, in your chosen voice.':'The starting point for our own recording.'}</p></div></div><div className="production-grid"><div><span className="step-number">01</span><h3>{isBible?'Public-domain Scripture':'Words & melody'}</h3><p>{isBible?`${chapter.chapter}, verses 1–${chapter.verses.length}, using the complete Berean Standard Bible text.`:'Original adapted lyrics and melody prepared, with Genesis 1 as the source.'}</p></div><div><span className="step-number">02</span><h3>{hasMusic?'Instrumental demo':'Sentence navigation'}</h3><p>{hasMusic?'A synthesized melody and accompaniment, created here without external recordings or samples.':'Select any sentence to play from that point and continue through the chapter.'}</p></div><div><span className="step-number">03</span><h3>Choose a vocal</h3><p>{hasMusic?'Try the different synthetic vocal styles, each fitted to the original melody with free local processing.':'Listen to the complete chapter in any of the five synthetic reading voices.'} Read how each was created above.</p></div></div><div className="original-downloads">{availableRecordings.filter(r=>r.id!=='instrumental').map(r=><a key={r.id} href={mediaUrl(trackAudio(r))} download><Download size={15}/>{r.name} · {isReading?'reading':'singing'}</a>)}{hasMusic&&<><a href={mediaUrl(song.audio)} download><Download size={15}/>Instrumental WAV</a><a href={base+song.midi} download><Download size={15}/>Editable MIDI</a><a href={base+song.lyrics} download><Download size={15}/>Song lyrics</a></>}</div></section><div className="original-rights"><strong>Source & credits</strong><p>Scripture reference: <a href="https://berean.bible/terms.htm" target="_blank" rel="noreferrer">Berean Standard Bible (BSB) (public domain)</a>. {isBible?'This recording uses the complete Berean Standard Bible chapter.':'Song lyrics are an original adaptation, not a verbatim Bible translation.'} New melody, arrangement and free local synthetic vocal prepared for Bible Songs. No third-party song recordings or paid generation services are used. The current voices use pretrained Kokoro speech profiles.</p><p>Earlier Voice 3 and Voice 4 composite speech sources: <a href="https://www.openslr.org/141/" target="_blank" rel="noreferrer">LibriTTS-R (Koizumi et al., 2023)</a> and <a href="https://doi.org/10.7488/ds/2645" target="_blank" rel="noreferrer">VCTK (Yamagishi, Veaux &amp; MacDonald, 2019)</a>, both <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Changes include subset selection, local speech-model or speaker-profile adaptation, and synthetic singing processing. <a href={base+'originals/genesis-1/listening-credits.md'} target="_blank" rel="noreferrer">Reading and singing credits</a>. {song.recordings.filter(r=>r.credits).map(r=><span key={r.id}><a href={base+r.credits} target="_blank" rel="noreferrer">{r.name} credits</a>. </span>)}</p></div></>:<section className="listen-panel"><h2>{tab==='My favorites'?'No original favorites yet.':'No matching original songs.'}</h2><p>{tab==='My favorites'?'Save “Let There Be Light” using the heart beside the demo.':'Try “Genesis” or “Light”.'}</p><button className="cream-button" onClick={()=>{setTab('Discover');setQuery('')}}>Explore Genesis 1</button></section>}
 <footer><span>Slow down. Listen deeply. Carry the Word with you.</span><span>Bible Songs <Music2 size={14}/></span></footer><p className="copyright-notice app-copyright">© 2026 Bible Songs. Public-domain Scripture is excluded from this copyright notice. Third-party assets belong to their respective owners.<span className="app-version">Version {APP_VERSION}</span></p></div></main>
 <audio ref={audio} src={selectedAudio?mediaUrl(selectedAudio):undefined} preload="metadata" loop={repeat} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onLoadedMetadata={()=>setDuration(audio.current?.duration||selectedEntry?.duration||song.duration)} onTimeUpdate={()=>setTime(audio.current?.currentTime||0)} onError={()=>setMessage('The audio could not load. Please refresh and try again.')}/>
 <div className="player original-player"><div className="now-playing"><img src={photo} alt="Peaceful mountain lake"/><div><strong>{trackTitle}</strong><span>{isBible?'Berean Standard Bible':'Original lyrics'} · {isReading?'Reading':'Singing'} · {vocal?selectedRecording.name:'Instrumental'}</span></div><div className="favorite-version"><button className={liked?'liked':''} aria-label={liked?'Remove original favorite':'Save original favorite'} onClick={favorite}><Heart size={19} fill={liked?'currentColor':'none'}/></button><span className="player-version">Version {APP_VERSION}</span></div></div><div className="player-center"><div className="transport"><button className="original-repeat" aria-label="Repeat audio" aria-pressed={repeat} onClick={()=>setRepeat(!repeat)}><Repeat size={16} className={repeat?'selected':''}/></button><button className="main-play" aria-label={playing?'Pause audio':'Play audio'} onClick={toggle}>{playing?<Pause size={20} fill="currentColor"/>:<Play size={20} fill="currentColor"/>}</button><span className="original-format">{isReading?'READING':'SINGING'}</span></div><div className="progress"><span>{fmt(time)}</span><input aria-label="Seek original audio" type="range" min="0" max={duration} step=".1" value={time} onChange={e=>{if(audio.current)audio.current.currentTime=+e.target.value}}/><span>{fmt(duration)}</span></div></div><div className="player-right"><Volume2 size={18}/><input aria-label="Volume" type="range" min="0" max="1" step=".01" value={volume} onChange={e=>setVolume(+e.target.value)}/><span className="quality">ORIGINAL</span></div></div>
 {message&&<div className="toast" role="status">{message}<button aria-label="Dismiss" onClick={()=>setMessage('')}>×</button></div>}</div>
}
