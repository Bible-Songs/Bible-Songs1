// Canvas scenes for The Excellency of Christ (Jonathan Edwards). Drawn entirely by code, in the style of
// PrayerAnimation: gradient sky, warm halo, vignette and a fine grain. `variant` (the scene number) gives
// repeated scene types small differences so consecutive uses do not look identical.
import {width,height} from './SermonAnimation';

export const arts=['scroll','throne','lion','lamb','lionlamb','heavens','scales','dust','gate','meadow','hearth','path',
 'garden','cross','stable','star','sun','storm','temple','judgment','lamps','feast','fountain','door','flowers','union','dawn'] as const;
export type Art=(typeof arts)[number];
export const isArt=(value:string):value is Art=>(arts as readonly string[]).includes(value);

const colors={
 scroll:['#15202a','#4a4a3f','#e2b878'],throne:['#141c33','#5c5a73','#f4d38c'],lion:['#2a2418','#8a6a3e','#f6c56f'],
 lamb:['#203243','#7d958f','#f1dcae'],lionlamb:['#26341f','#86956b','#f2d394'],heavens:['#070d1f','#1f2c4c','#a8b6d8'],
 scales:['#171b26','#4b4f5e','#e2c48a'],dust:['#0a0f1e','#262c44','#b9a98a'],gate:['#1e2228','#5f5a4f','#e7b878'],
 meadow:['#2d4f5c','#8fb08a','#f6e3a3'],hearth:['#1b1512','#4b3326','#f2a85c'],path:['#24323f','#6f8578','#f3d79a'],
 garden:['#0d1424','#27344a','#b9c3d6'],cross:['#1c1a24','#5a4a4c','#e9b27a'],stable:['#0f1626','#2f3a52','#f2cf86'],
 star:['#0a1122','#22304c','#f0e2b0'],sun:['#2b3a52','#c48f62','#ffd88a'],storm:['#121b22','#33474d','#9fb2a9'],
 temple:['#211c19','#5b4d3e','#e0b073'],judgment:['#160f14','#4d2a26','#f0d6a0'],lamps:['#17130f','#3d2d20','#f5c46b'],
 feast:['#1a1612','#4a3a2a','#eec07a'],fountain:['#183038','#4f7c78','#d5e3c6'],door:['#151d1f','#3c4b47','#f0c27a'],
 flowers:['#2d4a3e','#8eae84','#f8e1a8'],union:['#121a33','#3e4f7a','#fbe4ad'],dawn:['#283a52','#a98a74','#ffd99a'],
} satisfies Record<Art,[string,string,string]>;

type Point=readonly [number,number];
function ellipse(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string,angle=0){
 c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(0,rx),Math.max(0,ry),angle,0,Math.PI*2);c.fill();
}
function line(c:CanvasRenderingContext2D,points:readonly Point[],color:string,weight:number){
 c.beginPath();points.forEach(([x,y],i)=>i===0?c.moveTo(x,y):c.lineTo(x,y));
 c.lineWidth=weight;c.strokeStyle=color;c.lineCap='round';c.stroke();
}
function shape(c:CanvasRenderingContext2D,points:readonly Point[],color:string){
 c.beginPath();points.forEach(([x,y],i)=>i===0?c.moveTo(x,y):c.lineTo(x,y));c.closePath();c.fillStyle=color;c.fill();
}
function glow(c:CanvasRenderingContext2D,x:number,y:number,r:number,color:string){
 const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');
 c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
}
const rand=(i:number)=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};

