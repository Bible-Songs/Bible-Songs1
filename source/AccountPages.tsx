import {useState} from 'react';
import {APP_VERSION} from './version';
import {parsePreferences,type Preferences} from './account-sync';

export type AccountPage='Recovery centre'|'Sync & backups'|'About';
export default function AccountPages({page,preferences,restore,status,sync,busy}:{page:AccountPage;preferences:Preferences;restore:(value:Preferences)=>void;status:string;sync:()=>void;busy:boolean}){
 const [message,setMessage]=useState('');
 function download(){
  const url=URL.createObjectURL(new Blob([JSON.stringify(preferences,null,2)],{type:'application/json'}));
  const link=document.createElement('a');
  link.href=url;link.download='bible-songs-backup.json';link.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 async function importBackup(file:File){
  try{
   const value=parsePreferences(JSON.parse(await file.text()));
   if(!value)throw Error('Invalid backup');
   if(!window.confirm('Restore the favorite and playback speed from this backup?'))return;
   restore(value);setMessage('Preferences restored.');
  }catch{setMessage('Choose a valid Bible Songs backup file.');}
 }
 return <div className="content account-page">
  <div className="page-heading"><h1>{page}</h1></div>
  <section className="listen-panel account-panel">
   {page==='About'?<>
    <h2>Bible Songs</h2>
    <p>Listen to the Berean Standard Bible, original Scripture songs, and published sermons with synced transcripts.</p>
    <details><summary>Sources and credits</summary><p><a href="https://berean.bible/terms.htm">Berean Standard Bible</a> · <a href="https://github.com/hexgrad/kokoro">Kokoro speech profiles</a></p></details>
    <details><summary>Storage</summary><p>Your favorite and playback speed sync with your account. Your last Bible voice is saved in this browser.</p></details>
   </>:page==='Sync & backups'?<>
    <h2>Account sync</h2><p>Sync now saves this device’s favorite and playback speed to your account. Those preferences load when you sign in on another device.</p>
    <p role="status">{status}</p>
    <div className="account-actions"><button type="button" disabled={busy} onClick={sync}>Sync now</button><button type="button" onClick={download}>Download backup</button></div>
   </>:<>
    <h2>Restore preferences</h2><p>Import a Bible Songs backup to restore your favorite and playback speed.</p>
    <div className="account-actions"><label className="account-file">Import backup<input type="file" accept=".json,application/json" onChange={event=>{
     const file=event.currentTarget.files?.[0];event.currentTarget.value='';if(file)void importBackup(file);
    }}/></label></div>
    {message&&<p role="status">{message}</p>}
   </>}
  </section>
  <p className="copyright-notice app-copyright">© {new Date().getFullYear()} Bible Songs <span className="app-version">Version {APP_VERSION}</span></p>
 </div>;
}
