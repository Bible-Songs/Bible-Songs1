import {useEffect,useRef,useState} from 'react';
import {parsePreferences,type Preferences} from './account-sync';

export type RecoveryCopy={savedAt:number;preferences:Preferences};
export type SyncProblem={at:number;message:string};
function read(key:string):unknown[]{
 try{
  const value:unknown=JSON.parse(localStorage.getItem(key)??'[]');
  return Array.isArray(value)?value:[];
 }catch{return [];}
}
function write(key:string,value:unknown){
 try{localStorage.setItem(key,JSON.stringify(value));}catch{}
}
export function usePreferenceHistory(key:string,preferences:Preferences,status:string){
 const recoveryKey=key+':recovery',problemKey=key+':sync-problems';
 const [copies,setCopies]=useState<RecoveryCopy[]>(()=>read(recoveryKey).flatMap(item=>{
  if(typeof item!=='object'||item===null||!('savedAt' in item)||typeof item.savedAt!=='number'||!Number.isFinite(item.savedAt)||!('preferences' in item))return [];
  const parsed=parsePreferences(item.preferences);
  return parsed?[{savedAt:item.savedAt,preferences:parsed}]:[];
 }));
 const [problems,setProblems]=useState<SyncProblem[]>(()=>read(problemKey).flatMap(item=>{
  if(typeof item!=='object'||item===null||!('at' in item)||typeof item.at!=='number'||!Number.isFinite(item.at)||!('message' in item)||typeof item.message!=='string')return [];
  return [{at:item.at,message:item.message}];
 }));
 const previous=useRef(preferences);
 useEffect(()=>{
  const old=previous.current;
  if(old.favorite===preferences.favorite&&old.speed===preferences.speed)return;
  previous.current=preferences;
  const copy={savedAt:Date.now(),preferences:old};
  setCopies(items=>[copy,...items].slice(0,10));
 },[preferences]);
 useEffect(()=>{write(recoveryKey,copies);},[recoveryKey,copies]);
 useEffect(()=>{
  if(status==='Sync unavailable'||status.startsWith('Sync failed')){
   const problem={at:Date.now(),message:status};
   setProblems(items=>[problem,...items].slice(0,10));
  }
 },[status]);
 useEffect(()=>{write(problemKey,problems);},[problemKey,problems]);
 return {copies,problems};
}