function hills(c:CanvasRenderingContext2D,tones:readonly string[],base=270,v=0){
 tones.forEach((tone,i)=>{
  c.beginPath();c.moveTo(0,height);
  for(let x=0;x<=width;x+=8)c.lineTo(x,base+i*34+Math.sin(x/150+i*1.7+v)*30+Math.sin(x/330+i+v*.5)*20);
  c.lineTo(width,height);c.fillStyle=tone;c.fill();
 });
}
function stars(c:CanvasRenderingContext2D,t:number,count:number,v:number,top=300){
 for(let i=0;i<count;i++){
  const tw=.35+.65*Math.abs(Math.sin(t*.8+i*1.3));
  ellipse(c,rand(i+v*31)*width,rand(i*7+v)*top,.6+rand(i*3)*1.4,.6+rand(i*3)*1.4,`rgba(244,236,214,${tw})`);
 }
}
function clouds(c:CanvasRenderingContext2D,t:number,color:string,y=110,v=0){
 for(let i=0;i<7;i++)ellipse(c,((i*183+t*4+v*60)%1160)-100,y+Math.sin(i*5+v)*48,90+i*6,10,color);
}
function rays(c:CanvasRenderingContext2D,x:number,y:number,t:number,color:string,n=14,len=420){
 c.save();c.translate(x,y);c.rotate(t*.02);
 for(let i=0;i<n;i++){c.rotate(Math.PI*2/n);shape(c,[[0,0],[len,-12],[len,12]],color);}
 c.restore();
}

function lion(c:CanvasRenderingContext2D,x:number,y:number,s:number,t:number,lying=false){
 c.save();c.translate(x,y);c.scale(s,s);
 const body='#b9894a',dark='#7a5530',mane='#8c5b2c';
 if(lying){ellipse(c,0,20,95,32,body);ellipse(c,70,40,40,9,body);}
 else{
  ellipse(c,0,0,95,42,body);
  for(const [lx,dx] of [[-62,-4],[-38,4],[42,-3],[66,5]] as const)c.fillStyle=body,c.fillRect(lx+dx-9,10,18,78);
 }
 line(c,[[-92,lying?16:-6],[-130,lying?10:-30+Math.sin(t*1.3)*6],[-142,lying?-2:-46+Math.sin(t*1.3)*6]],body,7);
 ellipse(c,-146,lying?-4:-50+Math.sin(t*1.3)*6,9,11,dark);
 const hx=lying?96:108,hy=lying?-12:-38;
 for(let i=0;i<26;i++){
  const a=i/26*Math.PI*2,r=46+Math.sin(i*3.1)*7+Math.sin(t*1.1+i)*2;
  line(c,[[hx,hy],[hx+Math.cos(a)*r,hy+Math.sin(a)*r]],i%2?mane:'#a06a33',13);
 }
 ellipse(c,hx+10,hy+4,28,30,'#c99a5a');ellipse(c,hx+31,hy+12,12,9,'#d8ad6c');
 ellipse(c,hx+38,hy+8,4,3,'#2a1b10');ellipse(c,hx+14,hy-6,3.2,3.2,'#2a1b10');
 c.restore();
}
function lamb(c:CanvasRenderingContext2D,x:number,y:number,s:number,t:number){
 c.save();c.translate(x,y+Math.sin(t*.9)*1.2);c.scale(s,s);
 for(const [lx] of [[-34],[-16],[18],[34]] as const){c.fillStyle='#3a3a36';c.fillRect(lx-4,18,8,40);}
 for(let i=0;i<14;i++)ellipse(c,-40+(i%7)*14,-6+Math.floor(i/7)*18+Math.sin(i)*3,18,16,i%3?'#f1ece0':'#e4dccb');
 ellipse(c,58,-14,17,13,'#ece6d8');ellipse(c,52,-22,7,4,'#cfc6b4',-.6);ellipse(c,64,-15,2.4,2.4,'#2a2a28');
 c.restore();
}
function figure(c:CanvasRenderingContext2D,x:number,y:number,s:number,color:string){
 c.save();c.translate(x,y);c.scale(s,s);ellipse(c,0,-58,11,12,color);
 shape(c,[[-16,-44],[16,-44],[24,0],[-24,0]],color);c.restore();
}

