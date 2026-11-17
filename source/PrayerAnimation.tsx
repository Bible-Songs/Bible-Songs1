import {useEffect,useRef} from 'react';
import type {RefObject} from 'react';
import cues from './prayer-the-cure-for-care-cues.json';
import captionTiming from './prayer-caption-timing.json';
import './prayer-animation.css';

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
 {cue:24,art:'gold',line:'Bring your desires into prayer.'},
 {cue:26,art:'winter',line:'“Ebbs follow floods, and winters crush out summer flowers.”'},
 {cue:27,art:'winter',line:'“Blessed be the name of the Lord.”'},
 {cue:29,art:'bread',line:'Even our daily bread belongs in prayer.'},
 {cue:31,art:'birds',line:'“Your heavenly Father feedeth them.”'},
 {cue:32,art:'door',line:'“So many excuses for knocking at God’s door.”'},
 {cue:35,art:'road',line:'A choice between two roads'},
 {cue:36,art:'road',line:'“The road will clear before you very suddenly.”'},
 {cue:39,art:'bread',line:'The Gibeonites and their old bread'},
 {cue:42,art:'road',line:'“In simple things and difficult things we should be guided.”'},
 {cue:43,art:'horizon',line:'“Dost thou know what a day will bring forth?”'},
 {cue:47,art:'desk',line:'“Turn everything that might be a subject of care into a subject of prayer.”'},
 {cue:48,art:'desk',line:'“Strike out that word ‘care’, and just write in the stead of it this word ‘prayer’.”'},
 {cue:49,art:'door',line:'There is a place for us at the door of prayer.'},
 {cue:51,art:'window',line:'“Let your requests be made known unto God.”'},
 {cue:52,art:'stones',line:'What can worry change?'},
 {cue:53,art:'rain',line:'A farmer worries about the rain.'},
 {cue:56,art:'rain',line:'“What is the good of it … when you can get nothing by it?”'},
 {cue:57,art:'lens',line:'Anxiety clouds our sight.'},
 {cue:58,art:'lens',line:'“We should do the right thing.”'},
 {cue:60,art:'gold',line:'“Every care will be a benefit to you.”'},
 {cue:61,art:'chapel',line:'“We grow in grace by prayer.”'},
 {cue:62,art:'window',line:'“Pray for me, it is a time of need.”'},
 {cue:63,art:'nest',line:'Young birds strengthen their wings.'},
 {cue:65,art:'birds',line:'“Take to this enriching habit of prayer.”'},
 {cue:66,art:'window',line:'“The Lord is at hand.”'},
 {cue:68,art:'horizon',line:'Hold earthly things lightly.'},
 {cue:70,art:'ripples',line:'“As a pebble falls into a mountain tarn.”'},
 {cue:71,art:'window',line:'The special character of this prayer'},
 {cue:72,art:'bread',line:'“You may pray about the smallest thing and about the greatest thing.”'},
 {cue:77,art:'shore',line:'“One insignificant grain of sand on the seashore of the universe.”'},
 {cue:79,art:'window',line:'“In everything let your requests be made known unto God.”'},
 {cue:80,art:'ripples',line:'“Pray to God, and then pray again.”'},
 {cue:82,art:'shore',line:'Elijah prays again as he waits for rain.'},
 {cue:83,art:'horizon',line:'Jacob keeps asking for the blessing.'},
 {cue:85,art:'desk',line:'“Let your requests be made known unto God.”'},
 {cue:86,art:'boat',line:'An account of prayer aboard a boat'},
 {cue:90,art:'desk',line:'Prayer begins with knowing what you are asking.'},
 {cue:94,art:'window',line:'“Get alone, and tell the Lord what you want.”'},
 {cue:97,art:'door',line:'“Communion with God.”'},
 {cue:98,art:'letter',line:'A letter must reach the person it is addressed to.'},
 {cue:101,art:'gold',line:'“Delays are not denials.”'},
 {cue:103,art:'door',line:'God invites us to come again.'},
 {cue:107,art:'window',line:'“With thanksgiving.”'},
 {cue:108,art:'bread',line:'Give thanks even in want.'},
 {cue:110,art:'letter',line:'“It contains a blessing though the envelope is black-edged.”'},
 {cue:111,art:'measure',line:'“Prayer and supplication, then one drachm of thanksgiving.”'},
 {cue:112,art:'ripples',line:'The sweet effect of this prayer'},
 {cue:113,art:'ripples',line:'“The peace of God.”'},
 {cue:117,art:'window',line:'Peace in the face of suffering'},
 {cue:120,art:'window',line:'“The peace of God, which passeth all understanding.”'},
 {cue:121,art:'chapel',line:'The courage of the martyrs'},
 {cue:124,art:'calm',line:'“Be still,” and “there was a great calm.”'},
 {cue:126,art:'walls',line:'“It is a guardian peace.”'},
 {cue:128,art:'walls',line:'“Peace, though it seems weakness, is the essence of strength.”'},
 {cue:129,art:'window',line:'“A peace which links us to Jesus.”'},
 {cue:131,art:'chapel',line:'An invitation to know this peace'},
 {cue:135,art:'wings',line:'“Beneath the shadow of the wings of the Almighty.”'},
 {cue:136,art:'wings',line:'“God grant it to you, my beloved hearers, for Christ’s sake! Amen.”'},
] as const;

