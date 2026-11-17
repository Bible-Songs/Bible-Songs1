import {useEffect,useRef} from 'react';
import type {RefObject} from 'react';
import cues from './prayer-the-cure-for-care-cues.json';
import './prayer-animation.css';

const end=300;
const scenes=[
 {cue:0,art:'chapel',line:'Prayer, the Cure for Care',reference:'C. H. Spurgeon · Metropolitan Tabernacle'},
 {cue:2,art:'window',line:'“Let your requests be made known unto God.”',reference:'Philippians 4:6–7'},
 {cue:4,art:'desk',line:'“We have the faculty of forethought.”'},
 {cue:5,art:'birds',line:'“How often Luther liked to talk about the birds.”'},
 {cue:7,art:'cage',line:'“Look, mamma, at that poor little bird; it has not got any cage!”'},
 {cue:9,art:'cage',line:'“It is that cage of carnal trust … that makes the worry of this mortal life.”'},
 {cue:10,art:'field',line:'“Spread his wings and soar away.”'},
 {cue:11,art:'desk',line:'“Be careful for nothing.”'},
 {cue:13,art:'desk',line:'“The text means, be not anxious.”'},
 {cue:14,art:'field',line:'“All our care is cast on God.”'},
 {cue:15,art:'window',line:'“Be prayerful for everything.”'},
 {cue:16,art:'window',line:'“By prayer and supplication with thanksgiving.”'},
 {cue:17,art:'field',line:'“The peace of God, which passeth all understanding.”'},
 {cue:18,art:'stones',line:'The substitute for care'},
 {cue:20,art:'stones',line:'“Another crop of cares growing up all around you.”'},
 {cue:21,art:'stones',line:'“Turn into a prayer everything that is a care.”'},
 {cue:22,art:'gold',line:'“Let your cares be the raw material of your prayers.”'},
 {cue:23,art:'gold',line:'“And so make it into a blessing.”'},
] as const;

type Art=(typeof scenes)[number]['art'];
const width=960,height=480;
const colors={
 chapel:['#101e30','#697a83','#eab779'],window:['#1b2636','#776756','#f2c479'],
 desk:['#1b2931','#4c6161','#dfa574'],birds:['#244353','#74958d','#f0ce92'],
 cage:['#27393b','#597370','#ebb674'],field:['#2d555c','#9caa83','#f7d58d'],
 stones:['#202d35','#5b665b','#dca97a'],gold:['#192833','#74715c','#ffda85'],
} satisfies Record<Art,[string,string,string]>;

function ellipse(ctx:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string,angle=0){
 ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,angle,0,Math.PI*2);ctx.fill();
}

