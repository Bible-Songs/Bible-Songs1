import immutabilityCues from './immutability-cues.json';
import PublishedReading from './PublishedReading';
import sermonCues from './gods-jewels-cues.json';
import {APP_VERSION} from './version';

function fileSize(bytes:number){return `${(bytes/1024**2).toFixed(1)} MB`;}

export default function ListeningLibrary(){
 return <div className="content document-library">
  <div className="page-heading"><h1>Listening Library</h1></div>
  <section className="listen-panel document-workspace" onPlayCapture={event=>{
   event.currentTarget.querySelectorAll('audio').forEach(player=>{if(player!==event.target)player.pause();});
  }}>
   <div className="section-heading"><div><h2>Published readings</h2></div></div>
   <PublishedReading title="God’s Jewels" filename="gods-jewels-spurgeon.m4a" size={fileSize(19937230)} cues={sermonCues}/>
   <PublishedReading title="The Immutability of God" filename="immutability-of-god-spurgeon.m4a" size={fileSize(26109049)} cues={immutabilityCues}/>
  </section>
  <footer>© {new Date().getFullYear()} Bible Songs · Version {APP_VERSION} · <a href="https://github.com/hexgrad/kokoro">Kokoro speech profiles</a></footer>
 </div>;
}
