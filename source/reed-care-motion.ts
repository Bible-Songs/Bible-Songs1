// Organic, deterministic Canvas subjects. Every action is driven by the media clock.
const W=960,H=480;
type C=CanvasRenderingContext2D;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{const x=clamp(v);return x*x*(3-2*x);};
const mix=(a:number,b:number,p:number)=>a+(b-a)*p;
function ellipse(c:C,x:number,y:number,rx:number,ry:number,fill:string,angle=0){c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fillStyle=fill;c.fill();}
function stroke(c:C,draw:(c:C)=>void,color:string,width=2){c.beginPath();draw(c);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
function shape(c:C,draw:(c:C)=>void,fill:string|CanvasGradient){c.beginPath();draw(c);c.fillStyle=fill;c.fill();}
function linear(c:C,x1:number,y1:number,x2:number,y2:number,colors:readonly string[]){const g=c.createLinearGradient(x1,y1,x2,y2);colors.forEach((v,i)=>g.addColorStop(i/Math.max(1,colors.length-1),v));return g;}
function glow(c:C,x:number,y:number,r:number,color:string){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(255,219,147,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function background(c:C,inside:boolean,t:number){
 c.fillStyle=linear(c,0,0,0,H,inside?['#142c32','#394b47','#6e6a50']:['#183c46','#51716a','#849477']);c.fillRect(0,0,W,H);
 glow(c,inside?590:680,135,360,inside?'rgba(234,200,133,.17)':'rgba(241,230,178,.23)');
 if(inside){
  c.fillStyle='#223c3b';c.fillRect(90,0,23,345);c.fillRect(827,0,25,345);
  c.fillStyle=linear(c,0,327,0,H,['#74634c','#423e32']);c.fillRect(0,327,W,153);
  for(let i=0;i<12;i++)stroke(c,p=>{p.moveTo(0,346+i*13);p.bezierCurveTo(230,340+i*13,590,357+i*11,W,346+i*13);},'rgba(212,182,127,.09)',1);
 }else{
  shape(c,p=>{p.moveTo(0,267);p.bezierCurveTo(210,201,321,278,494,253);p.bezierCurveTo(680,221,825,225,W,255);p.lineTo(W,H);p.lineTo(0,H);p.closePath();},'#47665c');
  shape(c,p=>{p.moveTo(0,335);p.bezierCurveTo(220,307,350,369,550,330);p.bezierCurveTo(757,286,845,334,W,315);p.lineTo(W,H);p.lineTo(0,H);p.closePath();},'#2c5149');
  for(let i=0;i<8;i++){
   const x=55+i*126,wind=Math.sin(t*.47+i*.8)*9;
   stroke(c,p=>{p.moveTo(x,H);p.quadraticCurveTo(x+wind,399,x-7+wind,360-i%3*10);},'rgba(153,178,126,.31)',2);
  }
 }
 const vignette=c.createRadialGradient(480,253,200,480,253,600);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'rgba(7,24,29,.44)');c.fillStyle=vignette;c.fillRect(0,0,W,H);
}
function leaf(c:C,x:number,y:number,length:number,angle:number,tone:string,unfurl=1){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(1,Math.max(.06,unfurl));
 shape(c,p=>{p.moveTo(0,0);p.bezierCurveTo(length*.19,-length*.24,length*.71,-length*.32,length,0);p.bezierCurveTo(length*.66,length*.15,length*.22,length*.20,0,0);},linear(c,0,-length*.2,0,length*.2,[tone,'#577d51']));
 stroke(c,p=>{p.moveTo(0,0);p.quadraticCurveTo(length*.55,-2,length*.95,0);},'rgba(215,222,160,.54)',1.1);c.restore();
}
function hand(c:C,x:number,y:number,scale:number,angle:number,curl:number,sleeve='#b4b29a',frail=false){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);
 const skin=linear(c,-30,-45,30,25,frail?['#c5a98c','#e1c4a2','#ac886a']:['#9f7658','#d2ae84','#b48965']);
 shape(c,p=>{p.moveTo(-122,26);p.lineTo(-27,11);p.lineTo(-16,-19);p.lineTo(-119,-29);p.closePath();},linear(c,-120,-30,-20,25,[sleeve,'#696e61']));
 shape(c,p=>{p.moveTo(-35,9);p.bezierCurveTo(-23,16,-6,22,10,18);p.bezierCurveTo(29,15,34,1,22,-13);p.bezierCurveTo(12,-24,-5,-29,-23,-20);p.lineTo(-37,-12);p.closePath();},skin);
 // Four fingers curve independently over the palm, rather than forming a flat mitten.
 for(let i=3;i>=0;i--){
  const yy=-19+i*8,reach=38-i*3,fold=curl*(20+i*3);
  stroke(c,p=>{p.moveTo(1,yy+7);p.bezierCurveTo(16,yy-3,reach,yy-11,reach-fold*.25,yy+fold);},'#a98465',9.2);
  stroke(c,p=>{p.moveTo(1,yy+6);p.bezierCurveTo(16,yy-3,reach-1,yy-10,reach-1-fold*.25,yy+fold-1);},'#d6b38b',6.2);
  if(frail)stroke(c,p=>{p.moveTo(13,yy+1);p.lineTo(17,yy+1);},'rgba(125,91,67,.44)',.9);
 }
 stroke(c,p=>{p.moveTo(-19,7);p.bezierCurveTo(-4,1,3,-19,12,-25+curl*11);},'#ba926c',13);
 stroke(c,p=>{p.moveTo(-20,6);p.bezierCurveTo(-4,-1,3,-18,11,-25+curl*11);},'#ddba92',8);
 stroke(c,p=>{p.moveTo(-18,-2);p.quadraticCurveTo(-8,5,8,7);},'rgba(134,94,66,.39)',1.2);
 if(frail)for(let i=0;i<3;i++)stroke(c,p=>{p.moveTo(-29+i*8,-13);p.quadraticCurveTo(-26+i*8,-3,-19+i*7,2);},'rgba(132,100,78,.29)',1);
 c.restore();
}
function reed(c:C,t:number,elapsed:number){
 background(c,false,t);c.fillStyle=linear(c,0,329,0,H,['#557b73','#173f49']);c.fillRect(0,329,W,151);
 const sway=Math.sin(t*.61)*7,care=ease(elapsed/7),support=care*(1+.06*Math.sin(t*.45));
 // Marsh reeds move at different depths; foreground central stem remains attached.
 for(let i=0;i<12;i++){
  const x=55+i*76,h=90+(i%4)*23,bend=Math.sin(t*.65+i)*9;
  stroke(c,p=>{p.moveTo(x,424);p.quadraticCurveTo(x+bend*.6,424-h*.5,x+bend,424-h);},i%2?'#708e68':'#8c9e72',2.8);
  ellipse(c,x+bend,417-h,4.4,18,'#9c8d61',bend*.02);
 }
 const jointX=465+sway*.28,jointY=251-support*6,tipX=609+sway*.9-support*27,tipY=330-support*47;
 stroke(c,p=>{p.moveTo(452,421);p.bezierCurveTo(441,366,453,302,jointX,jointY);p.quadraticCurveTo(518,273,tipX,tipY);},'#485f42',15);
 stroke(c,p=>{p.moveTo(449,419);p.bezierCurveTo(443,355,452,302,jointX-2,jointY);p.quadraticCurveTo(516,273,tipX-2,tipY);},'#b4bc7e',9);
 for(const y of [294,347,391])stroke(c,p=>{p.moveTo(444,y);p.lineTo(459,y-1);},'#d6d5a0',3);
 ellipse(c,jointX,jointY,12,9,'#79583c',.45);
 for(let i=0;i<7;i++)stroke(c,p=>{p.moveTo(jointX-8+i*2,jointY-10);p.quadraticCurveTo(jointX+5+i*3,jointY+2,jointX+22+i*3,jointY+10);},'#e0d0a0',1.2);
 leaf(c,450,365,99,-2.5+Math.sin(t*.7)*.045,'#afbf82');leaf(c,514,280-support*4,95,-.30+Math.sin(t*.8+1)*.055,'#9baf73');
 c.save();c.translate(tipX,tipY);c.rotate(-.55-support*.006);ellipse(c,0,9,9,34,'#9a7950');stroke(c,p=>{p.moveTo(-3,-19);p.lineTo(2,38);},'#c9ab76',2);c.restore();
 // A hand approaches and a light band progressively supports the bruised joint.
 const hx=mix(787,530,care),hy=mix(364,283,care)+Math.sin(t*.5)*1.3;
 hand(c,hx,hy,1.18,-.40,care*.36,'#c0b79a');
 if(care>.28){c.globalAlpha=ease((care-.28)/.45);for(let i=0;i<4;i++)stroke(c,p=>{p.moveTo(jointX-12,jointY+8+i*4);p.quadraticCurveTo(jointX+8,jointY+18+i*4,jointX+24,jointY+10+i*4);},'#ded0ac',4.5);c.globalAlpha=1;}
 for(let i=0;i<15;i++){
  const y=355+i*8,shift=Math.sin(t*.57+i)*11;
  stroke(c,p=>{p.moveTo(110+(i*71)%325+shift,y);p.quadraticCurveTo(200+(i*71)%325,y-4,278+(i*71)%325+shift,y);},'rgba(181,206,179,.22)',1.4);
 }
 glow(c,503,294,115,'rgba(235,215,150,.11)');
}
function flame(c:C,x:number,y:number,size:number,t:number,wind:number){
 const flicker=1+Math.sin(t*5.2)*.07+Math.sin(t*8.1)*.035,lean=wind*size*.18;
 glow(c,x,y-size*.65,size*3.8,`rgba(246,185,70,${.15+.025*Math.sin(t*4)})`);
 shape(c,p=>{p.moveTo(x,y);p.bezierCurveTo(x-size*.7,y-size*.25,x-size*.6+lean,y-size*.97,x+lean,y-size*1.7*flicker);p.bezierCurveTo(x+size*.56+lean,y-size*.9,x+size*.62,y-size*.20,x,y);},linear(c,x,y-size*1.8,x,y,['#f0c071','#e9973e','#b66326']));
 shape(c,p=>{p.moveTo(x,y-1);p.quadraticCurveTo(x-size*.22,y-size*.6,x+lean*.4,y-size*.96);p.quadraticCurveTo(x+size*.29,y-size*.4,x,y-1);},'#fff0b3');
}
function lamp(c:C,t:number,elapsed:number){
 background(c,true,t);const shield=ease(elapsed/6),wind=(1-shield*.8)*Math.sin(t*1.8);
 ellipse(c,470,393,235,26,'rgba(9,24,25,.42)');
 shape(c,p=>{p.moveTo(280,321);p.bezierCurveTo(309,360,359,388,493,383);p.bezierCurveTo(574,381,624,341,666,302);p.bezierCurveTo(595,309,576,304,550,296);p.bezierCurveTo(455,282,331,288,280,321);},linear(c,0,290,0,388,['#e0bb76','#a98247','#554732']));
 ellipse(c,425,310,140,33,'#d3b16d');ellipse(c,425,307,111,23,'#50432b');ellipse(c,425,307,95,15,'#6e5d34');
 c.strokeStyle='#c0a368';c.lineWidth=15;c.beginPath();c.ellipse(286,321,37,29,-.2,0,Math.PI*2);c.stroke();
 stroke(c,p=>{p.moveTo(328,349);p.bezierCurveTo(392,374,503,372,553,341);},'#e1c383',3.5);
 stroke(c,p=>{p.moveTo(567,315);p.lineTo(609+wind*2,287);},'#4d3c2b',8);stroke(c,p=>{p.moveTo(567,314);p.lineTo(608+wind*2,286);},'#cfc19a',2);
 ellipse(c,610,286,4.5,3,'#d68b43');flame(c,610,284,13+shield*5,t,wind);
 // Smoke follows the same wind that bends the living flame.
 for(let j=0;j<4;j++){
  const rise=(t*.19+j*.25)%1,yy=266-rise*147,xx=612+Math.sin(rise*5+t*.4)*21+wind*rise*18;
  stroke(c,p=>{p.moveTo(xx,yy);p.bezierCurveTo(xx-17,yy-14,xx+22,yy-30,xx+7,yy-43);},`rgba(190,197,183,${.19*(1-rise)})`,5+rise*10);
 }
 hand(c,mix(848,704,shield),mix(328,250,shield)+Math.sin(t*.8)*1.6,1.55,-1.32,.12+Math.sin(t*.7)*.025,'#c8b98f');
 for(let i=0;i<3;i++)stroke(c,p=>{const xx=375+i*61+Math.sin(t*.6+i)*4;p.moveTo(xx,307);p.quadraticCurveTo(xx+13,304,xx+29,308);},`rgba(246,214,131,${.10+.06*Math.sin(t+i)})`,1.5);
}
function growth(c:C,t:number,elapsed:number){
 background(c,false,t);const grow=.40+.60*ease(elapsed/12),unfurl=.45+.55*ease(elapsed/8),sway=Math.sin(t*.72)*3;
 shape(c,p=>{p.moveTo(149,341);p.bezierCurveTo(343,324,635,324,813,343);p.lineTo(813,477);p.lineTo(149,477);p.closePath();},linear(c,0,338,0,480,['#8a7752','#514a37']));
 for(let i=0;i<70;i++)ellipse(c,162+(i*73)%634,352+(i*43)%117,1.8+i%3,1.2,'rgba(201,173,120,.24)');
 const root=ease((elapsed+.7)/10);
 for(let i=0;i<9;i++){
  const dir=(i-4)*.26,endX=480+Math.sin(dir)*137*root,endY=351+(75+Math.cos(i)*19)*root;
  stroke(c,p=>{p.moveTo(480,342);p.bezierCurveTo(476+Math.sin(i)*25,370,endX,endY-24,endX,endY);},i%2?'#c4ae7a':'#9f9862',3.4-i%3*.5);
  if(root>.5)stroke(c,p=>{p.moveTo(mix(480,endX,.7),mix(342,endY,.7));p.quadraticCurveTo(endX+16,endY-5,endX+24,endY+8);},'#b8a471',1.4);
 }
 const top=340-200*grow;
 stroke(c,p=>{p.moveTo(480,342);p.bezierCurveTo(473,285,488+sway,215,480+sway,top);},'#496b43',10);
 stroke(c,p=>{p.moveTo(478,340);p.bezierCurveTo(473,285,484+sway,215,478+sway,top);},'#bed092',3);
 for(let i=0;i<5;i++){
  const y=315-i*36*grow,side=i%2?1:-1,angle=side>0?-.38:-2.7;
  leaf(c,480+sway*(i/5),y,58+i*8,angle+Math.sin(t*.8+i)*.04,'#96b978',unfurl);
 }
 // Water trickles down and visibly feeds the roots rather than decorative particles.
 stroke(c,p=>{p.moveTo(714,256);p.bezierCurveTo(692,284,710,310,684,333);p.quadraticCurveTo(632,353,551,382);},'rgba(155,203,190,.42)',6);
 for(let j=0;j<5;j++){const p=(t*.18+j*.2)%1;ellipse(c,mix(710,554,p),mix(270,382,p),3,6,`rgba(197,227,207,${.65-p*.3})`,-.5);}
 glow(c,492,231,143,'rgba(230,232,171,.09)');
}
function person(c:C,x:number,y:number,s:number,t:number,helper:boolean,bend=0){
 c.save();c.translate(x,y);c.scale(s,s);const breath=Math.sin(t*1.7)*1.3;c.rotate(bend);
 ellipse(c,0,3,60,12,'rgba(9,22,23,.28)');
 shape(c,p=>{p.moveTo(-27,-133+breath);p.bezierCurveTo(-45,-95,-38,-52,-62,0);p.quadraticCurveTo(0,13,60,-1);p.bezierCurveTo(31,-54,40,-96,24,-134+breath);p.closePath();},linear(c,-40,0,35,-130,helper?['#7d806d','#b6b299','#d0c4a3']:['#345b64','#547e83','#9aaf9b']));
 for(let i=0;i<4;i++)stroke(c,p=>{p.moveTo(-18+i*13,-104+breath);p.quadraticCurveTo(-27+i*17,-53,-32+i*20,-2);},helper?'rgba(91,97,80,.35)':'rgba(29,65,71,.35)',2);
 ellipse(c,0,-158+breath,22,29,'#b68f69',-.05);
 shape(c,p=>{p.moveTo(-22,-150+breath);p.bezierCurveTo(-31,-192,25,-195,25,-150+breath);p.lineTo(15,-163+breath);p.quadraticCurveTo(4,-185,-17,-159+breath);p.closePath();},'#544b3c');
 stroke(c,p=>{p.moveTo(7,-162+breath);p.lineTo(12,-160+breath);},'#5d503d',1.3);stroke(c,p=>{p.moveTo(5,-147+breath);p.quadraticCurveTo(9,-144+breath,14,-146+breath);},'#785a44',1);
 c.restore();
}
function healing(c:C,t:number,elapsed:number){
 background(c,true,t);const tend=ease(elapsed/7),breath=Math.sin(t*1.5)*1.2;
 // A seated person receives a real bandage, with cloth following the moving arm.
 c.fillStyle='#625841';c.fillRect(334,342,121,14);c.fillRect(349,355,13,65);c.fillRect(428,355,13,65);
 person(c,397,376,1.18,t,false,.10);person(c,661,403,1.42,t,true,-.10);
 const armY=283+breath;
 stroke(c,p=>{p.moveTo(426,257+breath);p.quadraticCurveTo(457,armY,503,armY+3);},'#b89472',17);
 hand(c,509,armY+3,.65,.05,.35,'#637f7b');
 const handX=mix(680,505,tend),handY=mix(241,285,tend)+Math.sin(t*.8)*1.1;
 hand(c,handX,handY,1.06,.16,.3,'#c4bea2');
 if(tend>.2){
  c.globalAlpha=ease((tend-.2)/.5);
  for(let i=0;i<7;i++)stroke(c,p=>{p.moveTo(474+i*4,armY-8);p.quadraticCurveTo(481+i*4,armY+1,476+i*4,armY+12);},i%2?'#c0b899':'#e0d8ba',4.4);
  shape(c,p=>{p.moveTo(482,armY+9);p.quadraticCurveTo(502+Math.sin(t*.8)*2,333,482,355);p.lineTo(468,354);p.quadraticCurveTo(485,324,480,armY+12);},'#cfc7a7');c.globalAlpha=1;
 }
 glow(c,506,285,160,'rgba(239,216,156,.12)');
}
function burden(c:C,t:number,elapsed:number){
 background(c,false,t);const lay=ease(elapsed/8),walk=(1-lay)*Math.sin(t*3.2),x=mix(311,430,lay),lean=mix(.20,.02,lay);
 shape(c,p=>{p.moveTo(160,H);p.bezierCurveTo(335,377,505,326,819,320);p.lineTo(912,H);p.closePath();},'#91866b');
 person(c,x,405,1.45,t,false,lean);person(c,698,405,1.53,t,true);
 for(const side of [-1,1])stroke(c,p=>{p.moveTo(x+side*12,378);p.lineTo(x+side*19+walk*side*12,412);},'#544f3f',10);
 const bx=mix(x-42,529,lay),by=mix(254,385,lay),rotation=mix(-.26,.08,lay);
 c.save();c.translate(bx,by);c.rotate(rotation);ellipse(c,0,15,61,10,'rgba(16,34,31,.25)');
 shape(c,p=>{p.moveTo(-42,-76);p.quadraticCurveTo(3,-93,42,-68);p.lineTo(52,-3);p.quadraticCurveTo(-2,23,-53,-2);p.closePath();},linear(c,-45,-80,50,10,['#907751','#c1a16d','#796548']));
 stroke(c,p=>{p.moveTo(-32,-69);p.quadraticCurveTo(1,-47,37,-66);},'#d9bb80',4);stroke(c,p=>{p.moveTo(-12,-77);p.lineTo(-4,12);},'#725d40',5);c.restore();
 const hx=mix(x+29,540,lay),hy=mix(284,351,lay);hand(c,hx,hy,.74,.18,1-lay,'#839d8a');
 // The caregiver opens an arm as the traveller releases the weight.
 hand(c,623+Math.sin(t*.6)*2,284-lay*8,1.12,mix(-.3,-.12,lay),.06,'#c3bba0');
 glow(c,608,315,180,'rgba(230,221,162,.09)');
}
function jewel(c:C,x:number,y:number,t:number){
 const turn=Math.sin(t*.65)*.07;c.save();c.translate(x,y);c.rotate(turn);
 const points:readonly (readonly [number,number])[]=[[-33,-14],[-19,-32],[19,-32],[35,-13],[0,29]];
 shape(c,p=>{points.forEach(([xx,yy],i)=>i?p.lineTo(xx,yy):p.moveTo(xx,yy));p.closePath();},'#78b6b8');
 const facets:readonly {p:readonly (readonly [number,number])[];col:string}[]=[
  {p:[[-33,-14],[-19,-32],[-8,-13]],col:'#d2eee0'},{p:[[-19,-32],[19,-32],[-8,-13]],col:'#a8d8ce'},
  {p:[[19,-32],[35,-13],[12,-13]],col:'#e0f5df'},{p:[[-33,-14],[-8,-13],[0,29]],col:'#4e8f9e'},
  {p:[[-8,-13],[12,-13],[0,29]],col:'#b9e4d4'},{p:[[12,-13],[35,-13],[0,29]],col:'#326f89'},
 ];
 for(const f of facets)shape(c,p=>{f.p.forEach(([xx,yy],i)=>i?p.lineTo(xx,yy):p.moveTo(xx,yy));p.closePath();},f.col);
 const light=.45+.4*Math.sin(t*1.7);stroke(c,p=>{p.moveTo(-30,-13);p.lineTo(33,-13);p.moveTo(-19,-31);p.lineTo(0,28);p.lineTo(19,-31);},`rgba(238,255,228,${light})`,1.5);
 glow(c,0,-12,68,'rgba(188,235,213,.16)');c.restore();
}
function receive(c:C,t:number,elapsed:number){
 background(c,true,t);const take=ease(elapsed/7),lower=mix(199,304,take),curl=.02+take*.33;
 ellipse(c,479,389,220,24,'rgba(13,29,29,.33)');
 // Weakness is in the receiving hand, not in the worth of the gift.
 hand(c,485,333+Math.sin(t*.9)*1.3,2.05,-.08,curl,'#788e86',true);
 if(take<.98)hand(c,565+ease((take-.72)/.28)*97,lower-23,1.20,2.73,mix(.67,.04,take),'#c4b69b');
 jewel(c,519,lower,t);glow(c,519,lower,130,'rgba(229,231,172,.12)');
}
export function paintCare(c:CanvasRenderingContext2D,theme:string,time:number,elapsed:number,variant:number):void{
 const t=time+variant*.37;
 c.save();
 switch(theme){
  case 'reed-care':reed(c,t,elapsed);break;
  case 'flame-care':lamp(c,t,elapsed);break;
  case 'gradual-growth':growth(c,t,elapsed);break;
  case 'healing-care':healing(c,t,elapsed);break;
  case 'burden-rest':burden(c,t,elapsed);break;
  case 'weak-hand-jewel':receive(c,t,elapsed);break;
  default:throw new Error('Unknown care illustration '+theme);
 }
 c.restore();
}
