import {useEffect,useEffectEvent,useRef,useState} from 'react';
import {supabase} from './supabase';

export type Preferences={favorite:boolean;speed:number};
const speeds=[.5,.8,1,1.2,1.5,2];
const metadataKey='bible_songs_preferences';
export function parsePreferences(value:unknown):Preferences|undefined{
 if(typeof value!=='object'||value===null||!('favorite' in value)||!('speed' in value))return;
 if(typeof value.favorite!=='boolean'||typeof value.speed!=='number'||!speeds.includes(value.speed))return;
 return {favorite:value.favorite,speed:value.speed};
}
const equal=(a:Preferences,b:Preferences)=>a.favorite===b.favorite&&a.speed===b.speed;

export function useAccountSync(userId:string,preferences:Preferences,apply:(value:Preferences)=>void){
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false);
 const [status,setStatus]=useState('Checking sync…');
 const acknowledged=useRef<Preferences|undefined>(preferences);
 const inFlight=useRef(false);
 const current=useRef(preferences);
 current.current=preferences;
 const applyRemote=useEffectEvent((value:Preferences)=>apply(value));
 useEffect(()=>{
  let active=true;
  void supabase.auth.getUser().then(({data,error})=>{
   if(!active)return;
   if(error||data.user?.id!==userId){setStatus('Sync unavailable');return;}
   const remote=parsePreferences(data.user.user_metadata[metadataKey]);
   if(remote){
    acknowledged.current=remote;
    applyRemote(remote);
    setStatus(`Auto-synced at ${new Date().toLocaleTimeString()}`);
   }else{
    acknowledged.current=undefined;
    setStatus('Preparing first backup…');
   }
   setReady(true);
  }).catch(()=>{if(active)setStatus('Sync unavailable');});
  return ()=>{active=false;};
 },[userId]);
 async function sync(automatic=false){
  if(inFlight.current)return;
  inFlight.current=true;
  setBusy(true);
  setStatus('Syncing…');
  const snapshot=current.current;
  try{
   const {data,error}=await supabase.auth.updateUser({data:{[metadataKey]:snapshot}});
   if(error||data.user.id!==userId)throw Error('Sync failed');
   acknowledged.current=snapshot;
   setReady(true);
   setStatus(`${automatic?'Auto-synced':'Synced'} at ${new Date().toLocaleTimeString()}`);
  }catch{
   setReady(false);
   setStatus('Sync failed. Try Sync now.');
  }finally{
   inFlight.current=false;
   setBusy(false);
  }
 }
 const autoSync=useEffectEvent(()=>{void sync(true);});
 useEffect(()=>{
  if(!ready||busy||(acknowledged.current&&equal(preferences,acknowledged.current)))return;
  const timeout=window.setTimeout(autoSync,800);
  return ()=>window.clearTimeout(timeout);
 },[ready,busy,preferences.favorite,preferences.speed]);
 return {status,busy,sync};
}