function line(ctx:CanvasRenderingContext2D,points:readonly (readonly [number,number])[],color:string,weight:number){
 ctx.beginPath();
 for(const [index,[x,y]] of points.entries()){
  if(index===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
 }
 ctx.lineWidth=weight;ctx.strokeStyle=color;ctx.stroke();
}

function bird(ctx:CanvasRenderingContext2D,x:number,y:number,size:number,t:number){
 const lift=8+Math.sin(t*5)*12;
 ctx.save();ctx.translate(x,y);ctx.scale(size,size);
 ctx.beginPath();ctx.moveTo(-24,-lift);ctx.quadraticCurveTo(-10,-11,0,0);
 ctx.quadraticCurveTo(9,-10,26,-lift-4);ctx.quadraticCurveTo(11,1,1,5);
 ctx.quadraticCurveTo(-10,2,-24,-lift);ctx.fillStyle='#122e35';ctx.fill();ctx.restore();
}

function landscape(ctx:CanvasRenderingContext2D,t:number,light:string){
 ellipse(ctx,695,172,51,51,light);
 for(let i=0;i<8;i++){
  const x=((i*173+t*3)%1140)-100;
  ellipse(ctx,x,115+Math.sin(i*7)*56,82+i*4,9,'rgba(246,225,183,.13)');
 }
 for(let i=0;i<4;i++){
  ctx.beginPath();ctx.moveTo(0,height);
  for(let x=0;x<=width;x+=8){
   const y=250+i*30+Math.sin(x/143+i*1.8)*36+Math.sin(x/310+i)*22;
   ctx.lineTo(x,y);
  }
  ctx.lineTo(width,height);ctx.fillStyle=['#678782','#4c7169','#355a52','#25463f'][i]??'#25463f';ctx.fill();
 }
 for(let i=0;i<96;i++){
  const x=(i*113.13)%width,y=350+(i*29)%140;
  line(ctx,[[x,y],[x+Math.sin(t*1.4+i)*6,y-9-i%17]],i%6===0?'#b29d65':'#466553',1.4);
 }
}

function architecture(ctx:CanvasRenderingContext2D,art:'chapel'|'window',glow:string,t:number){
 const chapel=art==='chapel';
 const cx=chapel?470:650, top=chapel?150:65, bottom=chapel?375:350;
 if(chapel){
  ctx.fillStyle='#243336';ctx.fillRect(258,223,425,151);
  ctx.beginPath();ctx.moveTo(236,229);ctx.lineTo(cx,128);ctx.lineTo(705,229);ctx.fill();
  ctx.fillStyle='#334247';ctx.fillRect(294,237,352,134);
  for(let x=309;x<=650;x+=63)ctx.fillRect(x,225,11,150);
  for(let i=0;i<5;i++)line(ctx,[[278-i*14,375+i*8],[658+i*14,375+i*8]],'#7e7761',2);
 }else{
  ctx.fillStyle='#22333b';ctx.fillRect(0,0,300,height);
  line(ctx,[[302,0],[302,height]],'#947858',2);
 }
 const size=chapel?38:88;
 ctx.beginPath();ctx.moveTo(cx-size,bottom);ctx.lineTo(cx-size,top+size);
 ctx.quadraticCurveTo(cx-size,top+12,cx,top);
 ctx.quadraticCurveTo(cx+size,top+12,cx+size,top+size);
 ctx.lineTo(cx+size,bottom);ctx.closePath();
 const glass=ctx.createLinearGradient(0,top,0,bottom);
 glass.addColorStop(0,'#8c795f');glass.addColorStop(1,glow);ctx.fillStyle=glass;ctx.fill();
 ctx.strokeStyle='#283533';ctx.lineWidth=8;ctx.stroke();
 ctx.save();ctx.clip();
 for(let i=-2;i<=2;i++)line(ctx,[[cx+i*size/3,top],[cx+i*size/3,bottom]],'#494c44',2);
 for(let y=top+45;y<bottom;y+=29)line(ctx,[[cx-size,y],[cx+size,y]],'#494c44',2);
 ctx.restore();
 if(!chapel){
  ctx.beginPath();ctx.moveTo(cx-size,bottom);ctx.lineTo(370,480);ctx.lineTo(910,480);ctx.lineTo(cx+size,bottom);
  ctx.fillStyle='rgba(248,199,120,.12)';ctx.fill();
 }
 for(let i=0;i<24;i++)ellipse(ctx,330+(i*113)%530,55+(i*83+t*7)%345,1,1,'rgba(245,209,149,.54)');
}

function desk(ctx:CanvasRenderingContext2D,t:number,light:string){
 ctx.fillStyle='#3f3933';ctx.fillRect(0,292,width,188);
 for(let i=0;i<12;i++)line(ctx,[[0,305+i*15],[width,320+i*15]],'#514639',2);
 ctx.save();ctx.translate(557,301);ctx.rotate(-.08);
 ctx.fillStyle='#624c3c';ctx.fillRect(-165,-99,320,190);
 ctx.fillStyle='#d7ba8a';ctx.fillRect(-158,-105,306,178);
 ctx.fillStyle='#e5c99a';ctx.fillRect(-152,-108,147,172);
 line(ctx,[[-4,-108],[-4,65]],'#917553',3);
 for(let i=0;i<8;i++){
  line(ctx,[[-131,-78+i*15],[-19-(i%3)*13,-78+i*15]],'#a98d67',1);
  line(ctx,[[16,-78+i*15],[126-(i%4)*11,-78+i*15]],'#a98d67',1);
 }
 ctx.restore();
 ellipse(ctx,243,326,69,18,'#282e29');
 ctx.fillStyle='#d4b582';ctx.fillRect(233,220,26,104);
 ellipse(ctx,246,212,27+Math.sin(t*3)*3,37,'rgba(245,184,92,.12)');
 ellipse(ctx,246+Math.sin(t*4)*2,206,6,16,light);
 line(ctx,[[671,349],[743,259]],'#47392e',5);
 ellipse(ctx,733,267,11,43,'#a99273',.65);
}

function cage(ctx:CanvasRenderingContext2D,t:number){
 const color='#d7b782';
 ctx.save();ctx.translate(570,115);
 line(ctx,[[0,-40],[0,-17]],color,3);
 ctx.beginPath();ctx.ellipse(0,-5,10,11,0,0,Math.PI*2);ctx.strokeStyle=color;ctx.lineWidth=3;ctx.stroke();
 ctx.beginPath();ctx.moveTo(-99,225);ctx.lineTo(-99,85);ctx.bezierCurveTo(-99,-13,99,-13,99,85);
 ctx.lineTo(99,225);ctx.stroke();
 for(let i=-3;i<=0;i++){
  const x=i*23;
  ctx.beginPath();ctx.moveTo(x,225);ctx.lineTo(x,77);ctx.quadraticCurveTo(x,29,0,13);ctx.stroke();
 }
 for(let i=0;i<4;i++)line(ctx,[[i*17,95+i*4],[i*17+90,116+i*14]],color,2);
 line(ctx,[[-99,225],[99,225]],color,7);
 ellipse(ctx,0,230,105,11,'#473e32');ctx.restore();
 bird(ctx,721+(t*14)%270,154+Math.sin(t*.52)*17,1.12,t);
}

function stones(ctx:CanvasRenderingContext2D,t:number,gold:boolean){
 const surface=ctx.createLinearGradient(0,270,0,height);
 surface.addColorStop(0,'#4a4840');surface.addColorStop(1,'#242f30');ctx.fillStyle=surface;ctx.fillRect(0,281,width,199);
 for(let i=0;i<17;i++){
  const x=336+(i*83)%324,y=358+(i*37)%82;
  const lit=gold&&(i%3!==2);
  ellipse(ctx,x,y+7,24,9,'#282e2b',.15);
  ellipse(ctx,x,y,22+i%6,11+i%4,lit?'#c19b56':'#68695c',i*.38);
  ellipse(ctx,x-4,y-4,9,3,lit?'#f7d796':'#929182',i*.38);
 }
 if(gold){
  for(let i=0;i<38;i++){
   const x=417+(i*49)%199+Math.sin(t+i)*14,y=382-((i*23+t*(10+i%7))%224);
   ellipse(ctx,x,y,i%4===0?2:1,1.4,i%4===0?'#ffe2a3':'rgba(249,202,107,.48)');
  }
 }
}

function paint(ctx:CanvasRenderingContext2D,art:Art,t:number){
 const [top,middle,light]=colors[art];
 const sky=ctx.createLinearGradient(0,0,0,height);
 sky.addColorStop(0,top);sky.addColorStop(.65,middle);sky.addColorStop(1,light);
 ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
 const halo=ctx.createRadialGradient(645,204,10,645,204,340);
 halo.addColorStop(0,'rgba(251,214,153,.26)');halo.addColorStop(1,'rgba(251,214,153,0)');
 ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
 switch(art){
  case 'chapel':case 'window':architecture(ctx,art,light,t);break;
  case 'desk':desk(ctx,t,light);break;
  case 'stones':case 'gold':stones(ctx,t,art==='gold');break;
  case 'birds':case 'cage':case 'field':
   landscape(ctx,t,light);
   if(art==='cage')cage(ctx,t);
   else for(let i=0;i<(art==='birds'?5:3);i++){
    bird(ctx,((t*17+i*125+320)%1100)-70,103+i*28+Math.sin(t*.85+i)*17,.56+i*.12,t+i);
   }
   break;
 }
 const vignette=ctx.createRadialGradient(480,215,140,480,215,570);
 vignette.addColorStop(0,'rgba(10,23,31,0)');vignette.addColorStop(1,'rgba(10,23,31,.55)');
 ctx.fillStyle=vignette;ctx.fillRect(0,0,width,height);
 ctx.fillStyle='rgba(255,224,170,.12)';
 for(let i=0;i<980;i++)ctx.fillRect((i*107.117)%width,(i*37.731)%height,1.2,1);
}

export default function PrayerAnimation({audio,time,playing,onRestart}:{
 audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean;onRestart:()=>void;
}){
 const canvas=useRef<HTMLCanvasElement>(null);
 const scene=scenes.findLast(entry=>(cues[entry.cue]?.start??Infinity)<=time)??scenes[0];
 const complete=time>=end;
 useEffect(()=>{
  const context=canvas.current?.getContext('2d');
  if(!context||complete)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame=0,last=-1;
  function draw(){
   if(!context)return;
   const position=audio.current?.currentTime??time;
   if(position<end&&(!playing||Math.abs(position-last)>=1/24)){
    paint(context,scene.art,reduced?0:position);last=position;
   }
   if(playing&&!reduced)frame=requestAnimationFrame(draw);
  }
  draw();
  return ()=>cancelAnimationFrame(frame);
 },[audio,complete,playing,scene,time]);
 return <figure className="prayer-animation" aria-label="Prayer, the Cure for Care animation">
  <div className="prayer-animation-stage">
   <canvas ref={canvas} width={width} height={height} aria-hidden="true" hidden={complete}/>
   {complete&&<div className="prayer-animation-end">
    <strong>Five-minute animation complete</strong>
    <button className="document-upload" type="button" onClick={onRestart}>Replay from the start</button>
   </div>}
  </div>
  {!complete&&<figcaption className="prayer-animation-caption">
   <span>{scene.line}</span>
   {'reference' in scene&&<small>{scene.reference}</small>}
  </figcaption>}
 </figure>;
}
