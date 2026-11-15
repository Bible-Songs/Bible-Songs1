import {useEffect,useState} from 'react';
import {APP_VERSION} from './version';
import {parsePreferences,type Preferences} from './account-sync';
import type {RecoveryCopy,SyncProblem} from './preference-history';

export type AccountPage='Recovery centre'|'Sync & backups'|'About';
type Props={page:AccountPage;preferences:Preferences;restore:(value:Preferences)=>void;status:string;
 sync:()=>void;busy:boolean;readCloud:()=>Promise<Preferences|undefined>;copies:RecoveryCopy[];problems:SyncProblem[]};

const formatFavorite=(value:boolean)=>value?'Saved':'None';
const formatTime=(value:number)=>new Date(value).toLocaleString();

export default function AccountPages({page,preferences,restore,status,sync,busy,readCloud,copies,problems}:Props){
 const [message,setMessage]=useState('');
 const [cloud,setCloud]=useState<Preferences|null|undefined>();
 const [checking,setChecking]=useState(false);
 const [storage,setStorage]=useState<string>('Storage estimate unavailable.');
 useEffect(()=>{
  if(page!=='About')return;
  let mounted=true;
  void navigator.storage?.estimate().then(result=>{
   if(mounted&&typeof result.usage==='number')setStorage(`This site uses about ${Math.max(1,Math.round(result.usage/1024))} KB of browser storage.`);
  }).catch(()=>{});
  return ()=>{mounted=false;};
 },[page]);
 async function checkCloud(){
  setChecking(true);setCloud(undefined);
  try{
   const saved=await readCloud();
   setCloud(saved??null);
   setMessage(saved?'Cloud backup is reachable.':'Account is reachable. There is no saved cloud backup yet.');
  }catch{setMessage('Could not read the cloud backup. Check your connection and try again.');}
  finally{setChecking(false);}
 }
 function download(value:unknown,name:string){
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
  const link=document.createElement('a');
  link.href=url;link.download=name;link.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function restoreCopy(value:Preferences){
  if(!window.confirm('Restore the favorite and playback speed from this backup?'))return;
  restore(value);setMessage('Preferences restored.');
 }
 async function importBackup(file:File){
  try{
   const value=parsePreferences(JSON.parse(await file.text()));
   if(!value)throw Error('Invalid backup');
   restoreCopy(value);
  }catch{setMessage('Choose a valid Bible Songs backup file.');}
 }
 return <div className="content account-page">
  <div className="page-heading"><h1>{page}</h1></div>
  <section className="listen-panel account-panel">
   {page==='About'?<>
    <h2>Bible Songs</h2>
    <p>Listen to the Berean Standard Bible, original Scripture songs, and published sermons with synced transcripts.</p>
    <details><summary>Sources and credits</summary><p><a href="https://berean.bible/terms.htm">Berean Standard Bible</a> · <a href="https://github.com/hexgrad/kokoro">Kokoro speech profiles</a></p></details>
    <details><summary>Storage</summary><p>{storage}</p><p>Your favorite and playback speed sync with your account. Theme, layout, last Bible voice, and recovery copies are saved in this browser.</p></details>
    <details><summary>Problems recorded on this device ({problems.length})</summary>
     {problems.length?<><ul>{[...problems].reverse().map((problem,index)=><li key={index}>{formatTime(problem.at)} · {problem.message}</li>)}</ul>
      <div className="account-actions"><button type="button" onClick={()=>download(problems,'bible-songs-sync-problems.json')}>Download sync log</button></div></>:<p>No sync problems recorded.</p>}
    </details>
   </>:page==='Sync & backups'?<>
    <h2>Account sync</h2><p>Sync now saves this device’s favorite and playback speed to your account. Those preferences load when you sign in on another device.</p>
    <p role="status">{status}</p>
    <div className="account-actions"><button type="button" disabled={busy} onClick={()=>{setCloud(undefined);setMessage('');sync();}}>Sync now</button>
     <button type="button" onClick={()=>download(preferences,'bible-songs-backup.json')}>Download backup</button></div>
    <details open><summary>Troubleshoot Sync</summary>
     <p>Compare the preferences on this device with the copy saved to your account.</p>
     <div className="account-actions"><button type="button" disabled={checking||busy} onClick={()=>void checkCloud()}>{checking?'Checking…':'Check cloud backup'}</button></div>
     {cloud&&<>
      <table className="account-table"><thead><tr><th>Preference</th><th>This device</th><th>Cloud backup</th></tr></thead>
       <tbody><tr><th>Favorite</th><td>{formatFavorite(preferences.favorite)}</td><td>{formatFavorite(cloud.favorite)}</td></tr>
        <tr><th>Playback speed</th><td>{preferences.speed}×</td><td>{cloud.speed}×</td></tr></tbody></table>
      <div className="account-actions"><button type="button" onClick={()=>download(cloud,'bible-songs-cloud-backup.json')}>Download cloud backup</button>
       <button type="button" onClick={()=>download({device:preferences,cloud},'bible-songs-backup-comparison.json')}>Export comparison</button></div>
     </>}
    </details>
   </>:<>
    <h2>Restore preferences</h2><p>Restore an earlier device copy, a cloud backup, or a backup file. A restored copy becomes your current preferences.</p>
    <div className="account-actions">
     <label className="account-file">Import backup<input type="file" accept=".json,application/json" onChange={event=>{
      const file=event.currentTarget.files?.[0];event.currentTarget.value='';if(file)void importBackup(file);
     }}/></label>
     <button type="button" disabled={checking||busy} onClick={()=>void checkCloud()}>Check cloud backup</button>
     {cloud&&<button type="button" onClick={()=>restoreCopy(cloud)}>Restore cloud backup</button>}
    </div>
    <h3>Recent device copies</h3>
    {copies.length?<table className="account-table"><thead><tr><th>Saved at</th><th>Favorite</th><th>Speed</th><th>Action</th></tr></thead>
     <tbody>{copies.map((copy,index)=><tr key={index}><td>{formatTime(copy.savedAt)}</td><td>{formatFavorite(copy.preferences.favorite)}</td><td>{copy.preferences.speed}×</td>
      <td><div className="account-actions"><button type="button" onClick={()=>restoreCopy(copy.preferences)} aria-label={`Restore copy from ${formatTime(copy.savedAt)}`}>Restore</button></div></td></tr>)}</tbody>
    </table>:<p>No previous preferences saved on this device yet.</p>}
   </>}
   {message&&<p role="status">{message}</p>}
  </section>
  <p className="copyright-notice app-copyright">© {new Date().getFullYear()} Bible Songs <span className="app-version">Version {APP_VERSION}</span></p>
 </div>;
}
