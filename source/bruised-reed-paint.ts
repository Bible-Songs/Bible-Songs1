import {createExcellencyPainter} from './excellency-paint';
import type {Painter} from './SermonAnimation';

type Subject={readonly art:string;readonly line:string};
type Recipe={setting:string;objects:readonly string[]};
const ochre='#c6a46e',cream='#ebd7ac',green='#798f66';
const recipes:Readonly<Record<string,Recipe>>={
 anchor:{setting:'sea',objects:[]},banner:{setting:'court',objects:['soldier','banner','shield']},
 boat:{setting:'sea',objects:['boat','traveler']},whale:{setting:'sea',objects:['whale']},book:{setting:'table',objects:['scroll','quill']},
 bound:{setting:'chamber',objects:['bound','door']},bread:{setting:'table',objects:['bread','basket']},
 burden:{setting:'road',objects:['burden','visitor']},camp:{setting:'meadow',objects:['tents','soldier']},
 candles:{setting:'temple',objects:[]},care:{setting:'chamber',objects:['visitor','kneeling']},
 cedar:{setting:'garden',objects:[]},city:{setting:'city',objects:['cityscape','throne']},
 clock:{setting:'workshop',objects:[]},cloud:{setting:'meadow',objects:['sun','clouds']},
 cross:{setting:'mountain',objects:['cross','kneeling']},crown:{setting:'hall',objects:['crown','palm']},
 cup:{setting:'table',objects:['cup','basket']},door:{setting:'chamber',objects:['door','knocker']},
 dove:{setting:'meadow',objects:['dove','olive']},dust:{setting:'chamber',objects:[]},
 fire:{setting:'workshop',objects:[]},firewater:{setting:'coast',objects:[]},
 flowers:{setting:'garden',objects:[]},foundation:{setting:'workshop',objects:['foundation','house']},
 fountain:{setting:'garden',objects:['rock','fountain']},furnace:{setting:'workshop',objects:['furnace','gold']},
 gift:{setting:'table',objects:['gift','visitor']},glass:{setting:'table',objects:[]},
 gold:{setting:'table',objects:['gold','scales']},harp:{setting:'chamber',objects:['harp']},
 herbs:{setting:'table',objects:[]},home:{setting:'road',objects:['house','parent','traveler']},
 knot:{setting:'table',objects:[]},lamb:{setting:'meadow',objects:['lamb']},
 lamp:{setting:'chamber',objects:[]},lock:{setting:'workshop',objects:[]},
 medicine:{setting:'chamber',objects:[]},mother:{setting:'chamber',objects:['parent','child']},
 mountain:{setting:'mountain',objects:['rock','mountains']},oak:{setting:'meadow',objects:[]},
 oil:{setting:'table',objects:[]},pearl:{setting:'table',objects:['pearl']},
 plough:{setting:'meadow',objects:[]},potter:{setting:'workshop',objects:[]},
 prayer:{setting:'chamber',objects:['kneeling','scroll']},reed:{setting:'coast',objects:[]},
 rest:{setting:'garden',objects:['sleeper','olive']},rings:{setting:'table',objects:['rings']},
 road:{setting:'road',objects:['roadpost','rubble','traveler']},rock:{setting:'coast',objects:['rock','waves']},
 roots:{setting:'meadow',objects:[]},rowing:{setting:'sea',objects:[]},
 sapling:{setting:'garden',objects:[]},scales:{setting:'table',objects:['scales','gold']},
 seals:{setting:'table',objects:['scroll','seals']},seed:{setting:'garden',objects:[]},
 serpent:{setting:'garden',objects:['tree','serpent']},shepherd:{setting:'meadow',objects:['shepherd','lamb','flock']},
 shield:{setting:'court',objects:['shield','sword']},soldier:{setting:'court',objects:['soldier','shield']},
 sword:{setting:'court',objects:['sword','shield']},teacher:{setting:'chamber',objects:['teacher','visitor','scroll']},
 temple:{setting:'temple',objects:['pillars','scroll']},throne:{setting:'hall',objects:['throne','scroll']},
 tomb:{setting:'garden',objects:['tomb','visitor']},torch:{setting:'chamber',objects:[]},
 towel:{setting:'chamber',objects:['towel','parent','child']},traveler:{setting:'road',objects:['traveler','visitor']},
 trumpet:{setting:'court',objects:['trumpet','scroll']},victory:{setting:'court',objects:['banner','crown','palm']},
 vine:{setting:'garden',objects:['tree','grapevine']},water:{setting:'coast',objects:[]},
 welcome:{setting:'chamber',objects:['blessing','traveler']},wick:{setting:'table',objects:[]},
 wine:{setting:'table',objects:['winejug','jar']},yoke:{setting:'workshop',objects:[]},
};
function oval(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string,angle=0){
 c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fill();
}
function line(c:CanvasRenderingContext2D,points:readonly (readonly [number,number])[],color:string,width=3){
 c.beginPath();for(const [i,p]of points.entries()){if(i===0)c.moveTo(...p);else c.lineTo(...p);}c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();
}
function polygon(c:CanvasRenderingContext2D,points:readonly (readonly [number,number])[],color:string){
 c.beginPath();for(const [i,p]of points.entries()){if(i===0)c.moveTo(...p);else c.lineTo(...p);}c.closePath();c.fillStyle=color;c.fill();
}
function glow(c:CanvasRenderingContext2D,x:number,y:number,r:number,alpha=.35){
 const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(243,196,102,${alpha})`);g.addColorStop(1,'rgba(243,196,102,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
}
function flame(c:CanvasRenderingContext2D,x:number,y:number,size:number,t:number){
 const sway=Math.sin(t*2.1)*size*.13;glow(c,x,y-size*.5,size*2,.25);
 c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-size*.7,y-size*.4,x+size*.2+sway,y-size*1.35,x+size*.14+sway,y-size*1.7);c.bezierCurveTo(x+size*.7,y-size*.7,x+size*.65,y-size*.1,x,y);c.fillStyle='#dba14e';c.fill();
 oval(c,x+size*.12,y-size*.45,size*.19,size*.4,'#ffe3a3',sway*.02);
}
function smoke(c:CanvasRenderingContext2D,x:number,y:number,t:number,scale=1){
 for(let i=0;i<5;i++){
  const phase=(t*.13+i*.2)%1,yy=y-phase*155*scale,xx=x+Math.sin(phase*7+i)*20*scale;
  oval(c,xx,yy,(8+phase*19)*scale,(7+phase*11)*scale,`rgba(196,198,186,${.17*(1-phase)})`);
 }
}
function lamp(c:CanvasRenderingContext2D,x:number,y:number,scale:number,t:number,small=false){
 c.save();c.translate(x,y);c.scale(scale,scale);oval(c,0,3,109,15,'rgba(16,25,25,.35)');
 polygon(c,[[-104,-37],[-79,4],[60,4],[96,-27],[118,-41],[74,-43]],'#927045');
 oval(c,-4,-38,98,25,'#b2945e');oval(c,-4,-40,74,15,'#473c30');
 c.strokeStyle='#c7ac72';c.lineWidth=12;c.beginPath();c.ellipse(-105,-33,24,23,0,0,Math.PI*2);c.stroke();
 polygon(c,[[40,-53],[113,-58],[97,-28],[58,-25]],'#b79a67');line(c,[[99,-50],[111,-71]],'#493d30',7);
 line(c,[[99,-50],[110,-67]],'#cdbc96',2);oval(c,111,-70,5,3,'#df8a47');
 smoke(c,112,-75,t,.9);flame(c,111,-70,small?8:20,t);
 line(c,[[-72,-24],[-45,-13],[35,-13],[59,-23]],'#d4b982',3);c.restore();
}
function reed(c:CanvasRenderingContext2D,t:number){
 // A bent hollow stalk, with a visible bruised joint and unsevered fibres.
 for(let i=0;i<11;i++){
  const x=102+i*72,h=100+(i%4)*24;
  line(c,[[x,410],[x+Math.sin(t*.4+i)*5,410-h]],'#617765',3);
  oval(c,x,406-h,5,24,'#6e7452',-.15);
 }
 c.save();c.translate(465,409);c.rotate(Math.sin(t*.36)*.014);
 c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-8,-66,-13,-109,-3,-170);c.lineTo(76,-117);c.bezierCurveTo(107,-92,130,-67,146,-30);c.strokeStyle='#acb47b';c.lineWidth=12;c.lineCap='round';c.stroke();
 line(c,[[-1,-168],[21,-153]],'#685139',17);
 for(let i=0;i<5;i++)line(c,[[-8+i*4,-176],[5+i*4,-155],[25+i*4,-148]],'#d5c38c',1.4);
 for(const y of [-39,-94,-141])line(c,[[-7,y],[5,y-1]],'#d0ce95',3);
 polygon(c,[[-5,-70],[-65,-132],[-46,-92],[-6,-58]],'#91a575');
 polygon(c,[[84,-109],[149,-112],[112,-87],[92,-94]],'#91a575');
 oval(c,146,-35,9,36,'#927851',-.38);line(c,[[146,-5],[157,18]],'#9eaa77',5);
 c.restore();
 // Intact stalks frame the damaged reed; none are snapped off or discarded.
}
function seed(c:CanvasRenderingContext2D,x:number,y:number,s:number){
 oval(c,x,y,s*.65,s,'#986f40',.28);oval(c,x-1,y-s*.45,s*.75,s*.5,'#6b573b',.28);
 line(c,[[x-2,y-s*.8],[x+2,y-s*1.2]],'#8a794e',Math.max(2,s*.12));
}
function tree(c:CanvasRenderingContext2D,t:number,kind:string){
 const big=kind==='oak'||kind==='cedar',root=kind==='roots';
 if(root){
  polygon(c,[[130,330],[826,330],[826,470],[130,470]],'#5c4d3a');
  for(let i=0;i<15;i++)oval(c,155+i*44,361+(i%4)*21,4,2,'#8c7955');
  line(c,[[478,334],[472,373],[429,412],[392,436]],'#b89d6a',8);line(c,[[476,373],[512,403],[565,432]],'#b89d6a',6);
  line(c,[[466,382],[466,433],[489,460]],'#b89d6a',4);
 }
 const base=root?335:405,height=big?235:123;
 line(c,[[480,base],[476,base-height]],'#8b7550',big?25:7);
 const branches=kind==='cedar'?9:6;
 for(let i=0;i<branches;i++){
  const y=base-height+i*(height/branches),span=big?45+i*15:19+i*8;
  line(c,[[478,y+31],[478-span,y]],'#8b7550',big?8:3);line(c,[[478,y+31],[478+span,y-6]],'#8b7550',big?8:3);
  const sway=Math.sin(t*.35+i)*2;
  if(kind==='cedar'){
   polygon(c,[[478-span-28,y+13],[478,y-22],[478+span+28,y+13]],i%2?'#486952':'#688362');
  }else{
   oval(c,478-span+sway,y,span*.62+11,big?36:16,i%2?'#759368':'#577b5b',-.12);
   oval(c,478+span+sway,y-8,span*.62+11,big?36:16,i%2?'#6b8c61':'#87a271',.12);
  }
 }
 if(!root){seed(c,248,401,big?22:15);seed(c,285,410,11);}
 if(kind==='sapling'){
  line(c,[[376,410],[376,252]],'#ac9469',6);line(c,[[377,309],[473,309]],'#d0c29d',3);
  line(c,[[605,410],[605,252]],'#ac9469',6);line(c,[[481,309],[605,309]],'#d0c29d',3);
 }
}
function gear(c:CanvasRenderingContext2D,x:number,y:number,r:number,t:number){
 c.save();c.translate(x,y);c.rotate(t);for(let i=0;i<14;i++){c.rotate(Math.PI/7);c.fillStyle='#b39763';c.fillRect(r-4,-6,13,12);}
 c.strokeStyle='#d0b780';c.lineWidth=9;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.stroke();
 for(let i=0;i<6;i++){const a=i*Math.PI/3;line(c,[[0,0],[Math.cos(a)*r,Math.sin(a)*r]],'#b39763',5);}oval(c,0,0,9,9,'#67553c');c.restore();
}
function clock(c:CanvasRenderingContext2D,t:number){
 c.fillStyle='#6c5039';c.fillRect(328,124,306,296);c.fillStyle='#3b3b32';c.fillRect(342,137,278,269);
 oval(c,480,215,89,89,'#ba9b66');oval(c,480,215,78,78,'#e6d5af');
 for(let i=0;i<12;i++){const a=i*Math.PI/6;line(c,[[480+Math.sin(a)*63,215-Math.cos(a)*63],[480+Math.sin(a)*70,215-Math.cos(a)*70]],'#5d5545',3);}
 line(c,[[480,215],[446,192]],'#514937',7);line(c,[[480,215],[493,164]],'#514937',5);oval(c,480,215,6,6,'#9c7949');
 gear(c,422,346,35,t*.07);gear(c,493,352,29,-t*.085);gear(c,552,338,29,t*.085);
 const swing=Math.sin(t*1.7)*.09;c.save();c.translate(480,310);c.rotate(swing);line(c,[[0,0],[0,91]],'#c9ad71',4);oval(c,0,89,17,17,'#d4b56e');c.restore();
}
function lock(c:CanvasRenderingContext2D){
 c.strokeStyle='#b6b5a2';c.lineWidth=20;c.beginPath();c.moveTo(401,272);c.lineTo(401,210);c.bezierCurveTo(401,125,529,125,529,210);c.lineTo(529,272);c.stroke();
 c.fillStyle='#987745';c.fillRect(371,249,192,139);c.fillStyle='#c4a16b';c.fillRect(383,259,166,112);
 oval(c,468,301,13,15,'#433d32');polygon(c,[[461,308],[453,342],[481,342],[474,308]],'#433d32');
 oval(c,676,324,24,24,'#bca16e');oval(c,676,324,13,13,'#3b443a');line(c,[[652,324],[582,324]],'#c7ac79',9);line(c,[[592,326],[592,344]],'#c7ac79',9);line(c,[[608,325],[608,338]],'#c7ac79',9);
}
function anchor(c:CanvasRenderingContext2D,t:number){
 for(let i=0;i<9;i++){const x=488+Math.sin(i)*4,y=86+i*20;c.strokeStyle='#b6b3a0';c.lineWidth=3;c.beginPath();c.ellipse(x,y,8,12,0,0,Math.PI*2);c.stroke();}
 oval(c,486,265,22,22,'#c0bfa9');oval(c,486,265,13,13,'#384d51');line(c,[[486,286],[486,395]],'#b1b2a0',14);line(c,[[426,304],[546,304]],'#b1b2a0',11);
 c.beginPath();c.moveTo(383,346);c.bezierCurveTo(388,420,465,425,486,395);c.bezierCurveTo(510,425,580,420,588,346);c.strokeStyle='#a1a798';c.lineWidth=14;c.stroke();
 polygon(c,[[373,353],[402,350],[380,328]],'#bfc1aa');polygon(c,[[571,350],[600,351],[591,326]],'#bfc1aa');
 for(let i=0;i<5;i++)line(c,[[122,427+i*6],[345+Math.sin(t*.4+i)*12,427+i*6]],'rgba(152,184,174,.3)',2);
}
function vessel(c:CanvasRenderingContext2D,x:number,y:number,color:string){
 c.beginPath();c.moveTo(x-32,y-121);c.bezierCurveTo(x-19,y-87,x-65,y-85,x-58,y-35);c.bezierCurveTo(x-50,y+15,x+50,y+15,x+58,y-35);c.bezierCurveTo(x+65,y-85,x+19,y-87,x+32,y-121);c.closePath();c.fillStyle=color;c.fill();
 oval(c,x,y-121,32,8,'#d0af7a');oval(c,x,y-122,23,4,'#493f32');line(c,[[x-34,y-78],[x-43,y-43],[x-28,y-14]],'rgba(236,207,154,.35)',6);
}
function custom(c:CanvasRenderingContext2D,art:string,t:number,elapsed:number,lineText:string){
 switch(art){
  case 'reed':reed(c,t);break;
  case 'wick':lamp(c,467,365,1.55,t,true);break;
  case 'lamp':lamp(c,467,365,1.55,t);break;
  case 'torch':line(c,[[480,407],[480,232]],'#a17a4f',19);line(c,[[457,245],[505,245]],'#bcaa82',8);flame(c,480,224,47,t);smoke(c,480,180,t);break;
  case 'seed':{
   oval(c,480,404,179,15,'#5f5b43');
   if(/mustard/.test(lineText)){for(let i=0;i<4;i++)oval(c,414+i*23,397-(i%2)*3,5,5,'#b99558');oval(c,480,354,12,12,'#a88b50');oval(c,476,350,3,3,'#d4bb79');}
   else{oval(c,480,354,22,33,'#a08555',.25);line(c,[[468,337],[478,325]],'#d0bb8c',3);}
   line(c,[[481,337],[490,267]],'#8ea779',5);oval(c,506,276,22,9,'#9caf7d',-.5);oval(c,474,288,20,9,'#728f65',.5);break;
  }
  case 'oak':case 'cedar':case 'sapling':case 'roots':{
   tree(c,t,art);
   if(art==='cedar'&&/reeds may know themselves/.test(lineText)){c.save();c.translate(196,99);c.scale(.67,.75);reed(c,t);c.restore();}
   break;
  }
  case 'anchor':anchor(c,t);break;
  case 'clock':clock(c,t);break;
  case 'lock':lock(c);break;
  case 'fire':case 'firewater':{
   if(art==='firewater'&&/sparks falling/.test(lineText)){
    for(let j=0;j<8;j++)line(c,[[153,390+j*7],[350,383+j*7],[605,398+j*7],[806,390+j*7]],'#688f92',3);
    for(let i=0;i<8;i++){const phase=(t*.2+i*.13)%1;oval(c,390+i*25,240+phase*145,3,5,`rgba(236,161,67,${1-phase})`);}
   }else if(art==='firewater'&&/cast water/.test(lineText)){
    lamp(c,403,377,1.25,t,true);c.save();c.translate(663,238);c.rotate(-.8);vessel(c,0,0,'#7b9992');c.restore();line(c,[[608,165],[548,254],[538,322]],'#98bfc0',6);
   }else if(art==='firewater'&&/preserve fire/.test(lineText)){
    for(let j=0;j<9;j++)line(c,[[153,360+j*11],[350,352+j*11],[605,366+j*11],[806,356+j*11]],'#688f92',3);
    oval(c,480,389,91,15,'#4e6663');lamp(c,467,370,.9,t,true);
   }else{
    for(let i=0;i<5;i++)line(c,[[371+i*18,398],[535-i*14,353]],'#786049',16);
    flame(c,480,369,65,t);for(let i=0;i<5;i++)flame(c,432+i*23,380,24,t+i);
    if(art==='firewater')for(let j=0;j<8;j++)line(c,[[153,410+j*5],[320,408+j*5],[500,414+j*5],[806,407+j*5]],'#688f92',3);
   }break;
  }
  case 'candles':{
   for(let i=0;i<7;i++){const x=221+i*87,y=377-Math.sin(i*Math.PI/6)*42;line(c,[[x,y],[x,y-90]],ochre,8);oval(c,x,y,27,7,'#a28755');oval(c,x,y-88,18,7,cream);flame(c,x,y-94,15,t+i);smoke(c,x,y-117,t+i,.45);}break;
  }
  case 'dust':{
   polygon(c,[[244,124],[297,124],[781,421],[405,421]],'rgba(242,219,161,.15)');
   c.fillStyle='#a28d67';c.fillRect(225,107,86,122);c.fillStyle='#f1d5a0';c.fillRect(237,118,62,97);line(c,[[268,118],[268,214]],'#665b46',6);line(c,[[236,166],[299,166]],'#665b46',6);
   for(let i=0;i<75;i++){const x=343+(i*71)%386,y=192+(i*37)%203;oval(c,x+Math.sin(t*.2+i)*3,y,1.5,1.5,`rgba(247,224,173,${.2+(i%4)*.14})`);}break;
  }
  case 'flowers':case 'herbs':{
   for(let i=0;i<11;i++){const x=263+i*43,y=265+(i%3)*29;line(c,[[x,405],[x-4,y]],green,4);for(let j=0;j<4;j++){oval(c,x-13,y+27+j*20,17,5,i%2?'#9aab78':'#6f8b64',-.45);oval(c,x+12,y+35+j*20,17,5,green,.45);}
    if(art==='flowers')for(let j=0;j<6;j++){const a=j*Math.PI/3;oval(c,x+Math.cos(a)*12,y+Math.sin(a)*12,10,7,i%2?'#d8c395':'#b98878',a);}oval(c,x,y,art==='flowers'?6:3,art==='flowers'?6:3,'#d6b16c');
   }break;
  }
  case 'knot':{
   c.strokeStyle='#aa8e60';c.lineWidth=17;c.lineCap='round';c.beginPath();c.moveTo(191,349);c.bezierCurveTo(356,349,435,226,509,258);c.bezierCurveTo(629,325,431,425,405,326);c.bezierCurveTo(381,241,574,240,556,327);c.bezierCurveTo(542,402,676,352,781,352);c.stroke();
   c.strokeStyle='#e0c493';c.lineWidth=3;c.stroke();break;
  }
  case 'oil':{
   lamp(c,417,382,1.2,t,true);c.save();c.translate(654,251);c.rotate(-.6);vessel(c,0,0,'#9b7b4d');c.restore();line(c,[[617,175],[551,267],[540,325]],'rgba(224,190,99,.8)',5);break;
  }
  case 'medicine':{
   c.fillStyle='#70583d';c.fillRect(210,195,541,12);c.fillRect(210,370,541,12);
   for(let i=0;i<6;i++){const x=250+i*88;vessel(c,x,i%2?357:181,i%3?'#8b7960':'#76928a');oval(c,x,i%2?236:60,26,6,'#b39c75');}
   c.fillStyle='#d0b88c';c.fillRect(380,392,202,16);break;
  }
  case 'potter':{
   oval(c,479,402,152,28,'#87745a');oval(c,479,390,152,24,'#b39a70');line(c,[[480,411],[480,458]],'#796a52',22);vessel(c,479,372,'#b2865f');line(c,[[381,278],[411,286],[429,310]],'#b39470',14);line(c,[[578,278],[547,286],[529,310]],'#b39470',14);break;
  }
  case 'plough':{
   for(let i=0;i<8;i++)line(c,[[100,401+i*8],[812,381+i*9]],'#817256',3);
   line(c,[[310,363],[612,288]],'#a8895b',20);line(c,[[525,309],[549,408]],'#9a7d50',14);polygon(c,[[550,378],[622,413],[526,421]],'#a0a99a');line(c,[[535,306],[586,181]],'#a8895b',13);line(c,[[576,190],[639,187]],'#c7a675',12);break;
  }
  case 'yoke':{
   c.strokeStyle='#b29462';c.lineWidth=29;c.beginPath();c.moveTo(258,254);c.bezierCurveTo(385,200,572,200,700,254);c.stroke();
   for(const x of [365,589]){c.strokeStyle='#d0bc8a';c.lineWidth=12;c.beginPath();c.moveTo(x-43,244);c.bezierCurveTo(x-65,410,x+65,410,x+43,244);c.stroke();}break;
  }
  case 'glass':{
   for(const x of [355,592]){glow(c,x,270,117,.08);c.strokeStyle='#c2b491';c.lineWidth=9;c.beginPath();c.ellipse(x,270,80,101,x===355?-.15:.15,0,Math.PI*2);c.stroke();c.fillStyle='rgba(157,197,191,.24)';c.fill();line(c,[[x-43,220],[x+24,196]],'rgba(233,236,208,.6)',5);}
   line(c,[[433,262],[515,262]],'#b8a47e',8);line(c,[[288,315],[241,395]],'#b8a47e',10);line(c,[[659,315],[706,395]],'#b8a47e',10);break;
  }
  case 'water':{
   oval(c,480,347,240,67,'#597d7f');for(let i=0;i<7;i++){c.beginPath();c.ellipse(480,347,35+i*28,12+i*6,0,0,Math.PI*2);c.strokeStyle=`rgba(183,204,185,${.45-i*.045})`;c.lineWidth=2;c.stroke();}for(let i=0;i<4;i++)line(c,[[252,359+i*12],[338,352+i*12],[450,363+i*12],[606,350+i*12],[711,358+i*12]],'#7a9690',2);break;
  }
  case 'rowing':{
   for(let i=0;i<7;i++)line(c,[[95,337+i*15],[300,335+i*15],[610,341+i*15],[869,335+i*15]],'#6f9494',3);
   polygon(c,[[254,317],[704,317],[655,377],[326,377]],'#aa8155');polygon(c,[[287,319],[675,319],[626,341],[334,341]],'#554c3b');
   oval(c,474,248,19,23,'#b79873');polygon(c,[[457,270],[493,270],[516,320],[434,320]],'#a59d7b');
   const a=Math.sin(t*.7)*.08;c.save();c.translate(474,298);c.rotate(a);line(c,[[-30,-6],[198,97]],'#c0a377',10);polygon(c,[[155,71],[224,96],[209,120],[151,89]],'#b69b6e');c.restore();break;
  }
  default:throw Error('Missing Bruised Reed custom subject: '+art);
 }
 // Quiet print-like surface texture, distinct from decorative stars or filler scenery.
 c.fillStyle='rgba(244,223,180,.06)';for(let i=0;i<420;i++)c.fillRect((i*117.31)%960,(i*37.91)%480,1,1);
 const vignette=c.createRadialGradient(480,265,190,480,265,550);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'rgba(14,25,28,.30)');c.fillStyle=vignette;c.fillRect(0,0,960,480);
 void elapsed;
}
export function createBruisedReedPainter(scenes:readonly Subject[]):Painter{
 const compositions=scenes.map(scene=>{const recipe=recipes[scene.art];if(!recipe)throw Error('Unknown Bruised Reed artwork '+scene.art);return {art:scene.art,setting:recipe.setting,objects:scene.art==='foundation'&&/sand/.test(scene.line)?['house']:scene.art==='furnace'&&/silver/.test(scene.line)?['furnace']:recipe.objects};});
 const base=createExcellencyPainter(compositions);
 return (context,art,time,elapsed,variant)=>{
  const composition=compositions[variant];if(!composition||composition.art!==art)throw Error('Invalid Bruised Reed scene');
  base(context,art,time,elapsed,variant);
  if(art==='foundation'&&/sand/.test(scenes[variant]?.line??'')){
   oval(context,480,423,265,24,'#b49b70');for(let i=0;i<160;i++)oval(context,225+(i*47)%511,410+(i*17)%30,1.4,1,'#dbc79b');
  }
  if(art==='furnace'&&/silver/.test(scenes[variant]?.line??'')){
   for(let i=0;i<4;i++)polygon(context,[[653+i*15,408-i*22],[716+i*15,408-i*22],[702+i*15,386-i*22],[666+i*15,386-i*22]],i%2?'#b4c3bb':'#d1d6c7');
  }
  if(composition.objects.length===0)custom(context,art,time,elapsed,scenes[variant]?.line??'');
 };
}
