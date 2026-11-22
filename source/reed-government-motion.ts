// New subject animation for The Bruised Reed. Each scene has an articulated action;
// the camera remains fixed. All movement is deterministic from the media clock.
type Point=readonly [number,number];
type Pose='walk'|'guide'|'pray'|'helper'|'guard'|'weigh'|'welcome'|'blind'|'blind-guide';
const W=960,H=480,TAU=Math.PI*2;
const cream='#f1dfb7',gold='#cfaa60',skin='#c99971';
function clamp(v:number,a=0,b=1){return Math.max(a,Math.min(b,v));}
function ease(v:number){const x=clamp(v);return x*x*(3-2*x);}
function oval(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string,angle=0){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,TAU);c.fill();}
function stroke(c:CanvasRenderingContext2D,points:readonly Point[],color:string,width=3){c.beginPath();for(const [i,p]of points.entries()){if(i)c.lineTo(...p);else c.moveTo(...p);}c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
function poly(c:CanvasRenderingContext2D,points:readonly Point[],color:string){c.beginPath();for(const [i,p]of points.entries()){if(i)c.lineTo(...p);else c.moveTo(...p);}c.closePath();c.fillStyle=color;c.fill();}
function gradient(c:CanvasRenderingContext2D,x:number,y:number,x2:number,y2:number,a:string,b:string){const g=c.createLinearGradient(x,y,x2,y2);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
function glow(c:CanvasRenderingContext2D,x:number,y:number,r:number,color:string,alpha=.4){c.save();c.globalAlpha=alpha;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore();}
function curve(c:CanvasRenderingContext2D,from:Point,p1:Point,p2:Point,to:Point,color:string,width:number){c.beginPath();c.moveTo(...from);c.bezierCurveTo(...p1,...p2,...to);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
function room(c:CanvasRenderingContext2D,t:number){
 c.fillStyle=gradient(c,0,0,W,H,'#172f38','#6c725c');c.fillRect(0,0,W,H);
 for(let i=0;i<5;i++){const x=88+i*188;c.fillStyle='#41514b';c.fillRect(x-53,90,106,249);c.beginPath();c.arc(x,90,53,Math.PI,0);c.fill();c.fillStyle='#263d3d';c.fillRect(x-43,90,86,247);c.beginPath();c.arc(x,90,43,Math.PI,0);c.fill();stroke(c,[[x-56,82],[x-56,344]],'#8d9375',5);}
 c.fillStyle=gradient(c,0,332,0,H,'#6a6d55','#384d43');c.fillRect(0,332,W,148);
 for(let i=0;i<10;i++)stroke(c,[[480+(i-4.5)*41,333],[(i-4.5)*147+480,H]],'rgba(212,193,140,.12)',2);
 for(let i=0;i<5;i++)stroke(c,[[0,348+i*i*7],[W,348+i*i*7]],'rgba(212,193,140,.12)',1);
 const light=.14+Math.sin(t*.35)*.025;poly(c,[[115,73],[186,73],[744,450],[354,450]],`rgba(244,217,158,${light})`);
 c.fillStyle='#a1a07c';c.fillRect(111,65,79,132);c.fillStyle='#d9d6ad';c.fillRect(121,75,59,111);stroke(c,[[150,75],[150,186]],'#7e8566',6);stroke(c,[[120,124],[180,124]],'#7e8566',5);
}
function landscape(c:CanvasRenderingContext2D,t:number){
 c.fillStyle=gradient(c,0,0,0,H,'#9cb8b5','#e2d5a9');c.fillRect(0,0,W,H);
 poly(c,[[0,266],[131,216],[293,241],[435,193],[584,225],[727,196],[960,245],[960,H],[0,H]],'#7e9980');
 poly(c,[[0,296],[189,265],[343,292],[535,253],[762,279],[960,250],[960,H],[0,H]],'#587a67');
 c.fillStyle=gradient(c,0,286,0,H,'#657f60','#2c584c');c.fillRect(0,308,W,172);
 poly(c,[[471,275],[521,275],[836,H],[123,H]],'#b8ad82');
 for(let i=0;i<28;i++){const p=(i/28+t*.035)%1,y=296+p*p*184,x=480+Math.sin(i*6.31)*(35+p*270);oval(c,x,y,2+p*7,1+p*2,'rgba(229,215,163,.35)');}
 for(let i=0;i<16;i++){const x=i*69+12,y=347+i%3*31;stroke(c,[[x,y+38],[x+3+Math.sin(t*.6+i)*2,y]],'#486e53',2);stroke(c,[[x+1,y+22],[x-7,y+11]],'#819367',2);}
}
function finish(c:CanvasRenderingContext2D){
 const shade=c.createRadialGradient(480,241,210,480,241,600);shade.addColorStop(0,'transparent');shade.addColorStop(1,'rgba(14,36,38,.38)');c.fillStyle=shade;c.fillRect(0,0,W,H);
}
function hand(c:CanvasRenderingContext2D,x:number,y:number,angle:number,open=.6){
 c.save();c.translate(x,y);c.rotate(angle);
 c.fillStyle=gradient(c,-8,-5,8,8,'#e2b68e','#a67152');c.beginPath();c.ellipse(0,1,9,12,0,0,TAU);c.fill();
 for(let i=0;i<4;i++){const fx=-6+i*4.1,len=11+Math.sin((i+.5)*.8)*4;curve(c,[fx,-3],[fx-2*open,-9],[fx+(i-1.5)*open*3,-len],[fx+(i-1.5)*open*4,-len-1],skin,3.6);}
 curve(c,[-6,2],[-12,0],[-15,-5],[-12,-8],skin,4.7);c.restore();
}
function limb(c:CanvasRenderingContext2D,a:Point,b:Point,d:Point,color:string,width:number,withHand=false,handAngle=0){
 stroke(c,[a,b,d],color,width);stroke(c,[[a[0]-width*.18,a[1]],[b[0]-width*.18,b[1]],[d[0]-width*.18,d[1]]],'rgba(242,223,180,.22)',width*.2);
 if(withHand)hand(c,d[0],d[1],handAngle);
}
function head(c:CanvasRenderingContext2D,x:number,y:number,tilt:number,older=false){
 c.save();c.translate(x,y);c.rotate(tilt);
 oval(c,-1,-2,22,28,'#493b31');
 c.fillStyle=gradient(c,-18,-23,17,24,'#e3bd92','#ac7d59');c.beginPath();c.moveTo(-16,-20);c.bezierCurveTo(5,-30,21,-13,19,2);c.bezierCurveTo(26,4,27,10,19,10);c.bezierCurveTo(19,27,1,31,-11,22);c.bezierCurveTo(-23,10,-21,-10,-16,-20);c.fill();
 oval(c,-16,4,5,8,'#bc8b65');curve(c,[-20,-14],[-14,-37],[11,-35],[19,-15],older?'#b5b19a':'#554334',10);
 stroke(c,[[5,-6],[13,-5]],'#6b4f3a',2);oval(c,11,-1,1.5,1.5,'#303c35');curve(c,[19,4],[23,8],[20,10],[16,10],'#946c4c',1.7);curve(c,[8,17],[12,20],[17,19],[19,16],'#885e44',1.6);
 if(older){poly(c,[[-8,12],[0,19],[21,13],[12,39],[0,43],[-11,23]],'#c3bfaa');for(let i=0;i<5;i++)stroke(c,[[-6+i*5,21],[i*3,37]],'#e1d7bc',1.2);}
 c.restore();
}
function person(c:CanvasRenderingContext2D,x:number,y:number,s:number,t:number,pose:Pose,facing=1,color='#68887a',target?:Point){
 const gait=Math.sin(t*1.7),walking=pose==='walk'||pose==='guide'||pose==='blind'||pose==='blind-guide',praying=pose==='pray';
 c.save();c.translate(x,y);c.scale(s*facing,s);c.translate(0,walking?-Math.abs(gait)*4:Math.sin(t*.8)*1.4);
 const top=praying?-142:-171,neck=praying?-152:-183,hips=praying?-47:-72;
 oval(c,0,4,57,12,'rgba(15,39,36,.22)');
 if(praying){
  limb(c,[-14,-55],[-53,-8],[-11,0],'#394d48',17);limb(c,[12,-54],[50,-8],[77,0],'#4b5d4f',17);oval(c,73,1,20,8,'#4c4938');
 }else for(const i of [-1,1]){
  const stride=walking?gait*i:0,hip:Point=[i*15,hips],knee:Point=[i*17+stride*19,-37-Math.max(0,stride)*7],foot:Point=[i*18+stride*34,-4-Math.max(0,-stride)*10];
  limb(c,hip,knee,foot,i===-1?'#3c514a':'#637361',15);oval(c,foot[0]+8,foot[1]+3,19,7,'#514d3b',stride*.06);
 }
 // Far arm sits behind the robe, with a visible articulated elbow and wrist.
 const wave=Math.sin(t*.8),rise=(Math.sin(t*.65)+1)/2;
 const farEnd:Point=pose==='welcome'?[-91,-117+wave*3]:pose==='blind-guide'?[-45,-97]:pose==='blind'?[-35,-85]:praying?[33,-160-rise*17]:pose==='guard'?[50,-126]:pose==='helper'?[104,-142+wave*2]:walking?[32-gait*22,-90]:[37,-92];
 limb(c,[-25,top+9],[-43,top+47],farEnd,'#526e63',20,true,praying?.55:1.4);
 c.fillStyle=gradient(c,-38,top,45,-32,'#9bad89',color);c.beginPath();c.moveTo(-26,top);c.bezierCurveTo(-45,top+18,-31,hips-10,-52,-31);c.quadraticCurveTo(-4,-17,54,-32);c.bezierCurveTo(35,hips,44,top+21,24,top);c.quadraticCurveTo(-2,top-12,-26,top);c.fill();
 for(let i=0;i<5;i++){const xx=-29+i*14;curve(c,[xx,top+47],[xx+gait*2,hips],[xx-7,-52],[xx+(walking?gait*3:wave),-32],'rgba(36,66,57,.45)',2.5);}
 stroke(c,[[-32,top+54],[31,top+54]],'#b3a477',6);curve(c,[5,top+53],[12,hips],[4,-41],[13,-29],'#d2be8a',3);
 const end:Point=target??(pose==='welcome'?[91,-117+wave*3]:pose==='blind'?[88,-111]:praying?[11,-153-rise*19]:pose==='guide'?[78,-115+Math.sin(t*.7)*4]:pose==='guard'?[84,-119+wave*2]:pose==='helper'?[128,-145+wave*1.2]:pose==='weigh'?[87+rise*19,-130-rise*27]:[36+gait*21,-81]);
 let elbow:Point=pose==='welcome'?[48,-139]:pose==='blind'?[49,-119]:praying?[-23,-119]:pose==='guard'?[40,-142]:pose==='helper'?[77,-157]:pose==='guide'?[45,-137]:pose==='weigh'?[40,-118]:[46+gait*13,-125];
 if(target){
  const sx=25,sy=top+11,dx=target[0]-sx,dy=target[1]-sy,d=Math.max(.1,Math.hypot(dx,dy)),length=Math.min(119,d),along=(55*55-65*65+length*length)/(2*length),height=Math.sqrt(Math.max(0,55*55-along*along));
  elbow=[sx+dx/d*along-dy/d*height,sy+dy/d*along+dx/d*height];
 }
 limb(c,[25,top+11],elbow,end,color,22,true,praying?-.3:pose==='guard'?.35:pose==='helper'?1.6:pose==='guide'?1.1:.5);
 stroke(c,[[end[0]-6,end[1]+7],[end[0]+8,end[1]+6]],cream,3);
 head(c,praying?5:2,neck-17,praying?.17+Math.sin(t*.5)*.025:walking?gait*.018:pose==='helper'?-.12:0,pose==='guide');
 c.restore();
}
function book(c:CanvasRenderingContext2D,x:number,y:number,s:number,t:number){
 c.save();c.translate(x,y);c.scale(s,s);const flutter=Math.sin(t*.8)*4;
 poly(c,[[-58,4],[-59,-56],[-7,-45],[0,-35],[7,-45],[59,-56],[58,4],[4,17],[-4,17]],'#725b3c');
 poly(c,[[-53,0],[-53,-51],[-9,-41],[-3,-32],[-3,11]],'#e9d5a9');poly(c,[[3,11],[3,-32],[9,-41],[53,-51],[53,0]],'#f4e4bd');
 for(let i=0;i<6;i++){stroke(c,[[-45,-39+i*7],[-13,-30+i*7]],'#ad9e79',1.1);stroke(c,[[13,-30+i*7],[45,-39+i*7]],'#bdac82',1.1);}
 c.save();c.globalAlpha=.6;poly(c,[[3,-32],[15+flutter,-48],[45,-55],[29+flutter,-24],[3,11]],'#fbebc0');c.restore();stroke(c,[[0,-31],[0,13]],'#aa9465',2);c.restore();
}
function lamp(c:CanvasRenderingContext2D,x:number,y:number,t:number){
 oval(c,x,y+5,34,10,'#9a7e44');poly(c,[[x-31,y],[x-20,y+13],[x+22,y+13],[x+44,y-7],[x+17,y-4]],'#bd9c55');
 stroke(c,[[x+32,y-5],[x+36,y-17]],'#4d5038',4);const w=Math.sin(t*3)*2;glow(c,x+36,y-26,73,'#ffe4a0',.37);
 c.fillStyle='#e3b459';c.beginPath();c.moveTo(x+35,y-14);c.bezierCurveTo(x+23,y-23,x+42+w,y-35,x+35+w,y-43);c.bezierCurveTo(x+51,y-29,x+46,y-18,x+35,y-14);c.fill();oval(c,x+37,y-22,3,7,'#fff0c3');
}
function wiseGuidance(c:CanvasRenderingContext2D,t:number){
 landscape(c,t);const step=t*1.4,advance=Math.sin(t*.2)*24;
 glow(c,471+advance,326,169,'#e4db9a',.19);
 person(c,365+advance,433,1.03,step,'guide',1,'#657f70');person(c,615+advance,445,.98,step-.5,'walk',1,'#8e8a68');
 const handY=433-115*1.03+Math.sin(step*.7)*4;book(c,445+advance,handY+8,.74,t);lamp(c,314+advance,321+Math.sin(step*1.7)*6,t);
 for(let i=0;i<5;i++){const q=(t*.17+i*.2)%1;oval(c,500+q*235,397+q*39,12+q*6,3,'rgba(244,225,160,.23)');}
}
function prayerHelp(c:CanvasRenderingContext2D,t:number){
 // The kneeler faces the open book and window light with raised hands; the companion's
 // hand rests on his back in support (Claude review 22 Nov: facing him read as a scuffle).
 room(c,t);person(c,608,429,.91,t,'helper',-1,'#799380');person(c,452,435,1.06,t,'pray',-1,'#6f8793');
 book(c,338,413,.86,0);glow(c,420,265,143,'#f0dfb0',.13+Math.sin(t*.65)*.035);
}
function goldBar(c:CanvasRenderingContext2D,x:number,y:number,s=1){c.save();c.translate(x,y);c.scale(s,s);poly(c,[[-24,0],[24,0],[18,-16],[-16,-16]],'#d0a454');poly(c,[[-16,-16],[18,-16],[13,-21],[-11,-21]],'#ead18c');poly(c,[[18,-16],[24,0],[15,0],[13,-21]],'#ad823f');c.restore();}
function pan(c:CanvasRenderingContext2D,x:number,y:number){
 stroke(c,[[x,y],[x-45,y+79]],'#d3bc7e',2);stroke(c,[[x,y],[x+45,y+79]],'#d3bc7e',2);c.beginPath();c.moveTo(x-52,y+79);c.quadraticCurveTo(x,y+111,x+52,y+79);c.closePath();c.fillStyle=gradient(c,x,y+75,x,y+101,'#d8bd78','#8b793f');c.fill();
}
function graceDiscernment(c:CanvasRenderingContext2D,t:number){
 room(c,t);const cycle=(t*.12)%1,lower=.5-.5*Math.cos(TAU*cycle),angle=-.07+Math.sin(t*.75)*.045-lower*.075;
 const pivot:Point=[482,178],dx=139*Math.cos(angle),dy=139*Math.sin(angle),left:Point=[pivot[0]-dx,pivot[1]-dy],right:Point=[pivot[0]+dx,pivot[1]+dy];
 const placing=clamp((cycle-.1)/.35),hx=303+placing*(left[0]-303),hy=315-placing*51;
 person(c,230,432,.87,t,'weigh',1,'#748c7a',[(hx-230)/.87,(hy-432)/.87]);
 c.fillStyle='#876d40';c.fillRect(469,179,26,190);oval(c,482,377,91,18,'#b59b5d');stroke(c,[left,right],gold,12);oval(c,482,178,12,12,'#ead69b');
 pan(c,...left);pan(c,...right);goldBar(c,left[0]-12,left[1]+83,.8);goldBar(c,left[0]+17,left[1]+88,.7);
 for(let i=0;i<5;i++)poly(c,[[right[0]-34+i*15,right[1]+85],[right[0]-25+i*15,right[1]+67+i%2*6],[right[0]-9+i*15,right[1]+88]],i%2?'#797b66':'#53645a');
 if(cycle<.58){goldBar(c,hx+8,hy-6,.48);}else goldBar(c,left[0]+3,left[1]+70,.48);
 book(c,780,383,.93,t);glow(c,514,251,176,'#e5d6a2',.13+lower*.12);
}
function shield(c:CanvasRenderingContext2D,x:number,y:number,angle:number){
 c.save();c.translate(x,y);c.rotate(angle);c.fillStyle=gradient(c,-55,-60,55,95,'#d7b66b','#8d7846');c.beginPath();c.moveTo(-62,-64);c.quadraticCurveTo(0,-87,62,-64);c.lineTo(54,33);c.quadraticCurveTo(30,80,0,98);c.quadraticCurveTo(-35,77,-54,33);c.closePath();c.fill();
 c.fillStyle=gradient(c,-45,-60,45,80,'#6c8b7d','#284d48');c.beginPath();c.moveTo(-51,-56);c.quadraticCurveTo(0,-73,51,-56);c.lineTo(43,29);c.quadraticCurveTo(24,66,0,82);c.quadraticCurveTo(-27,62,-43,29);c.closePath();c.fill();
 oval(c,0,-1,19,19,'#b69857');oval(c,-5,-6,8,8,'#e1ca88');stroke(c,[[-39,-43],[-36,15],[-20,48]],'rgba(221,231,197,.24)',3);c.restore();
}
function arrow(c:CanvasRenderingContext2D,x:number,y:number,angle:number,fire:boolean){
 c.save();c.translate(x,y);c.rotate(angle);stroke(c,[[-58,0],[0,0]],'#c1a46b',4);poly(c,[[0,0],[-14,-8],[-12,8]],'#b5c2ad');poly(c,[[-48,0],[-65,-12],[-61,0],[-65,12]],'#9a7f57');
 if(fire){glow(c,-22,0,30,'#e7ae58',.25);curve(c,[-13,0],[-25,-16],[-38,-4],[-45,-16],'#d68b3f',6);curve(c,[-17,2],[-27,-8],[-35,6],[-41,-4],'#efca77',3);}
 c.restore();
}
function resistingEvil(c:CanvasRenderingContext2D,t:number){
 landscape(c,t);poly(c,[[0,318],[120,298],[280,322],[960,344],[960,480],[0,480]],'#436653');
 const brace=Math.sin(t*1.3)*.035,hit=clamp(Math.sin(t*2.1)*3),sx=510-hit*3,sy=310;
 person(c,594,435,1.04,t,'guard',-1,'#6c837c');shield(c,sx,sy,brace);
 for(let i=0;i<3;i++){
  const q=(t*.28+i/3)%1,y=273+i*24,flight=clamp(q/.73),x=-30+flight*489;
  if(q<.73)arrow(c,x,y,Math.sin(q*4)*.05,true);
  else{const p=(q-.73)/.27;c.save();c.globalAlpha=1-p;stroke(c,[[459-p*44,y+p*31],[435-p*83,y+10+p*70]],'#bda16c',4);stroke(c,[[461-p*13,y+4+p*46],[477-p*44,y+15+p*103]],'#bda16c',4);for(let j=0;j<4;j++)oval(c,459-p*(25+j*14),y-3+p*p*(58+j*18),2,3,'#d6b36b');c.restore();}
 }
 book(c,761,423,.72,t);glow(c,520,295,89,'#e2d3a2',.07+hit*.045);
}
function crown(c:CanvasRenderingContext2D,x:number,y:number,s:number){c.save();c.translate(x,y);c.scale(s,s);poly(c,[[-48,0],[-59,-54],[-28,-30],[0,-70],[29,-30],[59,-54],[48,0]],'#d5b069');poly(c,[[-45,-7],[45,-7],[43,4],[-43,4]],'#f0d58e');for(const xx of [-28,0,28]){oval(c,xx,-16,5,7,xx===0?'#7a9c8b':'#9e6c57');}c.restore();}
function banner(c:CanvasRenderingContext2D,x:number,y:number,t:number){
 stroke(c,[[x,y],[x,y-294]],'#c1a573',8);oval(c,x,y-299,8,8,'#dfca92');
 c.beginPath();c.moveTo(x+4,y-281);for(let i=0;i<=8;i++){const xx=i*16,yy=Math.sin(i*.7+t*1.6)*9;c.lineTo(x+xx,y-281+yy);}for(let i=8;i>=0;i--){const xx=i*16,yy=Math.sin(i*.7+t*1.6+.4)*9;c.lineTo(x+xx,y-199+yy);}c.closePath();c.fillStyle=gradient(c,x,y-280,x+130,y-190,'#9d5f4d','#543f38');c.fill();
 for(let i=0;i<4;i++)curve(c,[x+8+i*30,y-273],[x+i*30+10,y-250],[x+i*30+15,y-230],[x+i*30+13,y-204],'rgba(237,201,150,.22)',2);
}
function victory(c:CanvasRenderingContext2D,t:number){
 room(c,t);const phase=(t*.105)%1,opening=clamp((phase-.05)/.28),fall=clamp((phase-.28)/.29),walk=Math.sin(t*.3)*27;
 // Open doorway and an unfastening lock make release concrete rather than a static emblem.
 c.fillStyle='#142e35';c.beginPath();c.moveTo(100,395);c.lineTo(100,179);c.arc(183,179,83,Math.PI,0);c.lineTo(266,395);c.closePath();c.fill();
 stroke(c,[[102,392],[102,178]],'#9f997b',9);stroke(c,[[265,178],[265,392]],'#9f997b',9);glow(c,185,258,120,'#efe2b4',opening*.34);
 c.save();c.translate(222,304);c.rotate(-opening*.35);c.fillStyle='#b49559';c.fillRect(-23,-25,46,52);c.strokeStyle='#c7c5a4';c.lineWidth=8;c.beginPath();c.moveTo(-15,-25);c.lineTo(-15,-48-opening*22);c.bezierCurveTo(-12,-73-opening*22,21,-70-opening*22,20,-48-opening*22);c.lineTo(20+opening*19,-28-opening*22);c.stroke();oval(c,0,-4,5,7,'#34463d');c.restore();
 for(let i=0;i<8;i++){const x=253+i*22,y=325+fall*(87+(i%2)*7);c.save();c.translate(x,y);c.rotate(i*.12+fall*.7);c.strokeStyle='#aeb29c';c.lineWidth=4;c.beginPath();c.ellipse(0,0,14,8,0,0,TAU);c.stroke();c.restore();}
 person(c,399+walk,437,1.02,t*1.1,'walk',1,'#8a987b');person(c,553+walk,437,.93,t*1.1-.7,'walk',1,'#6e8c84');
 const hx=237+Math.sin(t*.6)*3;stroke(c,[[hx,302],[hx+45,302]],'#d2b577',6);oval(c,hx+58,302,13,13,'#c3a363');oval(c,hx+58,302,6,6,'#314c43');
 c.fillStyle='#7e7052';c.fillRect(728,257,112,112);c.fillStyle='#a89a72';c.fillRect(717,359,136,15);crown(c,784,248,.83);banner(c,713,420,t);
}
function horseLeg(c:CanvasRenderingContext2D,hip:Point,phase:number,near:boolean){
 const swing=Math.sin(phase),lift=Math.max(0,Math.cos(phase));const knee:Point=[hip[0]+swing*24,hip[1]+51-lift*9],ankle:Point=[hip[0]+swing*43,hip[1]+106-lift*23];
 limb(c,hip,knee,ankle,near?'#dce3d4':'#a8b8ad',near?16:13);stroke(c,[[knee[0]-3,knee[1]-8],[ankle[0]-3,ankle[1]-7]],near?'#f7f2dc':'#c8d0bf',4);
 c.save();c.translate(...ankle);c.rotate(swing*.11);poly(c,[[-9,-4],[10,-4],[15,8],[-12,8]],near?'#657268':'#4a5f58');stroke(c,[[-8,-4],[9,-4]],'#b8c4b1',2);c.restore();
}
function whiteHorse(c:CanvasRenderingContext2D,t:number,bridled=false){
 landscape(c,t*.8);
 const gait=t*2.55,bob=Math.sin(gait*2)*3.2,x=bridled?450+Math.sin(t*.2)*10:469+Math.sin(t*.2)*24,scale=bridled?.93:1.24;
 c.save();c.translate(x,425+bob);c.scale(scale,scale);
 oval(c,12,4-bob,145,14,'rgba(20,52,45,.25)');
 // Far limbs first, with opposing diagonal pairs in a genuine four-legged gait.
 horseLeg(c,[-82,-109],gait+Math.PI,false);horseLeg(c,[81,-108],gait,false);
 // Tail articulated at its root, followed by a flowing multi-strand fan.
 const tail=Math.sin(gait*.6)*11;curve(c,[-107,-142],[-169,-142],[-155+tail,-57],[-200+tail,-51],'#cbd7cc',17);
 for(let i=0;i<9;i++)curve(c,[-116,-145+i*.9],[-172+i*2,-137],[-146+tail-i,-77],[-196+tail+i*2,-50+i*2],i%2?'#e8ebdb':'#acbeb2',1.8);
 c.fillStyle=gradient(c,-102,-180,70,-65,bridled?'#d4bc8c':'#f4f1dd',bridled?'#94764f':'#b8c9bd');c.beginPath();c.moveTo(-106,-145);c.bezierCurveTo(-94,-192,23,-188,78,-156);c.bezierCurveTo(115,-133,117,-88,72,-76);c.bezierCurveTo(6,-56,-101,-73,-114,-112);c.closePath();c.fill();
 oval(c,-63,-132,42,43,'rgba(247,244,220,.45)');curve(c,[-91,-95],[-44,-76],[21,-68],[70,-88],'#a6bcaf',6);
 // Neck leans forward and nods with the stride; head, ears and forelock follow.
 const nod=Math.sin(gait)*.025;c.save();c.translate(75,-145);c.rotate(nod);
 c.fillStyle=gradient(c,0,-120,71,48,bridled?'#d2b585':'#f0efdc',bridled?'#8e7854':'#a4bcae');c.beginPath();c.moveTo(-7,25);c.bezierCurveTo(27,-22,3,-87,44,-119);c.bezierCurveTo(70,-127,88,-101,76,-69);c.bezierCurveTo(61,-31,78,17,43,44);c.closePath();c.fill();
 c.save();c.translate(56,-103);c.rotate(nod*.8);
 c.fillStyle=gradient(c,-10,-21,75,31,bridled?'#e0c697':'#f6f1db',bridled?'#a58b60':'#b4c7b8');c.beginPath();c.moveTo(-17,-20);c.bezierCurveTo(11,-32,37,-14,43,-3);c.lineTo(77,18);c.quadraticCurveTo(87,28,75,38);c.quadraticCurveTo(51,40,36,25);c.lineTo(10,17);c.quadraticCurveTo(-21,20,-17,-20);c.fill();
 oval(c,67,27,8,5,'#809b8d',.25);oval(c,15,-6,4,4,'#284740');oval(c,16,-7,1.2,1.2,'#f7f0d4');curve(c,[25,15],[44,24],[53,31],[72,33],'#a6b9a7',1.7);
 const ear=Math.sin(gait*.5)*.08;c.save();c.rotate(ear);poly(c,[[-11,-18],[-15,-57],[-1,-43],[5,-20]],'#dce3ce');poly(c,[[4,-23],[13,-58],[21,-43],[18,-14]],'#c5d3bf');stroke(c,[[-9,-28],[-11,-47]],'#9aa898',3);stroke(c,[[12,-27],[14,-45]],'#8fa391',3);c.restore();
 curve(c,[-19,-19],[-28,-38],[-4,-42],[10,-24],'#e9ead6',7);stroke(c,[[51,7],[41,23]],'#8a7956',3);curve(c,[-14,-7],[9,1],[26,5],[49,8],'#8a7956',3);c.restore();
 for(let i=0;i<14;i++){const yy=-117+i*8.2,sway=Math.sin(t*1.9+i*.45)*4;curve(c,[40,yy],[19+sway,yy-8],[17+sway,yy+13],[8+sway,yy+17],i%2?'#e5e8d5':'#a5bbad',3.2);}
 c.restore();
 // Saddle and girth attach the rider physically to the moving animal.
 c.fillStyle=gradient(c,-51,-164,36,-115,'#915b49','#5d4638');c.beginPath();c.moveTo(-51,-169);c.quadraticCurveTo(-10,-153,43,-164);c.lineTo(34,-125);c.quadraticCurveTo(-8,-119,-45,-137);c.closePath();c.fill();stroke(c,[[-44,-153],[36,-149]],'#c9af78',4);curve(c,[-12,-162],[-22,-134],[-16,-103],[-4,-74],'#8e7b53',8);
 horseLeg(c,[-91,-108],gait,true);horseLeg(c,[75,-107],gait+Math.PI,true);
 // Rider: hips follow the saddle, rein hand flexes with the neck, cloak streams.
 if(!bridled){
 const sway=Math.sin(gait)*2;c.save();c.translate(-4,-167+sway*.4);
 poly(c,[[-24,-75],[-67,-42],[-108+Math.sin(t)*9,-24],[-58,-10],[-14,-1]],'#a16f53');
 c.fillStyle=gradient(c,-30,-88,33,6,'#d4c18f','#9e9c72');c.beginPath();c.moveTo(-21,-82);c.quadraticCurveTo(0,-96,24,-79);c.lineTo(29,-15);c.quadraticCurveTo(2,9,-34,-12);c.closePath();c.fill();
 for(let i=0;i<4;i++)curve(c,[-17+i*11,-62],[-20+i*11,-43],[-12+i*8,-25],[-16+i*10,-10],'#8e8b65',2);
 limb(c,[13,-12],[27,25],[38,68],'#8b9478',12);oval(c,44,70,15,6,'#4e5547');stroke(c,[[26,48],[24,76],[49,76]],'#bfaa74',3);
 const rein:Point=[88+Math.sin(gait)*2,-22];limb(c,[21,-69],[50,-36],rein,'#b3ad80',16,true,1.1);curve(c,rein,[110,-20],[122,-20],[132,-1],'#9d895a',2.4);
 limb(c,[-22,-68],[-42,-48],[-42,-91],'#a4a17b',15,true,0);
 c.strokeStyle='#b89b63';c.lineWidth=4;c.beginPath();c.moveTo(-43,-133);c.quadraticCurveTo(-80,-89,-43,-45);c.stroke();stroke(c,[[-43,-133],[-43,-45]],'#dac994',1.5);
 head(c,0,-107,Math.sin(gait)*.012,true);crown(c,0,-133,.38);c.restore();
 }
 c.restore();
 if(bridled){
  person(c,745,435,1,t*.6,'guide',-1,'#85977b');
  const hx=745-78,hy=435-115+Math.sin(t*.6*.7)*4,bx=x+172*scale,by=425+bob-225*scale,sag=10+Math.sin(t*.7)*7;
  curve(c,[bx,by],[bx+7,by+44+sag],[hx-8,hy+31+sag],[hx,hy],'#9a7c4d',4);
  curve(c,[bx-3,by+3],[bx+4,by+47+sag],[hx-11,hy+34+sag],[hx-3,hy+3],'#d2bd8d',1.5);
  oval(c,bx,by,5,5,'#bca36a');
 }
}

function anchorTrust(c:CanvasRenderingContext2D,t:number){
 c.fillStyle=gradient(c,0,0,0,H,'#183644','#587b7e');c.fillRect(0,0,W,H);
 poly(c,[[0,268],[147,229],[284,255],[470,226],[678,253],[960,218],[960,480],[0,480]],'#304f55');
 // The swell moves under the boat rather than moving the camera.
 for(let row=0;row<9;row++){
  const y=292+row*23;
  c.beginPath();c.moveTo(0,y);
  for(let x=0;x<=W;x+=15)c.lineTo(x,y+Math.sin(x*.016-t*.7+row*.6)*(4+row*.45));
  c.strokeStyle=row%2?'rgba(142,184,176,.29)':'rgba(83,137,139,.42)';c.lineWidth=3;c.stroke();
 }
 const heave=Math.sin(t*.8)*5,roll=Math.sin(t*.65)*.032;
 c.save();c.translate(383,325+heave);c.rotate(roll);
 oval(c,0,18,210,23,'rgba(13,40,45,.28)');
 c.fillStyle=gradient(c,0,-24,0,41,'#ae8d59','#614f37');c.beginPath();c.moveTo(-200,-26);c.quadraticCurveTo(0,1,201,-26);c.lineTo(143,32);c.quadraticCurveTo(-3,69,-145,25);c.closePath();c.fill();
 curve(c,[-183,-12],[-75,22],[75,19],[182,-11],'#d2b982',5);curve(c,[-154,15],[-60,42],[78,43],[151,10],'#8b6d46',3);
 stroke(c,[[7,0],[7,-221]],'#c5ab77',8);stroke(c,[[-153,-27],[7,-216],[157,-26]],'#a4a47e',2);
 const billow=Math.sin(t*.7)*7;
 c.fillStyle=gradient(c,0,-203,151,-50,'#d8d3ad','#a5b39e');c.beginPath();c.moveTo(16,-203);c.bezierCurveTo(54+billow,-153,113+billow,-83,151,-52);c.quadraticCurveTo(73,-34,16,-49);c.closePath();c.fill();
 curve(c,[22,-184],[58+billow,-127],[92+billow,-87],[129,-58],'rgba(240,226,186,.38)',3);
 // A small cabin and a steady held lamp identify a mariner keeping watch.
 poly(c,[[-124,-30],[-118,-75],[-47,-75],[-42,-30]],'#687b69');stroke(c,[[-126,-76],[-43,-76]],'#c8b481',6);
 head(c,76,-62,-.07,true);poly(c,[[55,-42],[93,-42],[111,-6],[40,-7]],'#7e947b');
 limb(c,[59,-38],[38,-53],[8,-46],'#7e947b',13,true,.2);lamp(c,-12,-35,t);
 c.restore();
 // Chain links feed from the bow, and the anchor lowers into the water.
 const lower=(1-Math.cos(t*.38))*.5,ax=697,ay=419+lower*18;
 const origin:Point=[567,304+heave],end:Point=[ax,ay-91];
 for(let i=0;i<15;i++){
  const q=(i+((t*.32)%1))/15,xx=origin[0]+(end[0]-origin[0])*q,yy=origin[1]+(end[1]-origin[1])*q+Math.sin(Math.PI*q)*11;
  c.save();c.translate(xx,yy);c.rotate(-.2+i%2*.7);c.strokeStyle=i%2?'#aabcb0':'#d0d4ba';c.lineWidth=3;c.beginPath();c.ellipse(0,0,8,5,0,0,TAU);c.stroke();c.restore();
 }
 c.save();c.translate(ax,ay);c.rotate(Math.sin(t*.38)*.025);
 c.strokeStyle='#c2cbbb';c.lineWidth=7;c.beginPath();c.arc(0,-91,13,0,TAU);c.stroke();
 stroke(c,[[0,-77],[0,16]],'#acbfb2',11);stroke(c,[[-47,-56],[47,-56]],'#acbfb2',8);
 c.beginPath();c.moveTo(-72,-27);c.bezierCurveTo(-66,31,-21,42,0,16);c.bezierCurveTo(23,42,66,31,72,-27);c.strokeStyle='#a4b8aa';c.lineWidth=10;c.stroke();
 poly(c,[[-83,-20],[-57,-22],[-74,-41]],'#d4d9bf');poly(c,[[57,-22],[83,-20],[74,-41]],'#d4d9bf');
 stroke(c,[[0,-72],[0,13]],'rgba(238,235,204,.4)',2);c.restore();
 // Foreground water makes its submerged weight distinct from the boat above.
 for(let row=0;row<4;row++){
  const y=366+row*24;
  curve(c,[75,y],[256,y-13+Math.sin(t*.7+row)*7],[495,y+16],[878,y-3],'rgba(128,180,178,.20)',4);
 }
}
function wing(c:CanvasRenderingContext2D,near:boolean,t:number){
 c.save();c.translate(near?3:-9,near?-3:-10);c.rotate(-.35+Math.sin(t*3.1+(near?0:.3))*.65);
 c.fillStyle=gradient(c,-132,-90,0,15,near?'#faf0cf':'#c3d1c3',near?'#b2c4b4':'#8ca99d');
 c.beginPath();c.moveTo(11,4);c.bezierCurveTo(-12,-41,-64,-105,-128,-84);c.quadraticCurveTo(-155,-67,-145,-44);c.bezierCurveTo(-97,-48,-49,-9,11,4);c.fill();
 for(let i=0;i<9;i++){
  const bx=-39-i*10,by=-18-i*4.4,ex=-61-i*12,ey=-46-i*5+Math.sin(t*3.1+i*.3)*(near?3:2);
  c.fillStyle=i%2?(near?'#f4e9ca':'#becfbf'):(near?'#e4e0c4':'#a7bfaf');c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo(ex-8,ey-22,ex,ey-32);c.quadraticCurveTo(ex+14,ey-17,bx+10,by+4);c.closePath();c.fill();
  curve(c,[bx+5,by],[ex+4,ey-12],[ex+2,ey-22],[ex,ey-29],'rgba(93,125,110,.32)',1.2);
 }
 c.restore();
}
function freeBird(c:CanvasRenderingContext2D,t:number){
 c.fillStyle=gradient(c,0,0,0,H,'#a3c1be','#e4d6ae');c.fillRect(0,0,W,H);
 poly(c,[[0,424],[135,377],[305,406],[474,363],[697,408],[822,377],[960,403],[960,H],[0,H]],'#729481');
 poly(c,[[0,461],[238,424],[450,450],[673,422],[960,453],[960,H],[0,H]],'#4e7d6b');
 // Air currents and a rising flight path make the bird's increasing height visible.
 for(let i=0;i<3;i++)curve(c,[72,198+i*48],[213,211+i*41],[305,176+i*43],[375,187+i*43],'rgba(238,237,201,.24)',2);
 const x=481+Math.sin(t*.22)*84,y=284-Math.sin(t*.22)*55-Math.sin(t*.44)*12,pitch=-.09-Math.cos(t*.22)*.055;
 c.save();c.translate(x,y);c.rotate(pitch);c.scale(1.43,1.43);
 wing(c,false,t);
 const follow=Math.sin(t*3.1-.5)*5;
 for(let i=0;i<4;i++){
  c.fillStyle=i%2?'#d2ddc7':'#ede8c9';c.beginPath();c.moveTo(-27,3+i*3);c.bezierCurveTo(-58,9+i*4,-83,20+i*2+follow,-102,14+i*5+follow);c.quadraticCurveTo(-77,39+i*4,-31,25-i*2);c.closePath();c.fill();
  curve(c,[-37,11+i*2],[-54,18+i*3],[-77,27+i*3+follow],[-93,20+i*4+follow],'#a6bead',1.1);
 }
 c.fillStyle=gradient(c,-38,-26,46,26,'#faf0d2','#bdcfbb');c.beginPath();c.ellipse(0,0,59,29,-.1,0,TAU);c.fill();
 c.fillStyle=gradient(c,47,-45,70,10,'#fff2d4','#d0d8bc');c.beginPath();c.moveTo(24,-19);c.quadraticCurveTo(42,-50,65,-37);c.quadraticCurveTo(85,-23,66,-8);c.quadraticCurveTo(48,3,27,15);c.closePath();c.fill();
 poly(c,[[71,-28],[96,-23],[72,-16]],'#b28b47');oval(c,65,-28,3.1,3.1,'#29483f');oval(c,65.7,-29,1,1,'#f7edc5');
 curve(c,[36,4],[15,23],[-11,24],[-31,16],'rgba(140,165,143,.45)',3);
 wing(c,true,t);
 // Feet tuck under the body rather than remaining as a fixed standing icon.
 stroke(c,[[7,24],[16,32],[26,29]],'#a18a54',3);stroke(c,[[23,23],[31,29],[40,26]],'#a18a54',3);
 c.restore();
}

function sceptre(c:CanvasRenderingContext2D,x:number,y:number,angle:number,power=false){
 c.save();c.translate(x,y);c.rotate(angle);
 const steel=power?'#9eada3':'#cba657',shine=power?'#dae0cb':'#f3d79a';
 stroke(c,[[0,84],[0,-176]],power?'#4e665f':'#9a7d45',11);stroke(c,[[-2,81],[-2,-175]],steel,5);
 oval(c,0,77,13,7,steel);oval(c,0,-142,13,6,steel);oval(c,0,-172,16,7,steel);
 if(power){poly(c,[[-18,-176],[-18,-219],[-10,-230],[10,-230],[18,-219],[18,-176]],steel);poly(c,[[-8,-221],[-8,-183],[4,-183],[4,-225]],shine);stroke(c,[[-19,-204],[19,-204]],'#526e67',3);}
 else{
  glow(c,0,-195,60,'#f1d48b',.16);oval(c,0,-197,23,23,steel);oval(c,-7,-203,9,10,shine);stroke(c,[[0,-220],[0,-241]],shine,4);stroke(c,[[-10,-231],[10,-231]],shine,4);
  for(const sign of [-1,1]){curve(c,[sign*8,-172],[sign*34,-182],[sign*37,-209],[sign*22,-220],steel,4);for(let j=0;j<3;j++)oval(c,sign*(28+j),-186-j*10,7,3,shine,sign*.65);}
 }
 c.restore();
}
function portal(c:CanvasRenderingContext2D,x:number,bottom:number,width:number,height:number,open:number){
 const top=bottom-height;c.fillStyle='#142d35';c.beginPath();c.moveTo(x-width/2,bottom);c.lineTo(x-width/2,top+width/2);c.arc(x,top+width/2,width/2,Math.PI,0);c.lineTo(x+width/2,bottom);c.closePath();c.fill();
 c.strokeStyle='#a09c79';c.lineWidth=11;c.stroke();glow(c,x,bottom-height*.43,width*.8,'#e4d8a4',open*.35);
 const leaf=width*.45*(1-open);
 c.fillStyle=gradient(c,x-width/2,top,x,bottom,'#aa8860','#6a6549');c.fillRect(x-width/2+6,top+width/2,leaf,bottom-top-width/2-2);c.fillRect(x+width/2-6-leaf,top+width/2,leaf,bottom-top-width/2-2);
 if(open<.85){oval(c,x-width/2+leaf,top+height*.64,4,4,gold);oval(c,x+width/2-leaf,top+height*.64,4,4,gold);}
}
function mercySceptreWelcome(c:CanvasRenderingContext2D,t:number){
 room(c,t);const breath=Math.sin(t*.8),approach=Math.sin(t*.24)*13;
 portal(c,744,407,184,295,.84+Math.sin(t*.4)*.04);
 // Human welcome is an interpretive enactment, not a claimed portrait of God.
 person(c,575,434,1.08,t,'welcome',1,'#8c9c7a');
 sceptre(c,575+91*1.08,434+(-117+breath*3)*1.08,-.22+Math.sin(t*.5)*.012);
 person(c,315+approach,443,.93,t*.7,'walk',1,'#738c84');
 glow(c,497,336,143,'#ecdcb0',.09+.03*Math.sin(t*.4));
}
// Psalm 2:9 picture behind "crushed in pieces by his sceptre of power": a rod of iron and an earthen pot.
// (Claude review 22 Nov: the earlier upright rod on a plinth read as a street lamp.)
function ironRod(c:CanvasRenderingContext2D,pivotX:number,pivotY:number,angle:number){
 c.save();c.translate(pivotX,pivotY);c.rotate(angle);
 stroke(c,[[0,40],[0,-168]],'#2f3a37',13);stroke(c,[[-3,38],[-3,-166]],'#76847e',4);
 for(const y of [-20,-120,-160])oval(c,0,y,10,5,'#5d6a65');
 for(let i=0;i<6;i++){const a=i*Math.PI/3;poly(c,[[0,-186],[Math.cos(a)*30,-186+Math.sin(a)*30],[Math.cos(a+.35)*24,-186+Math.sin(a+.35)*24]],i%2?'#52605b':'#6f7d77');}
 oval(c,0,-186,17,17,'#46534e');oval(c,-5,-191,6,6,'#a9b4ac');
 c.restore();
}
function earthenPot(c:CanvasRenderingContext2D,x:number,y:number,broken:number){
 const apart=ease(clamp((broken-.35)/.65))*26,drop=ease(clamp((broken-.35)/.65))*10;
 oval(c,x,y+4,62,10,'rgba(16,34,31,.3)');
 for(const side of [-1,1]){
  c.save();c.beginPath();c.rect(side<0?x-80:x,y-120,80,130);c.clip();c.translate(side*apart,drop*(side<0?1:.6));c.rotate(side*apart*.006);
  c.fillStyle=gradient(c,x-50,y-100,x+50,y,'#c08a5c','#7a5236');c.beginPath();c.moveTo(x-22,y-98);c.bezierCurveTo(x-30,y-80,x-62,y-62,x-56,y-30);c.bezierCurveTo(x-50,y-4,x-24,y,x,y);c.bezierCurveTo(x+24,y,x+50,y-4,x+56,y-30);c.bezierCurveTo(x+62,y-62,x+30,y-80,x+22,y-98);c.closePath();c.fill();
  oval(c,x,y-98,24,6,'#8d6141');stroke(c,[[x-40,y-52],[x+40,y-52]],'rgba(232,196,146,.35)',3);
  c.restore();
 }
 if(broken>0){c.globalAlpha=clamp(broken*3);stroke(c,[[x,y-99],[x-6,y-78],[x+5,y-60],[x-4,y-38],[x+3,y-18],[x,y]],'#3b2519',2.4);stroke(c,[[x-6,y-78],[x-26,y-70]],'#3b2519',1.6);stroke(c,[[x+3,y-18],[x+24,y-26]],'#3b2519',1.6);c.globalAlpha=1;}
 for(let i=0;i<5;i++){const f=clamp((broken-.4-i*.06)/.4);if(f>0)poly(c,[[x-10+i*5+f*(i-2)*22,y-30+f*28],[x-2+i*5+f*(i-2)*22,y-36+f*28],[x+2+i*5+f*(i-2)*22,y-26+f*30]],'#9a6a45');}
}
function mercyAndPower(c:CanvasRenderingContext2D,t:number){
 room(c,t);const phase=(t*.075)%1,refusal=clamp((phase-.26)/.43),open=1-clamp((phase-.35)/.28);
 portal(c,207,408,173,291,open);sceptre(c,149,332,-.08,false);
 // The rod is raised while the man still faces the open door, and comes down on the pot as he turns away.
 const strike=ease(clamp((phase-.45)/.22));
 earthenPot(c,775,410,clamp((phase-.62)/.25));ironRod(c,930,478,-.42-.56*strike);
 const x=397+refusal*244,turn=clamp((phase-.2)/.18),facing=turn<.5?-Math.max(.15,Math.cos(turn*Math.PI)):Math.max(.15,-Math.cos(turn*Math.PI));
 person(c,x,440,1,t*1.2,'walk',facing,'#8b8a70');
 // The refusal moves toward the stern rod and away from the closing warm doorway.
 // No released chain, crown or celebratory destination is added to this warning.
 glow(c,795,272,130,'#a5b8aa',.08);
}
function sheep(c:CanvasRenderingContext2D,x:number,y:number,s:number,t:number){
 c.save();c.translate(x,y);c.scale(s,s);const bob=Math.abs(Math.sin(t*1.9))*2;
 oval(c,0,3,57,9,'rgba(20,48,40,.22)');
 for(const i of [-1,1]){
  const phase=t*1.9+(i===1?Math.PI:0),step=Math.sin(phase),lift=Math.max(0,-Math.cos(phase));
  limb(c,[i*26,-29],[i*26+step*7,-15],[i*26+step*13,-2-lift*8],'#7a8170',6);oval(c,i*26+step*13+3,0-lift*8,7,3,'#4a5d4d');
 }
 oval(c,0,-38-bob,45,24,'#d7ddbf');
 for(let i=0;i<7;i++)oval(c,-32+i*11,-44-bob+(i%2)*8,15,13,i%2?'#f1ecd0':'#e3e3c3');
 const nod=Math.sin(t*.9)*.07;c.save();c.translate(-43,-43-bob);c.rotate(nod);oval(c,0,-2,15,18,'#c5cdb2',-.15);oval(c,-10,8,11,9,'#dfe0bf');oval(c,-5,-4,2,2,'#334d3f');oval(c,-16,10,2,1,'#6d806a');oval(c,8,-15,7,4,'#c4cbae',-.4);c.restore();
 curve(c,[44,-42-bob],[59,-48-bob+Math.sin(t)*3],[60,-31-bob],[54,-33-bob],'#e9e6c9',6);
 for(const i of [-1,1]){
  const phase=t*1.9+(i===1?0:Math.PI),step=Math.sin(phase),lift=Math.max(0,-Math.cos(phase));
  limb(c,[i*23,-28],[i*23+step*8,-14],[i*23+step*14,-2-lift*8],'#a3af91',7);oval(c,i*23+step*14+3,0-lift*8,7,3,'#536852');
 }
 c.restore();
}
function blindAndSheep(c:CanvasRenderingContext2D,t:number){
 landscape(c,t*.7);const advance=Math.sin(t*.22)*16,gait=t*.9,bob=-Math.abs(Math.sin(gait*1.7))*4;
 const bx=233+advance,by=442,bs=.97;
 person(c,bx,by,bs,gait,'blind',1,'#7e8e80');
 c.save();c.translate(bx+2*bs,by+(-200+bob)*bs);c.rotate(Math.sin(gait*1.7)*.018);c.fillStyle='#d8c8a1';c.fillRect(-19*bs,-7*bs,41*bs,10*bs);stroke(c,[[-17*bs,-2*bs],[-28*bs,5*bs],[-33*bs,12*bs]],'#bdad86',3);c.restore();
 const caneX=bx-35*bs,caneY=by+(-85+bob)*bs;
 stroke(c,[[caneX,caneY],[caneX+44,caneY+72],[caneX+75+Math.sin(gait)*7,445]],'#d7c391',4);oval(c,caneX+75+Math.sin(gait)*7,445,4,3,'#b2b69a');
 person(c,364+advance,432,.94,gait,'blind-guide',1,'#a09672');
 // Linked guiding hands stay close while their shoulders and legs take distinct steps.
 const joinX=bx+88*bs,joinY=by+(-111+bob)*bs;hand(c,joinX,joinY,.65,.15);
 person(c,658+advance*.5,409,.75,gait*.85,'walk',-1,'#7d9274');
 const staffX=658+advance*.5-(36+Math.sin(gait*.85*1.7)*21)*.75;
 stroke(c,[[staffX,345],[staffX,411]],'#bba773',5);curve(c,[staffX,347],[staffX+13,316],[staffX-22,314],[staffX-19,339],'#bba773',5);
 sheep(c,763+advance*.5,430,.8,gait+.6);sheep(c,838+advance*.5,423,.66,gait+1.8);sheep(c,900+advance*.5,426,.59,gait+2.7);
}

export function paintGovernment(c:CanvasRenderingContext2D,theme:string,time:number,elapsed:number,variant:number):void{
 const t=Number.isFinite(time)?Math.max(0,time):0;
 c.save();c.clearRect(0,0,W,H);
 switch(theme){
  case 'wise-guidance':wiseGuidance(c,t);break;
  case 'prayer-help':prayerHelp(c,t);break;
  case 'grace-discernment':graceDiscernment(c,t);break;
  case 'resisting-evil':resistingEvil(c,t);break;
  case 'victorious-rule':victory(c,t);break;
  case 'white-horse':whiteHorse(c,t);break;
  case 'anchor-trust':anchorTrust(c,t);break;
  case 'free-bird':freeBird(c,t);break;
  case 'mercy-sceptre-welcome':mercySceptreWelcome(c,t);break;
  case 'mercy-and-power-sceptres':mercyAndPower(c,t);break;
  case 'blind-and-sheep-guidance':blindAndSheep(c,t);break;
  case 'bridle-of-will':whiteHorse(c,t,true);break;
  default:throw new Error('Unknown Reed government motion theme: '+theme);
 }
 finish(c);c.restore();void elapsed;void variant;
}