function paintArt(c:CanvasRenderingContext2D,art:Art,t:number,e:number,v:number,light:string){
 switch(art){
 case 'scroll':{
  ctxCandle(c,170,330,t,light);
  c.save();c.translate(560,300);c.rotate(-.05);
  ellipse(c,0,62,250,18,'rgba(10,14,16,.5)');
  shape(c,[[-200,-80],[200,-80],[200,60],[-200,60]],'#d9c08c');
  for(let i=0;i<9;i++)line(c,[[-170,-55+i*13],[150-(i%3)*30,-55+i*13]],'rgba(120,90,55,.45)',2);
  ellipse(c,-205,-10,18,74,'#b89660');ellipse(c,205,-10,18,74,'#b89660');
  for(let i=0;i<7;i++){
   const sx=-150+i*50,pulse=.5+.5*Math.sin(t*1.5+i);
   glow(c,sx,72,22,`rgba(240,120,90,${.15+.2*pulse})`);
   ellipse(c,sx,72,13,13,'#8e2f28');ellipse(c,sx-3,69,5,4,'rgba(255,180,150,.5)');
  }
  c.restore();break;}
 case 'throne':{
  rays(c,480,200,t,'rgba(255,228,160,.06)',18,520);glow(c,480,190,260,'rgba(255,224,150,.35)');
  c.save();c.beginPath();c.ellipse(480,250,260,190,0,Math.PI,Math.PI*2);c.lineWidth=14;
  const bow=c.createLinearGradient(220,0,740,0);bow.addColorStop(0,'rgba(120,200,160,.4)');bow.addColorStop(.5,'rgba(250,230,150,.45)');bow.addColorStop(1,'rgba(120,180,220,.4)');
  c.strokeStyle=bow;c.stroke();c.restore();
  for(let i=0;i<3;i++)shape(c,[[360-i*40,360+i*24],[600+i*40,360+i*24],[620+i*40,384+i*24],[340-i*40,384+i*24]],['#c9a868','#a88a52','#866c40'][i]??'#866c40');
  shape(c,[[420,360],[420,170],[450,140],[510,140],[540,170],[540,360]],'#e7c784');
  shape(c,[[440,360],[440,190],[520,190],[520,360]],'#f6dfa3');
  for(let i=0;i<24;i++){
   const a=Math.PI+(i+.5)/24*Math.PI,cx=480+Math.cos(a)*300,cy=330+Math.sin(a)*150;
   shape(c,[[cx-8,cy+5],[cx-8,cy-3],[cx-4,cy+1],[cx,cy-6],[cx+4,cy+1],[cx+8,cy-3],[cx+8,cy+5]],'#f2d48a');
  }
  if(v%2===0)lamb(c,480,330-(Math.sin(t)*2),.55,t);
  break;}
 case 'lion':hills(c,['#8a6a3e','#6d5130','#4f3a22'],300,v);glow(c,700,170,160,'rgba(255,214,140,.5)');ellipse(c,700,170,54,54,light);
  shape(c,[[280,330],[640,330],[700,480],[220,480]],'#5a4328');lion(c,450,250,1,t);break;
 case 'lamb':hills(c,['#7f9c86','#5f8270','#476a5a'],300,v);clouds(c,t,'rgba(250,240,220,.14)',110,v);
  glow(c,620,190,200,'rgba(255,236,190,.35)');lamb(c,470,330,1.3,t);break;
 case 'lionlamb':hills(c,['#8fa27a','#6f8a63','#53704d'],300,v);glow(c,480,160,240,'rgba(255,230,170,.4)');
  lion(c,340,330,.8,t,true);lamb(c,620,350,1,t);break;
 case 'heavens':{
  stars(c,t,160,v,480);
  const band=c.createLinearGradient(0,80,width,400);band.addColorStop(0,'rgba(0,0,0,0)');band.addColorStop(.5,'rgba(190,200,240,.12)');band.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=band;c.fillRect(0,0,width,height);
  const look=v%3;
  if(look===0){ // column of light from above
   glow(c,480+Math.sin(v)*160,90,220,`rgba(255,${220+v%30},170,.32)`);
   const col=c.createLinearGradient(0,0,0,height);col.addColorStop(0,'rgba(255,230,170,.22)');col.addColorStop(1,'rgba(255,230,170,0)');
   c.fillStyle=col;c.fillRect(440+Math.sin(v)*160,60,80,height);
  }else if(look===1){ // crescent moon and a slowly turning constellation
   ellipse(c,250,110,38,38,'#eee6cf');ellipse(c,266,100,34,34,'#0b1124');glow(c,250,110,110,'rgba(238,230,207,.18)');
   c.save();c.translate(650,170);c.rotate(t*.01);
   const pts=[[-90,-40],[-40,-70],[10,-30],[60,-60],[100,-10],[40,30],[-20,10]] as const;
   line(c,pts,'rgba(230,224,200,.35)',1.2);for(const [x,y] of pts)glow(c,x,y,10,'rgba(255,248,225,.8)');c.restore();
  }else{ // soft aurora bands
   for(let k=0;k<4;k++){
    c.beginPath();c.moveTo(0,140+k*30);
    for(let x=0;x<=width;x+=10)c.lineTo(x,140+k*30+Math.sin(x/120+t*.3+k)*28);
    c.lineWidth=30-k*5;c.strokeStyle=[`rgba(150,220,190,.12)`,`rgba(170,200,240,.10)`,`rgba(240,220,170,.10)`,`rgba(200,170,230,.08)`][k]??'rgba(200,200,200,.1)';c.stroke();
   }
  }
  hills(c,['#141b2c','#0d1220'],400,v);break;}
 case 'scales':case 'dust':{
  if(art==='dust')stars(c,t,120,v,480);
  glow(c,480,90,240,'rgba(255,224,160,.28)');
  const tilt=Math.sin(t*.6)*.05+(art==='dust'?-.12:0);
  line(c,[[480,110],[480,330]],'#c9a868',8);shape(c,[[430,340],[530,340],[500,320],[460,320]],'#a88a52');
  c.save();c.translate(480,120);c.rotate(tilt);line(c,[[-190,0],[190,0]],'#e2c48a',7);
  for(const side of [-1,1]){
   const px=side*190;line(c,[[px,0],[px-40,90]],'rgba(226,196,138,.7)',2);line(c,[[px,0],[px+40,90]],'rgba(226,196,138,.7)',2);
   c.save();c.translate(px,95);c.rotate(-tilt);ellipse(c,0,0,52,12,'#d4b27a');
   if(art==='dust'&&side===1)for(let i=0;i<10;i++)ellipse(c,-20+i*4,-4,1.2,1.2,'#f4e2b6');
   if(art==='scales'&&side===-1)ellipse(c,0,-14,18,16,'#f5e3b4');
   c.restore();
  }
  c.restore();if(art==='dust')for(let i=0;i<30;i++)ellipse(c,((i*97+t*6)%width),(i*53+t*3)%height,1,1,'rgba(240,226,190,.5)');
  break;}
 case 'gate':{
  shape(c,[[0,480],[0,140],[300,140],[300,480]],'#4a453b');shape(c,[[660,480],[660,140],[960,140],[960,480]],'#4a453b');
  for(let r=0;r<10;r++)for(let k=0;k<6;k++){c.fillStyle=(r+k)%2?'#565044':'#4f4a3f';c.fillRect(k*52-(r%2)*26,145+r*34,50,32);c.fillRect(660+k*52-(r%2)*26,145+r*34,50,32);}
  c.beginPath();c.moveTo(300,480);c.lineTo(300,250);c.quadraticCurveTo(480,90,660,250);c.lineTo(660,480);c.fillStyle='#e9c48a';c.fill();
  glow(c,480,300,260,'rgba(255,220,160,.5)');ellipse(c,480,470,300,30,'#7c6a50');
  figure(c,360,440,1,'#2b2a26');
  const walk=Math.min(1,e/12);figure(c,620-walk*120,440,1.15,'#3b2f22');glow(c,620-walk*120,380,70,'rgba(255,230,170,.35)');
  break;}
 case 'meadow':case 'flowers':{
  hills(c,['#9cbf8d','#7aa574','#5c8a5e'],290,v);clouds(c,t,'rgba(255,250,235,.18)',100,v);glow(c,720,120,140,'rgba(255,240,190,.5)');
  for(let i=0;i<120;i++){
   const x=rand(i+v)*width,y=330+rand(i*5)*150,sway=Math.sin(t*1.2+i)*3;
   line(c,[[x,y+12],[x+sway,y]],'#3f6b45',1.5);ellipse(c,x+sway,y,3+rand(i)*2,3+rand(i)*2,['#f6e7a8','#f3c1c9','#ffffff','#e9a6a0'][i%4]??'#fff');
  }
  if(art==='flowers'){
   c.save();c.translate(300,300);line(c,[[0,180],[6,0]],'#3e6a42',6);for(let i=0;i<8;i++)ellipse(c,6+Math.cos(i)*14,-2+Math.sin(i)*14,16,11,'#c94f5d',i);ellipse(c,6,0,10,10,'#a83545');c.restore();
   c.save();c.translate(660,290);line(c,[[0,190],[0,0]],'#3e6a42',6);for(let i=0;i<6;i++)ellipse(c,Math.cos(i*1.05)*22,Math.sin(i*1.05)*22,24,9,'#fbf7ee',i*1.05);ellipse(c,0,0,7,7,'#e8c34a');c.restore();
  }else lamb(c,500,380,.8,t);
  break;}
 case 'hearth':{
  c.fillStyle='#3a2a1f';c.fillRect(0,330,width,150);shape(c,[[300,330],[300,140],[660,140],[660,330]],'#5a4434');
  c.beginPath();c.moveTo(360,330);c.lineTo(360,220);c.quadraticCurveTo(480,150,600,220);c.lineTo(600,330);c.fillStyle='#1a120d';c.fill();
  glow(c,480,300,260,'rgba(255,170,80,.45)');
  for(let i=0;i<7;i++){const fx=420+i*20,h=50+Math.sin(t*6+i*2)*14+(i%3)*12;shape(c,[[fx-14,326],[fx,326-h],[fx+14,326]],i%2?'#f2a24e':'#f7cc6e');}
  for(const x of [200,760] as const){shape(c,[[x-40,330],[x-40,230],[x+40,230],[x+40,330]],'#4b3526');ellipse(c,x,300,38,10,'#6b4a33');}
  break;}
 case 'path':{
  hills(c,['#8a9b84','#6d8270','#55695a'],250,v);glow(c,690,120,150,'rgba(255,230,170,.55)');ellipse(c,690,120,36,36,light);
  shape(c,[[430,480],[520,480],[600,330],[680,170],[690,150],[672,170],[560,330]],'#cfc19a');
  const step=(e*.03)%1;figure(c,520+step*60,480-step*120,.7,'#2c2a24');
  break;}
 case 'garden':{
  stars(c,t,70,v,250);ellipse(c,760,90,32,32,'#e8e6d8');glow(c,760,90,90,'rgba(230,230,210,.25)');
  hills(c,['#1f2a3a','#172030'],300,v);
  for(let i=0;i<5;i++){const x=120+i*180;line(c,[[x,420],[x+10,300]],'#141c26',14);for(let k=0;k<10;k++)ellipse(c,x+10+Math.cos(k)*60,280+Math.sin(k*1.7)*40,40,22,'#18232f');}
  ellipse(c,480,430,70,16,'#2a3342');shape(c,[[455,390],[505,390],[495,420],[465,420]],'#b99a6a');
  glow(c,480,400,60+Math.sin(t*2)*6,'rgba(240,210,150,.35)');break;}
 case 'cross':{
  glow(c,480,150,300,'rgba(240,170,110,.35)');rays(c,480,150,t*.3,'rgba(255,200,150,.05)',12,500);
  hills(c,['#3a2f33','#2a2328'],310,v);
  for(const [x,s] of [[300,.75],[480,1],[660,.75]] as const){c.fillStyle='#17131a';c.fillRect(x-7*s,320-230*s,14*s,230*s);c.fillRect(x-60*s,320-185*s,120*s,13*s);}
  break;}
 case 'stable':case 'star':{
  stars(c,t,110,v,330);
  const sx=art==='star'?480:520,sy=art==='star'?110:80;
  rays(c,sx,sy,t*.5,'rgba(255,240,200,.08)',8,180);glow(c,sx,sy,90,'rgba(255,240,200,.7)');ellipse(c,sx,sy,6,6,'#fffbe8');
  hills(c,['#1d2638','#151c2b'],330,v);
  if(art==='stable'){
   const beam=c.createLinearGradient(0,sy,0,400);beam.addColorStop(0,'rgba(255,236,190,.35)');beam.addColorStop(1,'rgba(255,236,190,0)');
   c.fillStyle=beam;c.beginPath();c.moveTo(sx-4,sy);c.lineTo(sx+4,sy);c.lineTo(600,380);c.lineTo(440,380);c.fill();
   shape(c,[[360,380],[380,250],[520,190],[660,250],[680,380]],'#3a3127');shape(c,[[400,380],[400,280],[640,280],[640,380]],'#20190f');
   glow(c,520,350,120,'rgba(255,210,130,.55)');shape(c,[[470,370],[570,370],[555,340],[485,340]],'#9a7a46');
   for(let i=0;i<12;i++)line(c,[[480+i*7,342],[476+i*8,330]],'#e9c278',2);
  }else for(let i=0;i<3;i++){const x=180+i*90+e*2;figure(c,x,400,.8,'#121722');}
  break;}
 case 'sun':case 'dawn':{
  const sy=art==='sun'?210:260-Math.min(60,e*1.5);
  glow(c,480,sy,300,'rgba(255,214,150,.55)');rays(c,480,sy,t,'rgba(255,230,170,.07)',16,600);ellipse(c,480,sy,art==='sun'?70:58,art==='sun'?70:58,light);
  clouds(c,t,'rgba(255,225,190,.2)',150,v);hills(c,['#7d6f6a','#5d5658','#423f45'],310,v);break;}
 case 'storm':{
  const calm=Math.max(0,Math.min(1,(e-8)/10));
  const amp=26*(1-calm)+3;clouds(c,t*3,`rgba(30,40,46,${.5*(1-calm)})`,90,v);
  if(calm<.3&&Math.sin(t*2.3)>.97)c.fillStyle='rgba(230,240,255,.25)',c.fillRect(0,0,width,height);
  if(calm>0)glow(c,480,140,220,`rgba(255,230,180,${.4*calm})`);
  c.fillStyle='#24424a';c.fillRect(0,300,width,180);
  for(let i=0;i<14;i++){const y=300+i*13;line(c,Array.from({length:25},(_,j)=>[j*42-20,y+Math.sin(j*.8+t*2+i)*amp*(.5+i/28)] as const),`rgba(170,205,200,${.25+i*.02})`,2);}
  c.save();c.translate(480,300+Math.sin(t*2)*amp*.5);c.rotate(Math.sin(t*1.6)*amp*.008);
  shape(c,[[-90,0],[90,0],[60,26],[-66,26]],'#2a211a');line(c,[[0,-2],[0,-110]],'#3a2e24',5);shape(c,[[3,-104],[3,-12],[62,-12]],'#cdb98d');c.restore();
  break;}
 case 'temple':{
  glow(c,480,200,300,'rgba(240,180,110,.3)');c.fillStyle='#3b3028';c.fillRect(0,400,width,80);
  const fall=Math.min(1,e/20);
  shape(c,[[180,120],[780,120],[800,150],[160,150]],'#8a7458');
  for(const [x,lean] of [[330,-1],[630,1]] as const){
   c.save();c.translate(x,400);c.rotate(lean*fall*.12);c.fillStyle='#a48b67';c.fillRect(-28,-250,56,250);
   for(let k=0;k<5;k++)line(c,[[-28+k*14,-250],[-28+k*14,0]],'rgba(70,55,40,.4)',2);c.restore();
  }
  for(let i=0;i<9;i++){const fy=150+((e*30+i*60)%260)*fall;c.save();c.translate(260+i*55,fy);c.rotate(i+e*.5*fall);c.fillStyle='#8f7656';c.fillRect(-12,-9,24,18);c.restore();}
  figure(c,480,400,1.3,'#20180f');break;}
 case 'judgment':{
  glow(c,480,140,280,'rgba(255,250,235,.55)');rays(c,480,140,t*.4,'rgba(255,255,240,.07)',20,520);
  for(let i=0;i<3;i++)shape(c,[[400-i*30,232+i*16],[560+i*30,232+i*16],[574+i*30,248+i*16],[386-i*30,248+i*16]],['#efe6d2','#ddd2bb','#c8bca4'][i]??'#c8bca4');
  shape(c,[[425,232],[425,80],[450,56],[510,56],[535,80],[535,232]],'#fbf6ea');
  shape(c,[[402,232],[402,170],[425,160],[425,232]],'#f1e9d8');shape(c,[[558,232],[558,170],[535,160],[535,232]],'#f1e9d8');
  shape(c,[[442,232],[442,96],[518,96],[518,232]],'#fffdf6');
  for(let i=0;i<5;i++)shape(c,[[i*240-120,480],[i*240,280+(i%2)*40],[i*240+130,480]],['#2a1d22','#21171b'][i%2]??'#21171b');
  const fire=c.createLinearGradient(0,380,0,480);fire.addColorStop(0,'rgba(220,90,50,0)');fire.addColorStop(1,`rgba(220,90,50,${.35+.1*Math.sin(t*3)})`);
  c.fillStyle=fire;c.fillRect(0,380,width,100);break;}
 case 'lamps':{
  c.fillStyle='#2c2118';c.fillRect(0,330,width,150);
  for(let i=0;i<7;i++){
   const x=150+i*110,y=320;glow(c,x,y-34,60,'rgba(255,200,110,.4)');
   ellipse(c,x,y,32,12,'#9a7444');shape(c,[[x+28,y-2],[x+44,y-10],[x+30,y+4]],'#9a7444');
   const f=10+Math.sin(t*7+i)*3;shape(c,[[x+40,y-10],[x+44,y-10-f*2],[x+48,y-10]],'#ffd27a');
  }
  if(v%2)glow(c,480,140,200,'rgba(255,236,190,.25)');break;}
 case 'feast':{
  c.fillStyle='#3a2a1d';c.fillRect(0,320,width,160);shape(c,[[120,320],[840,320],[900,400],[60,400]],'#6e5236');
  glow(c,480,240,260,'rgba(255,200,130,.35)');
  ellipse(c,380,312,90,30,'#c68f4d',-.05);for(let i=0;i<3;i++)line(c,[[330+i*40,296],[345+i*40,308]],'#f1cb87',5);
  shape(c,[[560,320],[600,320],[592,300],[608,250],[552,250],[568,300]],'#c9b07a');ellipse(c,580,252,28,8,'#7a2232');
  line(c,[[720,320],[720,230]],'#c9b07a',8);shape(c,[[712,232],[728,232],[720,205+Math.sin(t*6)*3]],'#ffd27a');break;}
 case 'fountain':{
  hills(c,['#5f7f74','#4b6b62','#3a5a52'],260,v);shape(c,[[300,330],[360,170],[460,140],[520,200],[480,330]],'#4a4f48');
  c.fillStyle='#4f8a8c';c.fillRect(0,350,width,130);
  for(let i=0;i<8;i++){const y=(t*120+i*40)%180;ellipse(c,470+Math.sin(i)*6,200+y,6,12,'rgba(210,235,235,.6)');}
  for(let i=0;i<6;i++){const r=20+((e*25+i*40)%260);c.beginPath();c.ellipse(470,380,r,r*.22,0,0,Math.PI*2);c.strokeStyle=`rgba(220,240,230,${.6*(1-r/280)})`;c.lineWidth=2;c.stroke();}
  glow(c,700,120,140,'rgba(255,240,200,.45)');break;}
 case 'door':{
  c.fillStyle='#2a2420';c.fillRect(0,370,width,110);c.fillStyle='#4c4a42';c.fillRect(300,80,360,290);
  shape(c,[[380,370],[380,140],[580,140],[580,370]],'#5b3f28');for(let i=0;i<6;i++)line(c,[[392+i*34,150],[392+i*34,362]],'#4a3220',3);
  const knock=Math.max(0,Math.sin(t*3))**20;ellipse(c,550,250,9,9,'#c9a25a');
  glow(c,480,372,200,`rgba(255,215,140,${.25+.25*knock})`);line(c,[[380,370],[580,370]],'#ffd890',3);
  figure(c,700,370,1.4,'#1d1a16');glow(c,700,280,80,'rgba(255,230,170,.25)');break;}
 case 'union':{
  stars(c,t,90,v,480);
  const r=110+Math.sin(t*.5)*6,d=Math.max(30,90-e*2);
  c.save();c.globalCompositeOperation='lighter';
  for(let i=0;i<3;i++){const a=i/3*Math.PI*2-Math.PI/2;glow(c,480+Math.cos(a)*d,220+Math.sin(a)*d,r,'rgba(255,214,150,.45)');}
  c.restore();
  for(let i=0;i<40;i++){const a=i*2.4+t*.1,rr=240-((e*8+i*9)%200);ellipse(c,480+Math.cos(a)*rr,220+Math.sin(a)*rr*.6,1.8,1.8,'rgba(255,240,210,.8)');}
  break;}
 }
}
function ctxCandle(c:CanvasRenderingContext2D,x:number,y:number,t:number,light:string){
 glow(c,x,y-60,140,'rgba(255,200,120,.3)');c.fillStyle='#e8d6ac';c.fillRect(x-10,y-60,20,60);
 ellipse(c,x+Math.sin(t*5)*1.5,y-72,6,15,light);
}

