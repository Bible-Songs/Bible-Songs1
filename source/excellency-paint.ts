type Point=readonly [number,number];
type Placement=readonly [number,number,number];
const W=960,H=480;
const amber='#d6aa68',light='#f0d8a5',ink='#202c32',stone='#77827a',red='#8d493d';
const tones:Record<string,readonly [string,string,string]>={
 hall:['#182635','#82765f','#b6a177'], chamber:['#203033','#766753','#a48b64'],
 table:['#2b3335','#6f604b','#a48a64'], workshop:['#283136','#7a6551','#a4845c'],
 mountain:['#274150','#9c9671','#a0a776'],summit:['#223849','#898572','#727f76'],
 night:['#132031','#40516a','#796a59'], desert:['#34373b','#ad8c60','#ab805a'],
 meadow:['#304e55','#9caa7e','#879871'], garden:['#29474b','#82936e','#84946b'],
 grove:['#152b3b','#45556a','#51675d'], road:['#2c4754','#9d9470','#8b8b68'],
 city:['#354955','#94846b','#9b8764'], court:['#343641','#8e7567','#826b56'],
 dusk:['#222a3d','#9d7364','#746454'], stable:['#253241','#6b624c','#a38b60'],
 temple:['#343c46','#897b66','#9c8261'], graves:['#283e4d','#748772','#8b9174'],
 sea:['#24394b','#849487','#567478'], coast:['#304859','#7e9290','#727d6d'],
 ruins:['#293745','#85836e','#9c8b6d'],
};
function oval(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,col:string,a=0){
 c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,a,0,Math.PI*2);c.fill();
}
function path(c:CanvasRenderingContext2D,points:readonly Point[],col:string,w=0){
 c.beginPath();
 points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));
 if(w){c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.strokeStyle=col;c.stroke();}
 else{c.closePath();c.fillStyle=col;c.fill();}
}
function rect(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,col:string){
 c.fillStyle=col;c.fillRect(x,y,w,h);
}
function glow(c:CanvasRenderingContext2D,x:number,y:number,r:number,col:string){
 const g=c.createRadialGradient(x,y,0,x,y,r);
 g.addColorStop(0,col);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
}
function random(n:number){
 const x=Math.sin(n*103.81+5.41)*8327.617;return x-Math.floor(x);
}
function arch(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,col:string){
 c.beginPath();c.moveTo(x-w/2,y);c.lineTo(x-w/2,y-h+w/2);
 c.quadraticCurveTo(x-w/2,y-h,x,y-h);
 c.quadraticCurveTo(x+w/2,y-h,x+w/2,y-h+w/2);
 c.lineTo(x+w/2,y);c.closePath();c.fillStyle=col;c.fill();
}
function backdrop(c:CanvasRenderingContext2D,setting:string,index:number){
 const [top,mid,ground]=tones[setting]??tones['hall']??['#293745','#85836e','#9c8b6d'];
 const wash=c.createLinearGradient(0,0,0,H);
 wash.addColorStop(0,top);wash.addColorStop(.72,mid);wash.addColorStop(1,ground);
 c.fillStyle=wash;c.fillRect(0,0,W,H);
 glow(c,500,213,360,'rgba(254,211,148,.31)');
 if(['hall','chamber','temple','court','workshop','stable','table'].includes(setting)){
  for(let i=0;i<5;i++){
   const x=100+i*192;
   arch(c,x,340,151,294,i%2?'rgba(26,32,33,.24)':'rgba(26,32,33,.33)');
   rect(c,x-87,50,13,297,'rgba(224,193,139,.13)');
   rect(c,x-94,343,29,7,'rgba(236,190,128,.17)');
  }
  path(c,[[0,345],[W,345],[W,H],[0,H]],'rgba(31,36,33,.38)');
  for(let i=0;i<10;i++)path(c,[[W/2+(i-5)*42,345],[(i-1)*132,H]],'rgba(218,184,137,.14)',1.5);
 }else{
  for(let layer=0;layer<4;layer++){
   const points:Point[]=[[0,H]];
   for(let x=0;x<=W;x+=24){
    const amplitude=setting==='summit'?65:35;
    points.push([x,246+layer*35+Math.sin(x/161+layer+index*.88)*amplitude+Math.cos(x/64+layer)*11]);
   }
   points.push([W,H]);
   path(c,points,['rgba(181,167,117,.32)','rgba(84,112,100,.46)','rgba(42,68,66,.50)','rgba(30,51,51,.69)'][layer]??ink);
  }
  if(setting==='night'||setting==='grove'||setting==='dusk'){
   for(let i=0;i<110;i++)oval(c,random(i)*W,random(i+110)*244,1.1,1.1,i%6?'#a4a69b':'#ecd6a0');
  }
  if(setting==='city'){
   for(let i=0;i<15;i++){
    const x=i*69-22,h=25+random(i+index)*63;
    rect(c,x,295-h,59,h,'#6d6859');
    rect(c,x+11,307-h,8,13,'#a59572');
    rect(c,x+34,303-h,8,11,'#aa9a75');
   }
   rect(c,0,294,W,42,'#8a7b62');
   for(let i=0;i<22;i++)rect(c,i*45,282,24,18,'#8a7b62');
  }
  if(setting==='sea'||setting==='coast'){
   rect(c,0,306,W,174,'#3b5f65');
   for(let i=0;i<33;i++){
    const x=random(i)*W,y=309+random(i+200)*162;
    path(c,[[x,y],[x+22+i%11,y-1],[x+45+i%29,y+1]],'rgba(217,209,166,.25)',1.8);
   }
  }
 }
}
function person(c:CanvasRenderingContext2D,kind:string){
 const low=['kneeling','beggar','weeping','hiding','blessing','sleeping','sleeper','bound','rider'].includes(kind);
 const child=['child','boy'].includes(kind);
 const position=low?52:0;
 const robe=kind==='teacher'?'#d9c2a1':kind==='soldier'?'#835342':kind==='bride'?'#e2cbb0':kind==='angel'?'#d6d6bd':kind==='child'?'#a98a63':kind==='elder'?'#a17754':kind==='king'?'#8d514f': '#546f71';
 c.save();
 if(child)c.scale(.68,.72);
 if(kind==='sleeper'){c.translate(-20,25);c.rotate(-1.02);}
 const headY=-159+position;
 if(kind==='angel'){
  path(c,[[-17,headY+24],[-93,headY-23],[-142,headY-52],[-116,headY+11],[-77,headY+77],[-26,headY+59]],'#aeb4a6');
  path(c,[[18,headY+24],[94,headY-23],[142,headY-52],[116,headY+11],[77,headY+77],[26,headY+59]],'#c5c4a7');
  for(let i=0;i<5;i++)path(c,[[25,headY+35],[65+i*13,headY+22-i*12]],'#f1dfb6',3);
 }
 if(low){
  path(c,[[-28,headY+26],[29,headY+19],[49,-32],[86,-21],[75,2],[-44,2]],robe);
  path(c,[[8,headY+26],[39,-37],[64,-18],[40,0],[-1,-6]],'rgba(39,46,39,.44)');
 }else{
  path(c,[[-24,headY+21],[26,headY+20],[38,-63],[59,0],[-56,0],[-35,-54]],robe);
  path(c,[[1,headY+24],[27,headY+22],[37,-71],[59,0],[26,0],[13,-42]],'rgba(31,37,38,.36)');
  path(c,[[-17,headY+36],[-22,-57],[-35,-5]],'rgba(233,212,176,.34)',2.6);
 }
 oval(c,0,headY,24,27,kind==='teacher'?'#4d4237':'#4a4038',.04);
 oval(c,5,headY+4,17,20,'#be9471',.05);
 path(c,[[-17,headY+7],[-10,headY-23],[11,headY-28],[24,headY-18],[4,headY-16],[-1,headY+7]],'#514035');
 if(['elder','teacher','king','shepherd'].includes(kind))path(c,[[-5,headY+10],[18,headY+10],[8,headY+30]],kind==='elder'?'#c0b6a0':'#604b3b');
 if(kind!=='weeping'){
  const arm=kind==='kneeling'?12:32;
  path(c,[[23,headY+36],[43,headY+59],[67,headY+arm]],robe,15);
  oval(c,67,headY+arm,8,6,'#bc9675');
 }
 if(kind==='weeping'){
  path(c,[[13,headY+3],[16,headY+19]],'#b3d2cf',2);
  oval(c,17,headY+25,3,6,'#cee2d6');
  path(c,[[28,headY+38],[43,headY+5],[20,headY-1]],robe,13);
 }
 if(kind==='soldier'||kind==='king'){
  path(c,[[-25,headY-15],[-18,headY-32],[-8,headY-22],[3,headY-39],[13,headY-25],[27,headY-33],[26,headY-12]],amber);
 }
 if(kind==='shepherd'||kind==='traveler'||kind==='burden')path(c,[[64,0],[64,headY+9],[72,headY-3],[84,headY+1]],'#9a7953',6);
 if(kind==='burden')oval(c,-34,headY+37,43,43,'#8f7555',-.4);
 if(kind==='bound')path(c,[[47,headY+34],[67,headY+42],[82,headY+35]],light,5);
 if(kind==='soldier'||kind==='youngwarrior')path(c,[[-54,0],[-54,headY-52]],light,5);
 c.restore();
}
function animal(c:CanvasRenderingContext2D,kind:string){
 if(kind==='dove'||kind==='birds'){
  path(c,[[-66,-20],[-34,-34],[-7,-51],[43,-104],[59,-108],[51,-69],[27,-44],[62,-54],[78,-46],[62,-31],[37,-27],[5,0],[-27,-3]],'#d7dace');
  oval(c,58,-48,9,8,'#f1ead7');oval(c,62,-50,2.2,2.2,ink);
  path(c,[[66,-49],[80,-45],[68,-41]],amber);
  path(c,[[8,-27],[-5,-56],[-16,-86],[-37,-106],[-23,-69],[-8,-37]],'#a7b6ae');
  return;
 }
 if(kind==='whale'){
  c.beginPath();c.moveTo(-123,-15);c.bezierCurveTo(-65,-84,62,-102,106,-33);c.bezierCurveTo(101,13,13,13,-90,2);c.fillStyle='#476d79';c.fill();
  path(c,[[-91,-15],[-125,-37],[-154,-76],[-140,-31],[-158,-13],[-113,2]],'#527f86');
  path(c,[[90,-16],[65,-8],[36,-7]],'#b4bdac',3);oval(c,74,-39,4,3,ink);
  return;
 }
 if(kind==='rooster'){
  oval(c,0,-40,30,34,'#ac764c',.3);oval(c,24,-78,15,22,'#a8573c');
  for(let k=0;k<5;k++)oval(c,14+k*6,-100+Math.sin(k)*4,5,8,'#9c3b35');
  path(c,[[36,-82],[52,-73],[35,-71]],amber);
  for(let k=0;k<4;k++)path(c,[[-15,-42],[-40-k*8,-70-k*6],[-63-k*5,-29+k*3]],['#263d43','#34585a','#4b6864','#6a7658'][k]??ink,7);
  path(c,[[-7,-14],[-8,0],[-22,0]],amber,3);path(c,[[12,-14],[17,0],[31,0]],amber,3);
  return;
 }
 const small=kind==='lamb'||kind==='flock', lion=kind==='lion', deer=kind==='deer', fox=kind==='fox';
 const coat=small?'#ddd4bf':lion?'#b9874e':kind==='pig'?'#b28a76':fox?'#a76743':'#997a59';
 const bodyY=deer?-76:lion?-61:-52;
 for(const x of [-44,-27,24,46])path(c,[[x,bodyY+12],[x+(x%2?8:-5),-3],[x+7,0]],'#5e5141',small?5:8);
 oval(c,-7,bodyY,65,31,coat);
 if(small)for(let i=0;i<13;i++)oval(c,-57+(i%7)*15,bodyY-12+Math.floor(i/7)*17,16,14,i%3?'#e5dcc8':'#d2c7ad');
 if(lion){
  const mane:Point[]=Array.from({length:38},(_,i)=>{
   const a=i*Math.PI*2/38,r=39+random(i)*9;
   return [46+Math.cos(a)*r,-82+Math.sin(a)*r*1.14];
  });
  path(c,mane,'#865838');
  oval(c,46,-84,35,40,'#a47349');
  for(let i=0;i<15;i++){
   const a=i*Math.PI*2/15;
   path(c,[[46+Math.cos(a)*22,-82+Math.sin(a)*24],[46+Math.cos(a)*(37+random(i)*6),-82+Math.sin(a)*42]],i%2?'#906044':'#b08154',3);
  }
  path(c,[[-65,-65],[-102,-82],[-111,-101]],coat,6);oval(c,-111,-102,8,12,'#8c633e');
 }else if(fox){oval(c,-75,-54,48,12,coat,.35);oval(c,-112,-66,13,9,'#deccae',.35);}
 else path(c,[[-64,bodyY],[-77,bodyY-19]],coat,5);
 const hy=deer?-107:lion?-85:small?-70:-70;
 oval(c,54,hy,kind==='donkey'?29:22,18,coat,-.24);
 oval(c,72,hy+5,13,9,small?'#e5daca':'#c0986e');
 oval(c,74,hy+3,4,3,ink);oval(c,58,hy-5,2.7,2.7,ink);
 if(kind==='donkey'){oval(c,39,hy-24,6,21,coat,-.26);oval(c,51,hy-26,6,20,coat,.17);}
 else if(deer){
  for(const x of [46,58])path(c,[[x,hy-12],[x-6,hy-38],[x-20,hy-47]],'#635646',4);
 }else{path(c,[[42,hy-7],[37,hy-26],[52,hy-18]],coat);}
 if(kind==='flock'){c.save();c.translate(-85,8);c.scale(.48,.52);animal(c,'lamb');c.restore();}
}
function flame(c:CanvasRenderingContext2D,x:number,y:number,s:number){
 glow(c,x,y-22,85*s,'rgba(248,152,87,.35)');
 c.beginPath();c.moveTo(x-15*s,y);c.bezierCurveTo(x-35*s,y-20*s,x+11*s,y-45*s,x+1*s,y-78*s);
 c.bezierCurveTo(x+40*s,y-29*s,x+28*s,y,x-15*s,y);c.fillStyle='#d8864b';c.fill();
 path(c,[[x-10*s,y],[x+9*s,y-39*s],[x+20*s,y]],'#f1c375');
}
function drop(c:CanvasRenderingContext2D,x:number,y:number,s:number,color:string){
 c.beginPath();c.moveTo(x,y-30*s);c.bezierCurveTo(x-6*s,y-11*s,x-20*s,y+2*s,x-20*s,y+14*s);
 c.bezierCurveTo(x-20*s,y+43*s,x+20*s,y+43*s,x+20*s,y+14*s);
 c.bezierCurveTo(x+20*s,y+2*s,x+6*s,y-11*s,x,y-30*s);c.fillStyle=color;c.fill();
 oval(c,x-7*s,y+9*s,3*s,7*s,'rgba(251,231,182,.52)',.42);
}
function tree(c:CanvasRenderingContext2D,kind:string){
 path(c,[[-12,2],[-3,-118],[-19,-172],[7,-151],[15,-91],[13,2]],'#5c513e');
 for(let i=0;i<8;i++){
  const side=i%2?-1:1,x=side*(38+random(i)*58),y=-93-i*10;
  path(c,[[4,y+59],[x,y]],'#655743',6);
  if(kind!=='roots')for(let j=0;j<4;j++)oval(c,x+random(i+j*8)*35-15,y+random(i+j*20)*25,34,19,['#566e5d','#728367','#899375','#9c9e70'][j]??stone,.2);
  if(kind==='fruittree'||kind==='grapevine')for(let j=0;j<4;j++)oval(c,x+j*9-13,y+12+j%2*7,5,5,kind==='grapevine'?'#755364':'#c38055');
 }
 if(kind==='roots')for(let j=0;j<9;j++)path(c,[[0,-7],[(j-4)*14,8],[(j-4)*22,14]],'#81735a',4);
}
function vessel(c:CanvasRenderingContext2D,kind:string){
 if(['cup','chalice','censer'].includes(kind)){
  ellipseStroke(c,0,-78,47,11,light,2);
  path(c,[[-47,-78],[-30,-29],[-7,-20],[-5,1],[-34,7],[35,7],[6,1],[8,-20],[33,-33],[47,-78]],'#a5784c');
  oval(c,0,-77,46,11,kind==='censer'?'#494138':'#793f43');
  path(c,[[-30,-64],[-15,-31],[-4,-23]],'#e7bf7c',5);
  if(kind==='censer'){for(const s of [-1,1])path(c,[[s*38,-78],[s*8,-153],[0,-169]],light,2);flame(c,0,-77,.55);}
  return;
 }
 c.save();if(kind==='tippedjar')c.rotate(.62);
 const dark=kind==='milkjug'?'#777a72':'#74563f',tone=kind==='milkjug'?'#b7b1a0':'#b0774d';
 ellipseStroke(c,32,-63,24,39,light,7);
 c.beginPath();c.moveTo(-24,-117);c.bezierCurveTo(-20,-86,-60,-80,-51,-31);c.bezierCurveTo(-48,12,46,15,51,-31);
 c.bezierCurveTo(61,-79,25,-90,24,-117);c.fillStyle=tone;c.fill();
 oval(c,0,-116,27,9,light);oval(c,0,-116,20,4,dark);
 path(c,[[-39,-75],[-45,-47],[-31,-18]],'rgba(241,214,175,.42)',6);
 for(const y of [-83,-72,-22])path(c,[[-38,y],[39,y]],dark,3);
 c.restore();
}
function ellipseStroke(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,col:string,w:number,a=0){
 c.beginPath();c.ellipse(x,y,rx,ry,a,0,Math.PI*2);c.strokeStyle=col;c.lineWidth=w;c.stroke();
}
const people=new Set('elder blessing child person traveler king kneeling beggar teacher crowd petitioners boy soldier rider visitor disciple hiding rising bound sleeper youngwarrior strong angel guest groom bride parent fearful cloaked woman man guests burden gatekeeper weeping shepherd'.split(' '));
const animals=new Set('lion lamb flock donkey dove fox birds pig deer rooster whale'.split(' '));
function object(c:CanvasRenderingContext2D,k:string){
 if(people.has(k)){
  if(['crowd','petitioners','guests'].includes(k)){
   for(let i=0;i<5;i++){
    c.save();c.translate((i-2)*38,-Math.abs(i-2)*9);c.scale(.55,.55);
    person(c,i%2?'visitor':'traveler');c.restore();
   }
  }else person(c,k);
  return;
 }
 if(animals.has(k)){animal(c,k);return;}
 if(['jar','winejug','milkjug','jug','cup','chalice','tippedjar','censer'].includes(k)){vessel(c,k);return;}
 if(['tree','olive','fruittree','roots','grapevine'].includes(k)){tree(c,k);return;}
 if(['door','doorway','house','stable','arch','cave','tomb'].includes(k)){
  if(k==='house'||k==='stable')path(c,[[-104,-124],[0,-216],[109,-118]],'#715949');
  arch(c,0,3,k==='cave'?177:160,167,'#81745f');
  arch(c,0,3,130,144,'#423e38');
  if(k==='door'||k==='doorway'){
   arch(c,0,3,117,139,'#715441');
   for(let x=-42;x<55;x+=20)path(c,[[x,-112],[x,0]],'#4f4238',3);
   oval(c,34,-58,7,7,amber);path(c,[[-56,1],[54,1]],'#f0c17d',2);
  }else if(k==='tomb'||k==='cave'){
   oval(c,71,-36,37,43,'#898778',-.35);
   path(c,[[49,-51],[76,-67],[92,-49]],'#aaaa92',3);
  }else{glow(c,0,-63,67,'rgba(248,211,148,.52)');}
  return;
 }
 if(['throne','whitethrone'].includes(k)){
  const top=k==='whitethrone'?'#f6e6cc':amber;
  for(let i=0;i<3;i++)rect(c,-70-i*16,-i*9,140+i*32,10, i%2?'#7a654d':'#9a7f5a');
  arch(c,0,-22,100,183,top);
  arch(c,0,-27,73,157,k==='whitethrone'?'#d4c9b3':'#80504a');
  rect(c,-52,-42,104,16,top);
  for(const x of [-62,52]){rect(c,x,-71,10,45,top);oval(c,x+5,-72,10,8,light);}
  return;
 }
 if(['scroll','parchment','seals','tablets','quill'].includes(k)){
  if(k==='quill'){
   path(c,[[-60,6],[50,-135]],light,4);
   path(c,[[-36,-25],[-21,-91],[55,-140],[44,-94],[12,-53]],'#d8c8a1');
   path(c,[[-15,-60],[24,-99]],'#978366',2);return;
  }
  for(const [i,x] of [-49,49].entries()){
   arch(c,x,0,92,k==='tablets'?157:118,k==='tablets'?'#a4a193':'#d9ba86');
   for(let j=0;j<6;j++)path(c,[[x-31,-79+j*11],[x+28-(j%3)*8,-79+j*11]],'#8f7657',1.5);
   if(k==='scroll'||k==='seals')oval(c,x+(i?52:-52),-52,11,62,'#ad905f');
  }
  if(k==='seals')for(let i=0;i<7;i++){
   const x=-78+26*i;
   path(c,[[x,-12],[x-4,7],[x+4,17]],'#9d6051',3);
   oval(c,x,4,11,10,red);ellipseStroke(c,x,4,7,6,'#c97b5d',1.4);
  }
  return;
 }
 if(['cross','crosses','ladder','pillars','foundation','cityscape'].includes(k)){
  if(k==='cross'||k==='crosses'){
   for(const x of k==='cross'?[0]:[-92,0,92]){
    const h=x?133:218;
    rect(c,x-7,-h,14,h,'#4e4036');rect(c,x-51,-h+34,102,12,'#59483c');
    path(c,[[x-5,-h+2],[x-5,-2]],'rgba(232,203,164,.36)',1.9);
   }
  }else if(k==='ladder'){
   for(const x of [-55,55])path(c,[[x,4],[x*.7,-238]],'#c6a375',11);
   for(let j=0;j<11;j++)path(c,[[-54+j*1.4,-j*22],[54-j*1.4,-j*22]],'#dfbc89',8);
  }else{
   const count=k==='pillars'?2:k==='foundation'?5:7;
   for(let i=0;i<count;i++){
    const x=(i-(count-1)/2)*(k==='pillars'?106:42);
    const h=k==='pillars'?180:k==='foundation'?33+i%2*20:50+i%3*21;
    rect(c,x-25,-h,44,h,i%2?'#9c8d76':'#b1a087');
    rect(c,x-19,-h+3,7,h-3,'#c3ac8d');
   }
   if(k==='pillars')path(c,[[-102,-182],[97,-167],[88,-188],[-104,-207]],'#aa9070');
  }
  return;
 }
 if(['rock','earth','mountains','cliff','rubble','gold','pearl'].includes(k)){
  if(k==='pearl'){ellipseStroke(c,0,-33,48,45,'#ad9e91',6);oval(c,0,-34,30,29,'#e9dec6');oval(c,-11,-44,7,6,'#fff4d8');return;}
  for(let j=0;j<(k==='rock'?4:k==='gold'?6:7);j++){
   const x=(random(j+7)-.5)*165,y=-random(j+36)*44,s=24+random(j+12)*(k==='mountains'?74:40);
   const color=k==='gold'?['#a5753d','#b68d4f','#d4aa63'][j%3]:['#646e67','#7e8172','#9b9a81'][j%3];
   path(c,[[x-s,y],[x-s*.67,y-s*.75],[x,y-s],[x+s*.73,y-s*.48],[x+s,y]],color??stone);
   path(c,[[x-s*.67,y-s*.75],[x,y-s],[x+s*.73,y-s*.48],[x+4,y-s*.48]],k==='gold'?'#e5bd73':'#aeb19b');
   path(c,[[x+4,y-s*.48],[x+s*.73,y-s*.48],[x+s,y],[x+2,y]],k==='gold'?'#99713f':'#555c59');
  }
  return;
 }
 if(['sun','moon','star','globe','orbit','beam','clouds','circles'].includes(k)){
  if(k==='clouds'){
   for(let i=0;i<10;i++)oval(c,(i-5)*19,-88+Math.sin(i*2)*17,52,22,'rgba(206,204,181,.31)');
  }else if(k==='beam'){
   path(c,[[-35,-265],[32,-265],[143,1],[-140,1]],'rgba(244,214,158,.25)');
   glow(c,0,-153,145,'rgba(254,234,174,.50)');
  }else if(k==='orbit'){
   ellipseStroke(c,0,-74,114,44,'#bcaf8c',2,-.38);
   oval(c,83,-109,12,12,'#c6a17a');oval(c,-97,-47,6,6,'#d2c6a9');
  }else if(k==='circles'){
   for(const [x,y] of [[0,-125],[-47,-47],[47,-47]] as const){glow(c,x,y,99,'rgba(247,214,143,.38)');ellipseStroke(c,x,y,53,53,light,2);}
  }else{
   const r=k==='star'?16:58;
   glow(c,0,-92,150,'rgba(249,219,159,.43)');oval(c,0,-92,r,r,light);
   if(k==='star')for(let a=0;a<8;a++){
    const dir=a*Math.PI/4;
    path(c,[[Math.cos(dir)*12,-92+Math.sin(dir)*12],[Math.cos(dir)*55,-92+Math.sin(dir)*55]],'#f4dfab',2.4);
   }
   if(k==='globe'){
    oval(c,0,-92,56,56,'#648884');
    path(c,[[-52,-95],[-44,-118],[-14,-135],[14,-127],[8,-110],[-13,-106],[-7,-91],[-29,-74],[-45,-76]],'#ac9b74');
    path(c,[[16,-85],[35,-98],[55,-88],[42,-66],[14,-48],[5,-62]],'#aaa47c');
   }
   if(k==='moon')oval(c,18,-103,49,48,'#42515c');
  }
  return;
 }
 if(['bucket','basin','basket','bedroll','towel','curtain','manger','infant'].includes(k)){
  if(k==='towel'||k==='curtain'||k==='bedroll'){
   path(c,[[-63,-113],[62,-113],[48,-78],[70,-44],[59,-6],[-60,-4],[-51,-39],[-72,-65]],k==='curtain'?'#905c52':'#d8c4a4');
   for(let i=0;i<7;i++)path(c,[[-56+i*18,-111],[-61+i*18,-58],[-53+i*18,-8]],'rgba(115,84,68,.45)',3);
  }else if(k==='infant'){
   oval(c,0,-46,67,36,'#a5987f',-.12);
   oval(c,0,-45,52,27,'#ddd0ad',-.13);
   oval(c,32,-59,19,18,'#c09b78');path(c,[[-37,-38],[12,-58],[-15,-23]],'#ab9e85',4);
  }else{
   const t=k==='manger'?100:k==='bucket'?81:56;
   path(c,[[-72,-t],[72,-t],[55,1],[-54,1]],k==='basin'?'#ad976e':'#997450');
   oval(c,0,-t,72,18,k==='basin'?'#c5ae7e':'#a48659');oval(c,0,-t,55,11,k==='basin'?'#6f9893':'#52483b');
   if(k==='bucket'||k==='basket')ellipseStroke(c,0,-t-5,61,61,light,4);
   for(let i=0;i<8;i++)path(c,[[-60+i*17,-t+14],[-49+i*13,-2]],'#755e48',2);
   if(k==='manger')for(let i=0;i<15;i++)path(c,[[(i-7)*8,-t],[(i-7)*10,-t-20-i%5*3]],'#d2b47b',2);
  }
  return;
 }
 if(['drop','dropred','water','waves','calm','river','fountain','smoke'].includes(k)){
  if(k==='drop'||k==='dropred'){drop(c,0,-64,1.6,k==='dropred'?'#a35f52':'#a7c5bd');return;}
  if(k==='smoke'){
   for(let i=0;i<12;i++)oval(c,Math.sin(i)*12,-12-i*11,11+i*.8,14+i*.4,'rgba(210,201,179,.16)');
   return;
  }
  for(let j=0;j<8;j++)ellipseStroke(c,0,-j*3,115-j*10,8+j*2,'rgba(167,204,195,.45)',2.5);
  if(k==='fountain'||k==='water'){
   for(let j=0;j<9;j++)drop(c,(j-4)*10,-35-j%3*25,.35,'#98b5aa');
   if(k==='fountain')for(let j=0;j<7;j++)path(c,[[0,-9],[j*10-30,-150],[j*16-48,-20]],'rgba(172,211,204,.44)',3);
  }
  return;
 }
 switch(k){
  case 'crown':case 'banner':case 'palm':case 'sword':case 'spear':case 'shield':case 'trumpet':{
   if(k==='crown'){
    path(c,[[-62,-10],[-74,-87],[-37,-61],[-13,-105],[10,-66],[39,-89],[51,-61],[73,-85],[60,-10]],'#bc9152');
    path(c,[[-61,-19],[61,-19],[57,0],[-57,0]],light);
    for(const x of [-37,0,37])oval(c,x,-35,7,9,red);
   }else if(k==='shield'){
    path(c,[[0,-158],[65,-122],[46,-49],[0,0],[-45,-46],[-65,-123]],'#936f50');
    path(c,[[0,-142],[51,-115],[40,-55],[0,-14],[-35,-55],[-51,-115]],'#626d65');oval(c,0,-86,14,14,amber);
   }else if(k==='banner'||k==='palm'){
    path(c,[[-48,0],[-48,-191]],'#b19162',6);
    if(k==='banner')path(c,[[-45,-179],[66,-163],[38,-147],[62,-115],[-45,-126]],'#95605a');
    else for(let j=0;j<9;j++)path(c,[[-48,-183+j*5],[-18+j*8,-174+j*7]],'#8e9b6a',3.5);
   }else if(k==='trumpet'){
    path(c,[[-85,-63],[28,-70],[73,-103],[70,-39],[26,-58],[-85,-56]],'#b58a52');
    oval(c,72,-71,10,34,light);oval(c,74,-72,4,21,'#59463a');
   }else{
    path(c,[[-49,1],[61,-171]],'#684c3e',9);
    path(c,[[-31,-24],[73,-192],[66,-155],[-21,-26]],'#c6c7b2');
    if(k==='sword')path(c,[[-60,-55],[-19,-29]],amber,7);
   }
   break;
  }
  case 'halter':
   ellipseStroke(c,0,-36,49,35,'#b39976',9,.30);
   path(c,[[40,-47],[83,-13],[103,1]],'#a58a67',6);break;
  case 'rings':
   ellipseStroke(c,-37,-37,39,33,'#e1ba72',10,-.3);
   ellipseStroke(c,37,-34,39,33,'#bd965a',10,.27);
   break;
  case 'knocker':
   ellipseStroke(c,0,-66,29,33,amber,8);oval(c,0,-110,20,16,light);break;
  case 'scales':
   path(c,[[0,0],[0,-150]],amber,7);path(c,[[-75,-123],[0,-144],[75,-123]],light,6);
   for(const x of [-74,74]){
    path(c,[[x,-123],[x-28,-53],[x+28,-53],[x,-123]],'#b09366',1.9);oval(c,x,-51,31,9,amber);
   }
   break;
  case 'boat':
   path(c,[[-128,-38],[116,-38],[77,3],[-72,3]],'#664e3b');
   path(c,[[0,-35],[0,-175]],'#ac8b63',6);
   path(c,[[5,-160],[87,-48],[5,-43]],'#d5bf96');break;
  case 'bread':
   oval(c,0,-19,82,40,'#916641',-.09);oval(c,0,-24,76,34,'#c38e54',-.09);
   for(let i=0;i<4;i++)path(c,[[-49+i*26,-39],[-36+i*26,-23]],'#e4bb7d',5);
   break;
  case 'stalks':case 'reeds':case 'stalk':case 'rose':case 'lily':case 'grapes':{
   for(let i=0;i<7;i++){
    const x=(i-3)*17,y=-94+random(i)*37,col=k==='rose'?'#b27169':k==='lily'?'#e5dcc6':k==='grapes'?'#815f77':'#c5a575';
    path(c,[[i*5-20,0],[x,y]],'#83906e',3);
    if(k==='grapes')for(let j=0;j<6;j++)oval(c,x+Math.sin(j)*11,y+j*6,6,6,col);
    else for(let j=0;j<5;j++)oval(c,x+Math.cos(j*1.25)*9,y+Math.sin(j*1.25)*9,5.5,8,col,j);
   }break;
  }
  case 'torch':case 'lamp':case 'flame':case 'furnace':case 'brazier':case 'altar':
   if(k==='torch')path(c,[[0,0],[0,-70]],'#96714c',9);
   else if(k==='furnace'||k==='altar'){rect(c,-49,-44,98,44,'#8d7d63');arch(c,0,0,65,43,'#564037');}
   else oval(c,0,-8,45,14,'#7f644b');
   flame(c,0,k==='torch'?-70:-13,.82);break;
  case 'saw':case 'hammer':case 'bench':
   if(k==='bench'){
    rect(c,-95,-63,190,17,'#a27e5c');rect(c,57,-52,12,53,'#846854');rect(c,-70,-52,12,53,'#846854');
   }else if(k==='hammer'){
    path(c,[[-25,-1],[30,-117]],amber,11);path(c,[[-3,-128],[64,-106]],stone,20);
   }else{
    path(c,[[-84,-17],[62,-84],[77,-64],[-73,0]],stone);
    for(let i=0;i<10;i++)path(c,[[-64+i*13,-1-i*6],[-59+i*13,6-i*6],[-56+i*13,-7-i*6]],light);
    ellipseStroke(c,64,-75,21,21,amber,8);
   }break;
  case 'redmark':case 'sandal':case 'footprints':
   if(k==='redmark')path(c,[[-18,-110],[-8,-91],[6,-101],[15,-83]],'#a15e4c',6);
   else for(let j=0;j<3;j++)oval(c,(j-1)*36,-10-j*14,11,25,'#937554',-.3);
   break;
  case 'leaf':
   oval(c,0,-38,67,31,'#849474',-.42);path(c,[[-64,-12],[54,-62]],'#b6aa75',2.4);break;
  case 'serpent':case 'worm':case 'grasshopper':
   if(k==='grasshopper'){
    oval(c,0,-36,41,13,'#829970',-.15);
    path(c,[[-32,-35],[-47,-57],[-65,-12],[-28,-9]],'#acac73',4);
    path(c,[[19,-41],[44,-71],[57,-69]],'#a5a875',2);
   }else{
    const pts:Point[]=Array.from({length:26},(_,i)=>[(i-13)*6,-21+Math.sin(i*.56)*13]);
    path(c,pts,k==='worm'?'#b38a76':'#83916e',k==='worm'?9:12);oval(c,75,-30,10,7,'#a39b69');
   }break;
  case 'harp':{
   path(c,[[-39,0],[-30,-144],[65,-95],[12,-12],[-39,0]],'#c39a60',6);
   for(let i=0;i<10;i++)path(c,[[-27+i*8,-137+i*4.5],[-25+i*3,-6-i*1.2]],light,1.3);
   break;
  }
  case 'pillows':case 'honey':case 'gift':case 'ark':case 'statue':case 'tents':case 'roadpost':case 'headbody':{
   if(k==='headbody'||k==='statue'){person(c,k==='statue'?'elder':'teacher');break;}
   if(k==='tents'){path(c,[[-102,1],[0,-143],[102,1]],'#ac8e64');path(c,[[-24,0],[0,-73],[29,0]],'#695645');break;}
   if(k==='roadpost'){path(c,[[0,0],[0,-133]],amber,7);path(c,[[-54,-107],[50,-107],[72,-94],[51,-81],[-54,-81]],stone);break;}
   rect(c,-57,-73,114,74,k==='honey'?'#b68650':'#9a754d');
   rect(c,-62,-77,124,17,amber);rect(c,-5,-77,10,78,light);
   if(k==='gift')for(const dir of [-1,1])ellipseStroke(c,dir*16,-83,19,10,light,4,dir*.5);
   if(k==='ark')for(const dir of [-1,1])oval(c,dir*31,-89,13,19,amber,dir*.5);
   break;
  }
  default:throw new Error('Missing drawing: '+k);
 }
}
const placements:Record<string,readonly Placement[]>={
 throne_scroll:[[548,378,1.57],[444,326,.87]],lamb_throne:[[509,373,1.69],[496,323,1.12]],
 lamb_takes_scroll:[[590,365,1.4],[554,309,.62],[371,389,1.25]],
 angel_trumpet:[[439,393,1.32],[572,308,.95]],
 john_weeps:[[475,405,2.12]],
 lion_and_lamb:[[394,395,1.6],[652,395,1.31]],
 lion_eyes_lamb:[[370,402,1.6],[608,385,1.05]],
 lion_roars_lamb_rests:[[365,393,1.71],[659,403,1.16]],
 lion_rock:[[488,335,1.62],[493,419,1.89]],
 lamb_wounds:[[469,395,1.95],[461,462,.78]],
 lion_banner:[[292,393,.79],[635,393,1.77],[489,309,.65]],
 jacob_blesses:[[386,394,1.13],[489,416,.88],[573,410,1.12]],
 bucket_drop:[[474,404,1.65],[470,218,.83]],
 basin_towel:[[442,397,1.52],[609,408,.83]],
 crown_towel:[[390,375,1.53],[610,380,1.0]],
 sword_crown:[[370,400,1.03],[590,387,1.45]],
 donkey_king:[[471,429,1.64],[475,328,1.05],[703,411,.95]],
 garden_prayer:[[616,398,1.4],[395,402,1.5],[530,390,.73]],
 manger:[[474,420,1.46],[479,358,.73]],
 manger_vs_lion:[[612,420,1.18],[378,407,1.45]],
 parents:[[375,421,1.2],[561,420,1.1]],
 passover_door:[[475,418,1.7],[539,289,.80],[659,406,.75]],
 birth:[[480,385,1.65]],
 seven_seals:[[480,366,2.30]],
 parchment:[[480,375,2.18]],
 dark_veil:[[480,408,2.50]],
 spear:[[480,420,1.49],[637,403,1.14],[550,385,.49]],
 sleeping_disciples:[[340,410,1.34],[623,391,1.32],[514,409,1.0]],
 swine_cliff:[[399,331,.95],[510,371,.84],[569,449,1.45]],
 transfiguration:[[247,407,.93],[493,420,1.50],[491,408,1.33],[724,405,1]],
 cloud_voice:[[492,335,1.63],[495,397,1.48],[492,408,1.30]],
 walk_on_sea:[[304,401,1.17],[586,386,1.40],[608,418,1.45]],
 storm_calm:[[475,391,1.35],[509,416,2.25]],
 serpent_heel:[[472,404,1.60],[546,369,1.06]],
 lion_honey:[[394,398,1.62],[634,409,1.18]],
 samson_pillars:[[484,398,1.62],[489,400,1.12],[521,430,1.45]],
 dagon_ark:[[495,347,.83],[647,400,1.08],[373,414,1.15]],
 whale:[[538,382,2.09],[267,409,.65]],
 furnace_gold:[[416,404,1.74],[612,404,1.02]],
 ladder_down:[[495,423,1.63],[606,290,1.02]],ladder_up:[[478,428,1.63],[483,343,1.06]],
 door_knock:[[486,411,1.80],[535,356,1.13]],door_wait:[[450,414,1.62],[633,427,.97],[292,409,.61]],
 graves:[[495,411,1.4]],
 garden_tomb:[[268,415,1.05],[496,421,1.47],[704,417,1.10]],
 jerusalem_peace:[[481,410,1.85],[639,292,.93]],
 high_and_low:[[497,276,1.31],[498,415,1.39]],
 form_of_god:[[490,423,1.74],[493,309,1.52]],
 light_descends:[[481,425,1.73],[487,420,1.19]],
 moon_reflects:[[541,220,1.17],[538,396,2.32]],
 sun_rising:[[484,301,1.37]],
 morning_star:[[486,226,1.77],[494,434,1.62]],
 fountains_flock:[[476,389,1.38],[293,420,.95],[680,419,.93]],
 rose_lily:[[348,409,1.82],[609,405,1.74]],
 shared_throne:[[399,423,1.25],[488,403,1.10],[585,423,1.25]],
 trinity:[[483,415,1.94]],
};
function tableau(c:CanvasRenderingContext2D,key:string,setting:string,objects:readonly string[],index:number,elapsed=0){
 backdrop(c,setting,index);
 if(setting==='table'||key==='bread_wine'||key==='supper'||key==='kingdom_table'){
  path(c,[[77,380],[892,380],[960,470],[0,470]],'#705947');
  path(c,[[82,382],[888,382],[907,406],[57,406]],'#ac8760');
  for(let i=0;i<12;i++)path(c,[[0,417+i*5],[W,419+i*5]],'rgba(236,195,134,.14)',1);
 }
 const fixed=placements[key];
 const gap=Math.min(207,650/Math.max(1,objects.length-1));
 for(const [j,k] of objects.entries()){
  const placed=fixed?.[j];
  const x=placed?.[0]??480+(j-(objects.length-1)/2)*gap;
  let y=placed?.[1]??394+(j%2)*9;
  if(key==='bucket_drop'&&k==='drop')y+=Math.min(240,(elapsed%4)*85);
  if(key==='ladder_up'&&k==='traveler')y-=Math.min(92,elapsed*9);
  if(key==='ladder_down'&&k==='angel')y+=Math.min(82,elapsed*8);
  if(k==='boat')y+=Math.sin(elapsed*1.6)*5;
  if(k==='dove'||k==='birds')y+=Math.sin(elapsed*2+j)*8;
  const size=placed?.[2]??(objects.length===1?1.84:objects.length>3?.92:1.23);
  const skyObject=['star','sun','moon','beam','clouds','orbit','globe','circles','drop','dropred','smoke','knocker','dove','birds','angel'].includes(k);
  if(!skyObject)oval(c,x,y+2,75*size,13*size,'rgba(21,25,26,.27)');
  c.save();c.translate(x,y);c.scale(size,size);
  if(k==='knocker')c.rotate(Math.sin(elapsed*3)*.07);
  object(c,k);
  c.restore();
 }
 const vignette=c.createRadialGradient(482,230,167,482,230,570);
 vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'rgba(13,22,28,.58)');
 c.fillStyle=vignette;c.fillRect(0,0,W,H);
 c.fillStyle='rgba(248,225,184,.11)';
 for(let i=0;i<980;i++)c.fillRect((i*107.117)%W,(i*37.731)%H,1.1,1);
}