type Art=(typeof scenes)[number]['art'];
const captionStarts=new Map(captionTiming.map(({cue,at})=>[cue,at]));
const captionScenes=scenes.map(scene=>{
 const words=scene.line.split(' ');
 const phrases=words.flatMap((_,index)=>index%3===0?[words.slice(index,index+3).join(' ')]:[]);
 return {...scene,phrases};
});
const width=960,height=480;
const colors={
 chapel:['#101e30','#697a83','#eab779'],window:['#1b2636','#776756','#f2c479'],
 desk:['#1b2931','#4c6161','#dfa574'],birds:['#244353','#74958d','#f0ce92'],
 cage:['#27393b','#597370','#ebb674'],field:['#2d555c','#9caa83','#f7d58d'],
 stones:['#202d35','#5b665b','#dca97a'],gold:['#192833','#74715c','#ffda85'],
 winter:['#273443','#88979b','#c2c3b2'],bread:['#243032','#6e624f','#d4ad72'],
 door:['#172429','#3e5750','#e7ba77'],road:['#25363a','#77878b','#d3c398'],
 horizon:['#243448','#667d84','#eccc87'],rain:['#1c2936','#435e65','#a1a59a'],
 lens:['#24313a','#5d7774','#deb97e'],nest:['#2f413d','#8e9471','#e7c68b'],
 ripples:['#223648','#5e847f','#d8cd9c'],shore:['#132436','#4a646a','#b3ad8b'],
 boat:['#233545','#6e8f8a','#f4ca88'],letter:['#23302f','#5b5c4b','#dfbd87'],
 measure:['#292f32','#725f53','#e7c387'],calm:['#243a4c','#789994','#edcd8f'],
 walls:['#293c47','#6b8b81','#ddc88e'],wings:['#25394a','#85a095','#f3d496'],
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

const rockPile=[
 [422,364,102,72,-.22],[530,357,112,80,.13],[614,375,79,56,.34],
 [473,321,93,65,-.34],[554,314,91,66,.24],[508,278,80,63,-.08],
 [370,404,63,43,.26],[445,408,105,65,.14],[541,408,116,66,-.13],[638,420,74,47,-.18],
] as const;

function rock(ctx:CanvasRenderingContext2D,index:number,gold:boolean){
 const placement=rockPile[index];
 if(!placement)return;
 const [x,y,w,h,angle]=placement;
 const lit=gold&&index%3!==2;
 ellipse(ctx,x+5,y+3,w*.62,h*.20,'rgba(14,22,22,.58)',.04);
 ctx.save();
 ctx.translate(x,y);ctx.rotate(angle);ctx.scale(w,h);
 const shoulder=.29+(index%4)*.039;
 const crown=-.17+(index%5)*.071;
 const rim=[[-.56,-.08],[-.43,-.64],[crown,-.91],[shoulder,-.79],[.56,-.38],[.46,-.02],[.02,.08],[-.35,.03]] as const;
 ctx.beginPath();
 rim.forEach(([px,py],i)=>i===0?ctx.moveTo(px,py):ctx.lineTo(px,py));
 ctx.closePath();ctx.clip();
 ctx.fillStyle=lit?'#9c703c':'#4b5351';ctx.fillRect(-1,-1,2,2);
 const ridge=.05+Math.sin(index*1.4)*.12;
 const facets=[
  {points:[rim[0],rim[1],rim[2],[ridge,-.53],[-.18,-.29]],shade:lit?'#d8ae67':'#9ca099'},
  {points:[rim[2],rim[3],rim[4],[ridge,-.53]],shade:lit?'#ad824a':'#737a76'},
  {points:[rim[0],[-.18,-.29],[ridge,-.53],rim[4],[.31,-.13],rim[6]],shade:lit?'#bf9552':'#666d69'},
  {points:[rim[4],rim[5],rim[6],[.31,-.13]],shade:lit?'#7c552d':'#3e4848'},
 ] as const;
 for(const facet of facets){
  ctx.beginPath();
  facet.points.forEach(([px,py],i)=>i===0?ctx.moveTo(px,py):ctx.lineTo(px,py));
  ctx.closePath();ctx.fillStyle=facet.shade;ctx.fill();
 }
 for(let i=0;i<90;i++){
  const px=((i*37.711+index*19.11)%101)/90-.57;
  const py=-((i*63.373+index*11.71)%91)/91;
  ctx.fillStyle=i%3===0?'rgba(24,29,28,.28)':'rgba(239,235,215,.24)';
  ctx.fillRect(px,py,.01+(i%6)*.003,.013);
 }
 line(ctx,[rim[1],rim[2],rim[3]],lit?'#ead097':'#bac0b5',.021);
 line(ctx,[[-.37,-.57],[-.22,-.50],[-.17,-.42],[-.02,-.39]],'rgba(38,44,41,.54)',.013);
 ctx.restore();
}

function stones(ctx:CanvasRenderingContext2D,t:number,gold:boolean){
 const surface=ctx.createLinearGradient(0,270,0,height);
 surface.addColorStop(0,'#4a4840');surface.addColorStop(1,'#242f30');ctx.fillStyle=surface;ctx.fillRect(0,281,width,199);
 ellipse(ctx,513,407,203,34,'rgba(15,23,23,.35)');
 for(const index of rockPile.keys())rock(ctx,index,gold);
 if(gold){
  for(let i=0;i<38;i++){
   const x=417+(i*49)%199+Math.sin(t+i)*14,y=382-((i*23+t*(10+i%7))%224);
   ellipse(ctx,x,y,i%4===0?2:1,1.4,i%4===0?'#ffe2a3':'rgba(249,202,107,.48)');
  }
 }
}

function shape(ctx:CanvasRenderingContext2D,points:readonly (readonly [number,number])[],color:string){
 ctx.beginPath();
 for(const [i,[x,y]] of points.entries()){
  if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
 }
 ctx.closePath();ctx.fillStyle=color;ctx.fill();
}

function pathScene(ctx:CanvasRenderingContext2D,art:'road'|'rain'|'winter'|'horizon'|'nest'|'wings',t:number,light:string,elapsed:number){
 landscape(ctx,t,light);
 if(art==='horizon')return;
 if(art==='road'){
  shape(ctx,[[470,260],[521,268],[557,300],[642,341],[854,480],[470,480],[524,392],[538,347],[505,307]],'#8a8168');
  shape(ctx,[[542,348],[487,378],[363,480],[200,480],[388,410],[501,355]],'#746d5c');
  for(let i=0;i<3;i++){
   const x=529+i*67,y=292+i*49;
   line(ctx,[[x,y],[x,y-33-i*10]],'#273a40',3+i);
   ellipse(ctx,x,y-35-i*10,16+i*3,17+i*3,'rgba(255,221,144,.22)');
   ellipse(ctx,x,y-35-i*10,4+i,6+i,light);
  }
  for(let i=0;i<7;i++){
   const alpha=Math.max(.04,.20-elapsed*.003);
   ellipse(ctx,((i*209+t*7)%1110)-75,235+i*22,170,17,`rgba(217,220,205,${alpha})`);
  }
 }
 if(art==='rain'||art==='winter'){
  for(let i=0;i<105;i++){
   const x=(i*113.3+t*28)%width,y=(i*47.7+t*(art==='rain'?245:24))%height;
   if(art==='rain')line(ctx,[[x,y],[x-11,y+32]],'rgba(189,219,213,.33)',1.4);
   else ellipse(ctx,x,y,1+i%3,1+i%3,'rgba(243,238,216,.62)');
  }
 }
 if(art==='nest'){
  line(ctx,[[193,356],[432,290],[747,343],[942,269]],'#393d34',17);
  for(let i=0;i<28;i++)ellipse(ctx,510+(i%7-3)*15,301+(i*17)%46,57,5,'#77613f',Math.sin(i)*.34);
  bird(ctx,493,288,.85,t);bird(ctx,552,292,.76,t+.7);
 }
 if(art==='wings'){
  ctx.save();ctx.translate(495,178);ctx.scale(7,7);bird(ctx,0,0,1,t*.25);ctx.restore();
 }
}

function waterScene(ctx:CanvasRenderingContext2D,art:'ripples'|'shore'|'boat'|'calm',t:number,elapsed:number,light:string){
 landscape(ctx,t,light);
 const water=ctx.createLinearGradient(0,270,0,height);
 water.addColorStop(0,'#5f827f');water.addColorStop(1,'#274b54');
 ctx.fillStyle=water;ctx.fillRect(0,270,width,210);
 const waveHeight=art==='calm'?Math.max(1,18-elapsed*1.7):art==='boat'?5:2;
 for(let i=0;i<34;i++){
  const y=273+i*6,x=(i*139)%620-30;
  const points=Array.from({length:21},(_,j)=>[x+j*25,y+Math.sin(j*.62+t*1.8+i*.6)*waveHeight] as const);
  line(ctx,points,i%7===0?'rgba(248,223,166,.35)':'rgba(160,192,177,.22)',1+i*.035);
 }
 if(art==='ripples'){
  for(let i=0;i<7;i++){
   const r=20+((elapsed*29+i*44)%310);
   ctx.beginPath();ctx.ellipse(510,351,r,r*.25,0,0,Math.PI*2);
   ctx.lineWidth=2;ctx.strokeStyle=`rgba(224,227,174,${.65*(1-r/340)})`;ctx.stroke();
  }
 }else if(art==='shore'){
  shape(ctx,[[0,392],[179,378],[338,408],[485,395],[660,447],[960,457],[960,480],[0,480]],'#9f9372');
  for(let i=0;i<140;i++)ellipse(ctx,(i*91)%width,445+(i*17)%38,1,1,'rgba(214,197,141,.73)');
 }else{
  const y=340+Math.sin(t*2)*waveHeight*.65;
  ctx.save();ctx.translate(510,y);ctx.rotate(Math.sin(t*1.7)*waveHeight*.007);
  shape(ctx,[[-117,0],[117,0],[72,32],[-86,30]],'#263735');
  line(ctx,[[12,-4],[12,-154]],'#313e3d',5);
  shape(ctx,[[8,-144],[1,-10],[-100,-11]],'#cbb182');
  shape(ctx,[[20,-126],[91,-17],[21,-11]],'#e0c799');
  ctx.restore();
 }
}

function objectScene(ctx:CanvasRenderingContext2D,art:'bread'|'door'|'lens'|'letter'|'measure'|'walls',t:number,elapsed:number,light:string){
 ctx.fillStyle='#3b3d35';ctx.fillRect(0,315,width,165);
 if(art==='door'||art==='walls'){
  const x=art==='door'?425:250,w=art==='door'?170:490;
  ctx.fillStyle='#736c5b';ctx.fillRect(x-72,103,w+144,264);
  for(let row=0;row<8;row++){
   for(let col=0;col<12;col++){
    const left=x-70+col*52-(row%2)*26;
    if(left<x-72||left+50>x+w+72)continue;
    ctx.fillStyle=(row+col)%3===0?'#777362':'#646457';
    ctx.fillRect(left,105+row*33,50,30);
   }
  }
  if(art==='walls'){
   for(let i=0;i<9;i++){ctx.fillStyle='#5b6055';ctx.fillRect(x-65+i*74,81,41,35);}
   return;
  }
  ctx.beginPath();ctx.moveTo(x,369);ctx.lineTo(x,208);
  ctx.quadraticCurveTo(x,142,x+w/2,137);ctx.quadraticCurveTo(x+w,142,x+w,208);
  ctx.lineTo(x+w,369);ctx.closePath();ctx.fillStyle='#3b3a30';ctx.fill();
  ctx.save();ctx.clip();
  for(let i=0;i<8;i++)line(ctx,[[x+18+i*21,143],[x+18+i*21,369]],'#675440',2);
  ctx.restore();
  ellipse(ctx,x+w-33,274,9,9,light);
  line(ctx,[[x+9,366],[x+w-9,366]],light,3);
  return;
 }
 ellipse(ctx,509,375,220,32,'rgba(19,28,29,.48)');
 if(art==='bread'){
  ellipse(ctx,515,332,170,66,'#887757');
  ellipse(ctx,501,324,150,52,'#b4a47b');
  ellipse(ctx,506,297,121,60,'#8d5e36',-.16);
  ellipse(ctx,498,286,113,51,'#cc9650',-.16);
  for(let i=0;i<3;i++)line(ctx,[[439+i*43,260],[451+i*42,272],[454+i*41,287]],'#f1cb87',6);
  for(let i=0;i<38;i++)ellipse(ctx,407+(i*31)%197,276+(i*17)%38,1.6,1.2,'rgba(115,73,41,.56)');
 }else if(art==='lens'){
  shape(ctx,[[315,316],[636,179],[662,228],[341,361]],'#ac864f');
  shape(ctx,[[318,319],[640,187],[648,199],[326,338]],'#dcb97d');
  ellipse(ctx,651,202,49,66,'#293c40',-.35);
  ellipse(ctx,651,202,40,57,'#829d98',-.35);
  ellipse(ctx,641,184,11,23,'rgba(235,221,169,.50)',-.35);
  for(let i=0;i<14;i++){
   const a=Math.max(.025,.18-elapsed*.003);
   ellipse(ctx,648+Math.sin(i*2+t)*22,202+Math.cos(i*5)*31,10,7,`rgba(241,229,188,${a})`);
  }
 }else if(art==='letter'){
  ctx.save();ctx.translate(513,291);ctx.rotate(-.11);
  ctx.fillStyle='#383b36';ctx.fillRect(-139,-76,278,152);
  ctx.fillStyle='#d9c394';ctx.fillRect(-131,-68,262,136);
  line(ctx,[[-126,-64],[0,22],[126,-64]],'#a48d70',2);
  line(ctx,[[-126,66],[-36,-3]],'#b5a080',1);
  line(ctx,[[126,66],[36,-3]],'#b5a080',1);
  ellipse(ctx,0,18,15,12,'#864b3c');
  ctx.restore();
 }else{
  ellipse(ctx,506,326,118,48,'#8d7d66');
  ellipse(ctx,506,306,118,47,'#baa685');
  ellipse(ctx,506,302,99,33,'#706552');
  line(ctx,[[495,294],[629,190]],'#ccb48c',27);
  line(ctx,[[492,292],[623,187]],'#e4cc9c',6);
  for(let i=0;i<29;i++)ellipse(ctx,450+(i*22)%117,293+(i*11)%25,2,1.6,light);
 }
}

function paint(ctx:CanvasRenderingContext2D,art:Art,t:number,elapsed:number){
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
  case 'road':case 'rain':case 'winter':case 'horizon':case 'nest':case 'wings':
   pathScene(ctx,art,t,light,elapsed);break;
  case 'ripples':case 'shore':case 'boat':case 'calm':
   waterScene(ctx,art,t,elapsed,light);break;
  case 'bread':case 'door':case 'lens':case 'letter':case 'measure':case 'walls':
   objectScene(ctx,art,t,elapsed,light);break;
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

export default function PrayerAnimation({audio,time,playing}:{
 audio:RefObject<HTMLAudioElement|null>;time:number;playing:boolean;
}){
 const figure=useRef<HTMLElement>(null);
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{figure.current?.scrollIntoView({block:'start'});},[]);
 const index=Math.max(0,captionScenes.findLastIndex(entry=>(cues[entry.cue]?.start??Infinity)<=time));
 const scene=captionScenes[index]??captionScenes[0];
 if(!scene)throw new Error('Missing Prayer animation scenes');
 const previous=captionScenes[index-1];
 const starts=captionStarts.get(scene.cue);
 const change=cues[scene.cue]?.start??0;
 const fadeDuration=Math.min(.75,(starts?.[0]??change)-change);
 const previousOpacity=fadeDuration>0?.5*Math.max(0,1-(time-change)/fadeDuration):0;
 const art=scene.art;
 useEffect(()=>{
  const context=canvas.current?.getContext('2d');
  if(!context)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame=0,last=-1;
  function draw(){
   if(!context)return;
   const position=audio.current?.currentTime??time;
   if(!playing||Math.abs(position-last)>=1/24){
    const elapsed=reduced?14:Math.max(0,position-change);
    paint(context,art,reduced?0:position,elapsed);last=position;
   }
   if(playing&&!reduced)frame=requestAnimationFrame(draw);
  }
  draw();
  return ()=>cancelAnimationFrame(frame);
 },[art,audio,change,playing,time]);
 return <figure ref={figure} className="prayer-animation" aria-label="Prayer, the Cure for Care animation">
  <div className="prayer-animation-stage">
   <canvas ref={canvas} width={width} height={height} aria-hidden="true"/>
  </div>
  <figcaption className="prayer-animation-caption">
   {previous&&previousOpacity>0&&<span className="prayer-animation-previous" aria-hidden="true" style={{opacity:previousOpacity}}>{previous.line}</span>}
   <span className="prayer-animation-line">{scene.phrases.map((phrase,part)=>{
    const visible=time>=(starts?.[part]??change);
    return <span key={part} aria-hidden={!visible} style={{visibility:visible?'visible':'hidden'}}>{part>0?' ':''}{phrase}</span>;
   })}</span>
   {'reference' in scene&&<small>{scene.reference}</small>}
  </figcaption>
 </figure>;
}
