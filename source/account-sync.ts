import {useEffect,useEffectEvent,useRef,useState} from 'react';
import {supabase} from './supabase';

export type Preferences={favorite:boolean;speed:number;hiddenReadings:string[]};
const speeds=[.5,.8,1,1.2,1.5,2];
const metadataKey='bible_songs_preferences';
export function parsePreferences(value:unknown):Preferences|undefined{
 if(typeof value!=='object'||value===null||!('favorite' in value)||!('speed' in value))return;
 if(typeof value.favorite!=='boolean'||typeof value.speed!=='number'||!speeds.includes(value.speed))return;
 const hidden='hiddenReadings' in value?value.hiddenReadings:[];
 if(!Array.isArray(hidden)||hidden.some(item=>typeof item!=='string'||item.length>150)||hidden.length>500)return;
 const hiddenReadings=hidden.filter((item):item is string=>typeof item==='string');
 return {favorite:value.favorite,speed:value.speed,hiddenReadings:Array.from(new Set(hiddenReadings)).sort()};
}
export const equalPreferences=(a:Preferences,b:Preferences)=>a.favorite===b.favorite&&a.speed===b.speed&&
 a.hiddenReadings.length===b.hiddenReadings.length&&a.hiddenReadings.every((id,index)=>id===b.hiddenReadings[index]);

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
 async function sync(automatic=false,override?:Preferences){
  if(inFlight.current)return false;
  inFlight.current=true;
  setBusy(true);
  setStatus('Syncing…');
  const snapshot=override??current.current;
  try{
   const {data,error}=await supabase.auth.updateUser({data:{[metadataKey]:snapshot}});
   if(error||data.user.id!==userId)throw Error('Sync failed');
   acknowledged.current=snapshot;
   setReady(true);
   setStatus(`${automatic?'Auto-synced':'Synced'} at ${new Date().toLocaleTimeString()}`);
   return true;
  }catch{
   setReady(false);
   setStatus('Sync failed. Try Sync now.');
   return false;
  }finally{
   inFlight.current=false;
   setBusy(false);
  }
 }
 const autoSync=useEffectEvent(()=>{void sync(true);});
 useEffect(()=>{
  if(!ready||busy||(acknowledged.current&&equalPreferences(preferences,acknowledged.current)))return;
  const timeout=window.setTimeout(autoSync,800);
  return ()=>window.clearTimeout(timeout);
 },[ready,busy,preferences.favorite,preferences.speed,preferences.hiddenReadings]);
 async function readCloud(){
  const {data,error}=await supabase.auth.getUser();
  if(error||data.user?.id!==userId)throw Error('Unable to reach this account');
  return parsePreferences(data.user.user_metadata[metadataKey]);
 }
 return {status,busy,sync,readCloud};
}
