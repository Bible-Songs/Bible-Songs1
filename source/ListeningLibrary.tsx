import {savedAudio,type SavedAudio} from './listening-audio';
import {documentDrama,speakerLine} from './document-drama';
import {useEffect,useMemo,useRef,useState} from 'react';
import {APP_VERSION} from './version';
import {nextReadingVoice} from './reading-cues';

type Voice={id:string;name:string};
type Entry={id:string;name:string;text:string;source:string;saved:string;rendered?:boolean;renderSeconds?:number};
type KokoroVoice=keyof import('kokoro-js').KokoroTTS['voices'];
const profiles:Record<string,KokoroVoice>={classic:'am_michael',warm:'af_heart',voice3:'am_fenrir',composite:'am_onyx',voice5:'af_bella',voice6:'af_nicole',voice7:'am_puck',voice8:'af_sarah',voice9:'am_adam',voice10:'af_nova'};
const defaultName=()=>`Listening notes ${new Date().toLocaleDateString('en-CA')}`;
const sentences=(text:string)=>Array.from(new Intl.Segmenter('en',{granularity:'sentence'}).segment(text),item=>item.segment.trim()).filter(Boolean);
let engine:Promise<import('kokoro-js').KokoroTTS>|undefined;
function speechEngine(){
 return engine??=import('kokoro-js').then(({KokoroTTS})=>KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX',{dtype:'q8',device:'wasm'})).catch(error=>{engine=undefined;throw error;});
}
async function extract(file:File){
 if(/\.docx$/i.test(file.name)){
  const {extractRawText}=await import('mammoth');
  return (await extractRawText({arrayBuffer:await file.arrayBuffer()})).value;
 }
 if(/\.pdf$/i.test(file.name)){
  const pdf=await import('pdfjs-dist');
  const worker=await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdf.GlobalWorkerOptions.workerSrc=worker.default;
  const task=pdf.getDocument({data:await file.arrayBuffer()});
  const document=await task.promise;
  try{
   const pages=[];
   for(let number=1;number<=document.numPages;number++){
    const content=await (await document.getPage(number)).getTextContent();
    pages.push(content.items.map(item=>'str' in item?item.str+(item.hasEOL?'\n':' '):'').join(''));
   }
   return pages.join('\n\n');
  }finally{await task.destroy();}
 }
 return file.text();
}

export default function ListeningLibrary({userId,voices}:{userId:string;voices:Voice[]}){
 const key=`bible-songs:listening-library:${userId}`;
 const [history,setHistory]=useState<Entry[]>(()=>{try{return JSON.parse(localStorage.getItem(key)??'[]');}catch{return [];}});
 const [name,setName]=useState(defaultName),[text,setText]=useState(''),[source,setSource]=useState('Pasted text');
 const [id,setId]=useState<string>(),[filter,setFilter]=useState(''),[status,setStatus]=useState('');
 const [pool,setPool]=useState(['classic']),[order,setOrder]=useState<'rotating'|'random'|'drama'>('rotating');
 const [active,setActive]=useState(-1),[paused,setPaused]=useState(false),[busy,setBusy]=useState(false);
 const choices=useRef({pool,order});choices.current={pool,order};
 const audio=useRef<HTMLAudioElement>(null),run=useRef(0),cancel=useRef<()=>void>(()=>{});
 const current=useRef<HTMLButtonElement>(null);
 const lines=useMemo(()=>text.split(/\n+/).flatMap(line=>speakerLine.test(line.trim())?[line.trim()]:sentences(line)),[text]);
 const drama=useMemo(()=>documentDrama(lines),[lines]);
 useEffect(()=>{current.current?.scrollIntoView({block:'nearest'});},[active]);
 useEffect(()=>()=>{run.current++;cancel.current();},[]);
 const [rendering,setRendering]=useState<{id:string;sentence:number;total:number}>();
 function stop(){setRendering(undefined);run.current++;cancel.current();audio.current?.pause();setActive(-1);setPaused(false);setBusy(false);}
 function store(rows:Entry[]){
  try{localStorage.setItem(key,JSON.stringify(rows));setHistory(rows);return true;}
  catch{setStatus('Could not save. Browser storage may be full or unavailable.');return false;}
 }
 function save(){
  if(!text.trim()||busy)return;
  const prior=history.find(row=>row.id===id);
  const entry={renderSeconds:prior?.text===text?prior?.renderSeconds:undefined,rendered:prior?.text===text&&prior.rendered,id:id??crypto.randomUUID(),name:name.trim()||defaultName(),text,source,saved:new Date().toISOString()};
  if(store([entry,...history.filter(row=>row.id!==entry.id)])){setId(entry.id);setName(entry.name);setStatus('Saved in this browser.');if(prior?.rendered&&prior.text!==text)void savedAudio('readwrite',store=>store.delete(key+':'+entry.id)).catch(()=>{});}
 }
 function open(row?:Entry){
  stop();setId(row?.id);setName(row?.name??defaultName());setText(row?.text??'');setSource(row?.source??'Pasted text');setStatus('');
 }
 async function upload(file?:File){
  if(!file)return;
  stop();const ticket=run.current;setStatus(`Extracting ${file.name}…`);
  try{
   const result=(await extract(file)).trim();
   if(ticket!==run.current)return;
   if(!result){setStatus('No selectable text found. For scanned PDFs, paste text from an OCR copy.');return;}
   setName(file.name.replace(/\.[^.]+$/,''));setText(result);setSource(file.name);setId(undefined);setStatus('Text imported. You can edit it before listening or saving.');
  }catch{if(ticket===run.current)setStatus('Could not read this file. Try an unlocked PDF, a .docx file, or plain text.');}
 }
 async function play(start:number,options?:{entry:Entry;render:boolean;started:number}){
  if(!lines[start])return;
  stop();const ticket=run.current;
  if(options?.render)setRendering({id:options.entry.id,sentence:0,total:lines.length});
  setBusy(true);setStatus(options?.render?'Rendering saved audio…':'Preparing audio…');
  try{
   const cacheKey=options&&key+':'+options.entry.id;
   const cached=cacheKey&&!options?.render?await savedAudio('readonly',store=>store.get(cacheKey)) as SavedAudio|undefined:undefined;
   if(options&&!options.render&&cached?.text!==options.entry.text)throw Error('Saved audio missing');
   const model=cached?undefined:await speechEngine();
   const recorded:SavedAudio['chunks']=[];
   let cachedIndex=0;
   function* chunks(){
    let previous='';
    for(let index=start;index<lines.length;index++){
     const {pool,order}=choices.current;
     const voice=nextReadingVoice(pool,previous,order)??pool[0];
     previous=voice;
     const passage=order==='drama'?drama[index]:[{text:lines[index],voice}];
     for(const part of passage){
      const pieces=part.text.match(/.{1,300}(?:\s+|$)|.{1,300}/gu)??[];
      for(const text of pieces){
       yield {index,text,voice:profiles[part.voice],speed:order==='drama'&&part.voice!=='warm'?.9:.95};
      }
     }
    }
   }
   const queue=chunks();
   async function prepare(){
    if(ticket!==run.current)return;
    if(cached)return cached.chunks[cachedIndex++];
    const next=queue.next();
    if(next.done||ticket!==run.current)return;
    const {index,text,voice,speed}=next.value;
    try{return {index,blob:(await model!.generate(text,{voice,speed})).toBlob()};}
    catch(error){return {error};}
   }
   let pending=prepare();
   while(ticket===run.current){
    const prepared=await pending;
    if(!prepared||ticket!==run.current)break;
    if('error' in prepared)throw prepared.error;
    const {index,blob}=prepared;
    if(options?.render){
     recorded.push({index,blob});
     setRendering({id:options.entry.id,sentence:index+1,total:lines.length});
     setStatus(`Rendering sentence ${index+1} of ${lines.length}…`);
     pending=prepare();
     continue;
    }
    setActive(index);
    const player=audio.current;
    if(!player)return;
    const url=URL.createObjectURL(blob);
    try{
     await new Promise<void>((resolve,reject)=>{
      cancel.current=resolve;
      player.onended=()=>resolve();
      player.onerror=()=>reject(new Error('Audio playback failed'));
      player.src=url;
      player.play().then(()=>{
       if(ticket!==run.current)return;
       setBusy(false);setStatus('');
       pending=prepare();
      }).catch(reject);
     });
    }finally{URL.revokeObjectURL(url);if(ticket===run.current){player.onended=null;player.onerror=null;}}
   }
   if(ticket===run.current&&options?.render&&cacheKey){
    await savedAudio('readwrite',store=>store.put({text:options.entry.text,chunks:recorded},cacheKey));
    if(ticket!==run.current)return;
    const renderSeconds=Math.max(1,Math.round((performance.now()-options.started)/1000));
    const saved=store(history.map(row=>row.id===options.entry.id?{...row,rendered:true,renderSeconds}:row));
    stop();if(saved)setStatus('Rendered audio saved in this browser.');
   }else if(ticket===run.current){stop();setStatus('Finished reading.');}
  }catch{if(ticket===run.current){stop();setStatus('Could not prepare audio. Check available browser storage and try again.');}}
 }
 function download(row:Entry){
  const url=URL.createObjectURL(new Blob([row.text],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=`${row.name}.txt`;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 const [requested,setRequested]=useState<{entry:Entry;render:boolean;started:number}>();
 useEffect(()=>{
  if(requested&&requested.entry.text===text){
   setRequested(undefined);
   void play(0,requested);
  }
 },[requested,text]);
 function historyAudio(entry:Entry,render:boolean){
  open(entry);
  if(render)setRendering({id:entry.id,sentence:0,total:0});
  setRequested({entry,render,started:performance.now()});
 }
 const rows=history.filter(row=>`${row.name} ${row.source}`.toLowerCase().includes(filter.toLowerCase()));
 return <div className="content document-library">
  <div className="page-heading"><div><h1>Listening Library</h1><p>Listen to a document or any text you paste.</p></div></div>
  <section className="listen-panel document-workspace">
   <h2>Reading workspace</h2>
   <div className="document-actions">
    {[['PDF','.pdf'],['Word','.docx'],['text file','.txt,.md,.csv,.log']].map(([label,accept])=><label className="document-upload" key={label}>Upload {label}<input type="file" accept={accept} aria-label={`Upload ${label}`} onChange={event=>{void upload(event.currentTarget.files?.[0]);event.currentTarget.value='';}}/></label>)}
    <button onClick={()=>open()}>New reading</button>
   </div>
   <label>Storage filename<input value={name} onChange={event=>setName(event.target.value)}/></label>
   <label>Paste or edit text<textarea rows={10} value={text} placeholder="Paste text here or upload a file." onChange={event=>{stop();setText(event.target.value);}}/></label>
   <p className="document-note">Speech is generated on this device. Saved text and filenames stay in this browser.</p>
   <button disabled={!text.trim()||busy} onClick={save}>Save to history</button>
  </section>
  <section className="listen-panel document-workspace">
   <div className="section-heading"><div><h2>Your choice of vocal</h2><p>Reading · Kokoro speech profiles</p></div></div>
   <div className="listening-toggle" role="group" aria-label="Voice order"><button aria-pressed={order==='rotating'} onClick={()=>setOrder('rotating')}>Rotating voices</button><button aria-pressed={order==='random'} onClick={()=>setOrder('random')}>Random voices</button><button aria-pressed={order==='drama'} onClick={()=>setOrder('drama')}>Drama</button></div>
   {order==='drama'&&<p>Drama casts narration and recognizable dialogue automatically. For scripts, start a line with a speaker label such as “Mary:”.</p>}
   <button disabled={order==='drama'} aria-pressed={pool.length===voices.length} onClick={()=>setPool(voices.map(voice=>voice.id))}>All voices</button>
   <fieldset className="document-voices" disabled={order==='drama'}><legend>Choose reading voices</legend>{voices.map(voice=><label key={voice.id}><input type="checkbox" checked={pool.includes(voice.id)} onChange={()=>setPool(current=>current.includes(voice.id)?current.length>1?current.filter(id=>id!==voice.id):current:[...current,voice.id])}/>{voice.name}</label>)}</fieldset>
   <div className="document-actions">
    <button disabled={!lines.length||busy} onClick={()=>active<0?void play(0):paused?void audio.current?.play().then(()=>setPaused(false)).catch(()=>setStatus('Playback could not resume.')):(audio.current?.pause(),setPaused(true))}>{active<0?'Read aloud':paused?'Resume':'Pause'}</button>
    <button disabled={active<0&&!busy} onClick={stop}>Stop</button>
    <label>Volume <input type="range" min="0" max="1" step=".05" defaultValue="1" onChange={event=>{if(audio.current)audio.current.volume=Number(event.target.value);}}/></label>
   </div>
   <p role="status">{status}</p>
   <audio ref={audio}/>
   {!!lines.length&&<div className="document-preview" aria-label="Reading preview">{lines.map((line,index)=><button ref={active===index?current:undefined} aria-current={active===index?'true':undefined} onClick={()=>void play(index)} key={index}>{line}</button>)}</div>}
  </section>
  <section className="listen-panel document-workspace">
   <div className="section-heading"><div><h2>Listening history</h2><p>{rows.length} of {history.length} saved readings</p></div></div>
   <label>Search history<input type="search" value={filter} onChange={event=>setFilter(event.target.value)} placeholder="Search filename or source"/></label>
   {rows.length?<div className="document-table"><table><thead><tr><th>Filename</th><th>Source</th><th>Updated</th><th>Audio</th><th>Render time</th><th>Actions</th></tr></thead><tbody>{rows.map(row=><tr key={row.id}><td>{row.name}</td><td>{row.source}</td><td>{new Date(row.saved).toLocaleString()}</td><td>{rendering?.id===row.id?<span role="status">{rendering.sentence?`Rendering… ${rendering.sentence} / ${rendering.total} sentences`:'Rendering… preparing speech'}</span>:row.rendered?'Rendered':'Text only'}</td><td>{row.renderSeconds===undefined?'—':row.renderSeconds<60?`${row.renderSeconds} s`:`${Math.floor(row.renderSeconds/60)} min ${row.renderSeconds%60} s`}</td><td><div className="document-actions"><button onClick={()=>open(row)}>Open</button>{row.rendered&&<button onClick={()=>historyAudio(row,false)}>Play saved audio</button>}<button disabled={rendering?.id===row.id} onClick={()=>historyAudio(row,true)}>{row.rendered?'Render again':'Render audio'}</button><button onClick={()=>download(row)}>Download text</button><button disabled={busy} onClick={()=>{if(confirm(`Delete “${row.name}” from listening history?`)&&store(history.filter(item=>item.id!==row.id))){if(id===row.id){stop();setId(undefined);}void savedAudio('readwrite',store=>store.delete(key+':'+row.id)).catch(()=>{});}}}>Delete</button></div></td></tr>)}</tbody></table></div>:<p>{history.length?'No matching readings.':'No saved readings yet.'}</p>}
  </section>
  <footer>© {new Date().getFullYear()} Bible Songs · Version {APP_VERSION} · <a href="https://github.com/hexgrad/kokoro">Kokoro speech profiles</a></footer>
 </div>;
}