export function paintExcellency(c:CanvasRenderingContext2D,art:string,t:number,elapsed:number,variant:number){
 if(!isArt(art))throw new Error('Unknown Excellency scene: '+art);
 const [top,middle,light]=colors[art];
 const sky=c.createLinearGradient(0,0,0,height);sky.addColorStop(0,top);sky.addColorStop(.65,middle);sky.addColorStop(1,light);
 c.fillStyle=sky;c.fillRect(0,0,width,height);
 // gentle camera: a slow zoom and drift over the scene so still objects never look frozen
 const drift=Math.min(1,elapsed/40),dir=variant%2?1:-1;
 c.save();c.translate(480,240);c.scale(1+.06*drift,1+.06*drift);c.translate(-480+dir*14*drift,-240-6*drift);
 paintArt(c,art,t,elapsed,variant,light);
 c.restore();
 const vignette=c.createRadialGradient(480,215,140,480,215,570);
 vignette.addColorStop(0,'rgba(10,18,26,0)');vignette.addColorStop(1,'rgba(10,18,26,.55)');
 c.fillStyle=vignette;c.fillRect(0,0,width,height);
 c.fillStyle='rgba(255,224,170,.10)';for(let i=0;i<900;i++)c.fillRect((i*107.117)%width,(i*37.731)%height,1.2,1);
}