type Composition={readonly art:string;readonly setting:string;readonly objects:readonly string[]};

export function createExcellencyPainter(scenes:readonly Composition[]){
 const layers=new WeakMap<CanvasRenderingContext2D,{canvas:HTMLCanvasElement;context:CanvasRenderingContext2D;scene:number;frame:number}>();
 return (context:CanvasRenderingContext2D,art:string,time:number,elapsed:number,variant:number)=>{
  const scene=scenes[variant];
  if(!scene||scene.art!==art)throw new Error('Invalid Excellency artwork');
  let layer=layers.get(context);
  if(!layer){
   const canvas=document.createElement('canvas');
   canvas.width=W;canvas.height=H;
   const drawing=canvas.getContext('2d');
   if(!drawing)throw new Error('Could not create Excellency canvas');
   layer={canvas,context:drawing,scene:-1,frame:-1};
   layers.set(context,layer);
  }
  const moving=['bucket_drop','ladder_down','ladder_up','door_knock'].includes(art)||scene.objects.some(object=>['boat','dove','birds'].includes(object));
  const frame=moving?Math.floor(elapsed*8):0;
  if(layer.scene!==variant||layer.frame!==frame){
   tableau(layer.context,art,scene.setting,scene.objects,variant,elapsed);
   layer.scene=variant;layer.frame=frame;
  }
  const scale=time===0?1:1+Math.min(.065,elapsed*.002);
  context.drawImage(layer.canvas,-W*(scale-1)/2,-H*(scale-1)/2,W*scale,H*scale);
 };
}
