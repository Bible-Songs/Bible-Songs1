import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import PrayerAnimation from '../source/PrayerAnimation';
import ExcellencyAnimation from '../source/ExcellencyAnimation';
import JewelsAnimation from '../source/JewelsAnimation';

type Sermon='prayer'|'excellency'|'jewels';
declare global{interface Window{captionPreview:{render:(sermon:Sermon,time:number)=>void}}}
const target=document.getElementById('root');if(!target)throw new Error('Missing fixture root');
document.body.style.cssText='margin:0;background:#192c32;color:#f8e9cb';
const root=createRoot(target),audio=document.createElement('audio'),reference={current:audio};
let position=0,duration=1674.976236;
Object.defineProperty(audio,'currentTime',{get:()=>position});
Object.defineProperty(audio,'duration',{get:()=>duration});
window.captionPreview={render:(sermon,time)=>{
 if(!Number.isFinite(time)||time<0)throw new Error('Invalid preview clock');
 position=time;duration=sermon==='prayer'?1674.976236:sermon==='jewels'?1665.960998:5483.96;
 const Animation=sermon==='prayer'?PrayerAnimation:sermon==='jewels'?JewelsAnimation:ExcellencyAnimation;
 flushSync(()=>root.render(<Animation key={sermon} audio={reference} time={time} playing={false}/>));
}};
window.captionPreview.render('prayer',0);
