import type {Painter} from './SermonAnimation';

type C=CanvasRenderingContext2D;
const ink='#211d22', brass='#d6a46b', skin='#d9a984';
const swing=(t:number,rate:number,phase=0)=>Math.sin(t*rate+phase);
function ellipse(c:C,x:number,y:number,rx:number,ry:number,fill:string){
 c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();
}
function polygon(c:C,fill:string,points:readonly number[]){
 c.fillStyle=fill;c.beginPath();c.moveTo(points[0]??0,points[1]??0);
 for(let i=2;i<points.length;i+=2)c.lineTo(points[i]??0,points[i+1]??0);
 c.closePath();c.fill();
}
function line(c:C,color:string,width:number,...p:number[]){
 c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';
 c.beginPath();c.moveTo(p[0]??0,p[1]??0);
 for(let i=2;i<p.length;i+=2)c.lineTo(p[i]??0,p[i+1]??0);
 c.stroke();
}
function curve(c:C,color:string,width:number,x:number,y:number,cx:number,cy:number,dx:number,dy:number,ex:number,ey:number){
 c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.bezierCurveTo(cx,cy,dx,dy,ex,ey);c.stroke();
}
function rect(c:C,x:number,y:number,w:number,h:number,color:string|CanvasGradient){
 c.fillStyle=color;c.fillRect(x,y,w,h);
}
function base(c:C,light:string,dark:string,color:string){
 const g=c.createRadialGradient(490,145,12,480,250,580);
 g.addColorStop(0,light);g.addColorStop(1,dark);rect(c,0,0,960,480,g);
 polygon(c,color,[0,335,960,335,960,480,0,480]);
 line(c,'#f4bb792a',2,0,335,960,335);
 for(let i=0;i<9;i++){
  const x=90+i*107;
  line(c,'#efbb7720',1,x,335,480+(x-480)*2.7,480);
 }
 for(let i=0;i<5;i++)line(c,'#1e18252d',1,0,343+i*i*8,960,343+i*i*8);
}
function arch(c:C,x:number,y:number,w:number,h:number,inner:string){
 c.fillStyle='#bd885048';c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+w*.51);
 c.arc(x+w/2,y+w*.51,w/2,Math.PI,0);c.lineTo(x+w,y+h);c.closePath();c.fill();
 c.fillStyle=inner;c.beginPath();c.moveTo(x+9,y+h);c.lineTo(x+9,y+w*.51);
 c.arc(x+w/2,y+w*.51,w/2-9,Math.PI,0);c.lineTo(x+w-9,y+h);c.closePath();c.fill();
}
function pillars(c:C){
 for(const x of [45,235,548,846]){
  rect(c,x,30,24,316,'#594344');rect(c,x+5,38,5,300,'#b17b5758');
  rect(c,x-6,26,34,13,'#71554e');rect(c,x-5,330,34,18,'#71554e');
 }
}
function person(c:C,x:number,y:number,s:number,t:number,coat:string,pose:'rest'|'reach'|'work'|'walk'='rest',arms=true){
 c.save();c.translate(x,y);c.scale(s,s);
 const a=swing(t,2.15,x*.013),b=swing(t,1.4,x*.021);
 const headX=pose==='work'?13:0;
 ellipse(c,4,120,49,10,'#211d225e');
 const step=pose==='walk'?22*a:3*b;
 line(c,ink,15,-12,48,-14+step,85,-14+step*1.4,117);
 line(c,'#332629',15,13,49,20-step,85,23-step*1.4,115);
 line(c,'#21181c',13,-19+step*1.4,117,-5+step*1.4,117);
 line(c,'#21181c',13,19-step*1.4,117,32-step*1.4,117);
 const lean=pose==='work'?15:pose==='reach'?7:0;
 polygon(c,coat,[-27,-22,-14+lean,-42,15+lean,-42,31,-18,29,56,-27,56]);
 polygon(c,'#16131e50',[6,-40,21,-35,29,-17,28,53,9,55]);
 line(c,'#c9ab8970',2,-16,-36,-18,45);
 const handX=pose==='reach'?68+9*b:pose==='work'?63+12*a:pose==='walk'?38-16*a:31+5*b;
 const handY=pose==='reach'?-11+11*a:pose==='work'?25+8*b:pose==='walk'?35+5*b:24+5*b;
 if(arms){
  line(c,coat,17,17+lean,-25,44+5*b,handY*.58,handX,handY);
  line(c,'#544034',3,20+lean,-19,43+5*b,handY*.58,handX-5,handY);
  ellipse(c,handX+4,handY,8,6,skin);
  line(c,coat,15,-17,-24,-37+6*b,0,-31+7*a,28+5*b);
  ellipse(c,-31+7*a,28+5*b,6,7,skin);
 }
 ellipse(c,headX+3,-57+b*2,19,24,skin);
 ellipse(c,headX-5,-70+b*2,16,12,'#35272a');
 polygon(c,'#35272a',[headX-16,-73+b*2,headX+8,-79+b*2,headX+13,-65+b*2,headX-14,-58+b*2]);
 ellipse(c,headX+12,-60+b*2,2,2,'#30232a');
 ellipse(c,headX-9,-56+b*2,3.5,5,'#bf896f');
 line(c,'#62453a',1.7,headX+10,-49+b*2,headX+16,-48+b*2);
 c.restore();
}
function book(c:C,x:number,y:number,s:number,t:number){
 c.save();c.translate(x,y);c.scale(s,s);
 polygon(c,'#492f35',[-93,15,0,25,89,13,96,-29,3,-17,-86,-35]);
 const page=swing(t,1.8)*6;
 polygon(c,'#f4d7a1',[-87,-30,-8,-23,0,17,-88,2]);
 polygon(c,'#debb84',[0,17,7,-25,89,-30+page,86,1,4,19]);
 line(c,'#89614b',2,0,17,4,-23);
 for(let i=0;i<6;i++){
  const x=-72+i*11;
  line(c,'#a07c61',1,x,-18+i*.7,x+4,-4+i*.7);
  line(c,'#a28160',1,14+i*11,-19+i*.3,10+i*11,-3+i*.5);
 }
 c.restore();
}
function chapel(c:C,t:number,focus:boolean,objector=false){
 base(c,'#875d54','#252332','#4e3d42');
 for(const x of [77,324,571,818]){
  arch(c,x,39,75,248,'#bea37b35');line(c,'#523c43',5,x+37,44,x+37,285);
  line(c,'#523c43',4,x+9,152,x+65,152);
 }
 pillars(c);
 polygon(c,'#c6996452',[395,70,438,68,654,369,482,368]);
 person(c,473,191,1.14,t,'#3e3c50','reach');
 polygon(c,'#291f28',[407,234,557,234,538,376,422,376]);
 polygon(c,'#6d4841',[413,244,548,244,530,364,429,364]);
 polygon(c,'#8e634b',[399,221,561,221,575,247,388,247]);
 book(c,481,226,.56,t);
 for(const [x,y,k] of [[154,307,.74],[258,321,.8],[685,320,.8],[800,303,.72],[403,359,1],[561,365,1]] as const){
  const active=(focus&&x===403)||(objector&&x===685);
  person(c,x,y,k,t+1,active?'#9a6550':'#403747',active?'reach':'rest');
  polygon(c,'#382a30',[x-67,y+43,x+65,y+43,x+73,y+74,x-75,y+74]);
  line(c,'#ad7a56',3,x-62,y+44,x+58,y+44);
 }
}
function fountain(c:C,t:number,flow:boolean){
 base(c,'#aa9178','#302b35','#64534a');
 for(let i=0;i<5;i++){const x=28+i*186;arch(c,x,75+i%2*15,145,250,'#483841');}
 arch(c,325,40,309,308,'#4a3b43');
 rect(c,369,205,35,139,'#726658');rect(c,557,205,35,139,'#726658');
 ellipse(c,479,352,165,45,'#41383d');ellipse(c,479,338,159,42,'#a4896f');
 ellipse(c,479,337,137,29,flow?'#608b89':'#6a554b');
 rect(c,459,153,40,178,'#927767');
 ellipse(c,478,213,89,21,'#ad8c70');ellipse(c,478,209,80,14,flow?'#83aaa0':'#68524b');
 ellipse(c,478,153,36,12,'#b99a7d');
 line(c,'#9f7963',19,366,314,317,314,317,342,272,342);
 person(c,153,270,1.01,t,'#596472','reach');
 person(c,731,260,.97,t,'#8a593f','work');
 polygon(c,'#b17353',[712,351,773,351,766,399,721,399]);
 ellipse(c,743,352,31,9,'#654137');
 polygon(c,'#a56c54',[215,372,269,372,261,420,224,420]);
 ellipse(c,242,373,27,8,'#664745');
 if(flow){
  for(let i=0;i<13;i++){
   const f=(t*.58+i/13)%1;
   const x=478+(i%2?1:-1)*f*77;
   const y=145-50*f+121*f*f;
   ellipse(c,x,y,3.4,4.8,'#dce4ba');
   const g=(f+.52)%1;
   ellipse(c,397+(i%4)*52+2*swing(t,5,i),215+g*106,2.6,4.4,'#a3c8b3');
  }
  for(let i=0;i<4;i++){
   const amount=(t*.4+i*.25)%1;
   ellipse(c,478,337,35+amount*95,4+amount*15,'#98b7aa38');
  }
  curve(c,'#b9cfaa',5,274,344,257,355,249,367,242,373);
  ellipse(c,242,372,20,3+swing(t,4),'#a5c4ae');
 }else{
  for(const x of [387,439,486,549])line(c,'#382e32',2,x,329,x+12,337,x+8,344);
 }
}
function temple(c:C,t:number){
 base(c,'#9b6d4f','#392732','#65463b');pillars(c);
 arch(c,302,34,354,321,'#53393c');
 rect(c,438,245,132,100,'#a07457');
 person(c,355,238,1.19,t,'#8c583e','reach');
 person(c,607,239,1.16,t,'#b09d7d','reach');
 person(c,733,228,.83,t,'#766c63','rest');
 polygon(c,brass,[330,158,341,136,353,151,369,137,383,158,375,164,337,164]);
 const h=swing(t,2)*9;
 line(c,brass,3,434,222+h,461,277+h,484,228+h);
 ellipse(c,461,279+h,23,9,'#ba8753');
 for(let i=0;i<4;i++){
  const f=(t*.35+i*.25)%1;
  curve(c,'#f8d8a345',2,461,270+h-f*64,440,f*33+210,484,207-f*34,455+20*f,203-f*38);
 }
}
function workshop(c:C,t:number,kind:'potter'|'statue'|'workbench'|'stone'|'seed'){
 base(c,'#9f795c','#3a2e36','#584840');
 arch(c,516,46,240,297,'#bd9b7645');line(c,'#59443f',9,637,52,637,345);
 if(kind==='statue'||kind==='stone'){
  rect(c,482,344,196,66,'#807573');rect(c,504,320,150,25,'#a3978b');
  polygon(c,'#a69c90',[536,166,578,144,619,168,626,297,614,320,541,320]);
  polygon(c,'#c5bcb0',[544,172,563,159,575,312,548,318]);
  ellipse(c,579,131,28,36,'#bab1a1');ellipse(c,569,122,17,24,'#d4cbbb');
  line(c,'#a6998a',17,544,171,518,218,534,247);
  line(c,'#857b76',18,607,173,635,220,611,257);
  person(c,391,231,1.49,t,'#7b5a53','work',kind!=='statue');
  const x=529+9*swing(t,2.1), y=216+21*swing(t,2.4);
  if(kind==='statue'){
   line(c,'#7b5a53',22,414,199,474,218+9*swing(t,2.4),x-16,y);
   line(c,'#6e504c',18,368,199,349,239,358,276+6*swing(t,1.8));
   ellipse(c,358,276+6*swing(t,1.8),9,8,skin);
   ellipse(c,x-12,y,10,7,skin);
   ellipse(c,x,y,13,9,'#87adad');
   for(let i=0;i<10;i++){
    const a=(t*.69+i*.1)%1;
    ellipse(c,x+22*a+6*swing(t,3,i),y+a*102,2.6,4.5,'#b7d2c5');
   }
   ellipse(c,506,412,63+7*swing(t,3),9,'#96b1a590');
   polygon(c,'#79503d',[345,337,402,337,396,388,350,388]);ellipse(c,374,337,29,8,'#95afa8');
  }
  return;
 }
 if(kind==='seed'){
  ellipse(c,477,361,224,37,'#332832');ellipse(c,477,345,194,36,'#765644');
  const g=.5+.5*swing(t,.62);
  curve(c,'#819c60',12,485,347,435,287,518,239,468+g*29,181-g*19);
  ellipse(c,456+g*27,203-g*19,35,10,'#a3ab61');
  ellipse(c,494+g*26,182-g*20,29,12,'#b5b870');
  for(let i=0;i<5;i++)curve(c,'#b98a5b66',3,485,346,466+18*i,353,440+21*i,364,410+35*i,380);
  return;
 }
 person(c,319,235,1.38,t,'#805a4d','work',kind!=='potter');
 polygon(c,'#563a36',[257,328,720,328,747,367,231,367]);
 rect(c,278,365,25,69,'#382b31');rect(c,668,365,25,69,'#382b31');
 if(kind==='potter'){
  ellipse(c,525,328,121,25,'#4e3538');ellipse(c,525,318,115,20,'#b68b67');
  for(let i=0;i<7;i++){const a=t*2.6+i*Math.PI*2/7;line(c,'#74533f',2,525,318,525+101*Math.cos(a),318+15*Math.sin(a));}
  const f=7*swing(t,1.2);
  polygon(c,'#a36b51',[475,313,467-f,281,480,247,570,247,583+f,281,574,313]);
  ellipse(c,525,247,46,11,'#c18b68');ellipse(c,525,245,34,7,'#593d3b');
  for(let i=0;i<5;i++)ellipse(c,525,258+11*i,45+f*.6,2,'#d298755e');
  const h=swing(t,2)*14;
  line(c,'#7b564b',26,357,210,430+h,258-h*.2,478+f,280-h);
  line(c,skin,14,471+f,280-h,489+f,271-h);
  line(c,'#745248',23,354,200,420,228+h*.5,485,242+h*.4);
  line(c,skin,12,485,242+h*.4,508,246+h*.4);
 }else{
  book(c,532,300,.95,t);
  line(c,'#d2a16c',12,515,271,597+14*swing(t,2),255);
  ellipse(c,595+14*swing(t,2),255,12,7,'#4c3942');
 }
}
function windowScene(c:C,t:number,kind:'wind'|'scripture'|'cradle'|'adoption'|'robe'){
 base(c,'#a98163','#3b2d3d','#5a4443');arch(c,300,36,340,294,'#c9a479');
 line(c,'#69523f',10,470,42,470,330);line(c,'#69523f',8,315,169,625,169);
 for(let i=0;i<2;i++){
  const x=i?637:304, s=i?-1:1;
  const f=swing(t,1.7,i)*30;
  polygon(c,'#8e5660',[x,41,x+s*62,44,x+s*(61+f),157,x+s*(69+f*.6),288,x+s*10,331,x,330]);
  curve(c,'#d0958668',3,x+s*20,45,x+s*(36+f),133,x+s*(36-f),258,x+s*29,323);
  curve(c,'#563847',3,x+s*37,49,x+s*(53+f),158,x+s*(56-f),272,x+s*44,318);
 }
 if(kind==='cradle'){
  person(c,333,239,1.13,t,'#866059','work');
  const rock=swing(t,2)*9;
  ellipse(c,537+rock,371,127,15,'#392934');
  polygon(c,'#725145',[406+rock,289,665+rock,623+rock,359,437+rock,359]);
  ellipse(c,535+rock,288,127,21,'#b58b65');
  ellipse(c,535+rock,284,105,16,'#806255');
  ellipse(c,523+rock,282,62,17+swing(t,2.8)*3,'#b2a3a2');ellipse(c,574+rock,276,20,16,skin);
  line(c,'#d7baaa',5,551+rock,284,556+rock,274+4*swing(t,2.1),568+rock,275);
  curve(c,brass,5,439+rock,364,490,388,603,385,631+rock,361);
 }else if(kind==='robe'||kind==='adoption'){
  person(c,507,254,1.05,t,'#665467','rest');
  person(c,338,212,1.37,t,'#76564e','reach',false);
  const f=swing(t,1.8)*7;
  if(kind==='robe'){
   polygon(c,'#dbc29e',[478,218,532,221,570+f,288,555+f,380,471,382,460-f,285]);
   curve(c,'#a58c76',5,499,222,482,260,504,341,485,376);
   curve(c,'#b29a7e',5,522,224,537,271,519,332,549,371);
   line(c,'#76564e',19,369,184,415,218+f,447,238+f);
   line(c,skin,11,447,238+f,478,219,497,224);
  }else{
   line(c,'#75564e',19,401,207,459,249+f,502,251+f);
   ellipse(c,506,250+f,11,7,skin);
   ellipse(c,490,402,65,9,'#d4aa7555');
  }
 }else{
  polygon(c,'#53393b',[303,324,676,324,711,367,275,367]);
  book(c,483,303,1.35,t*1.42);
  if(kind==='scripture')person(c,234,232,1.01,t,'#514657','reach');
  for(let i=0;i<5;i++){
   const p=(t*.32+i*.2)%1;
   curve(c,'#efcca46a',2,300+p*231,123+i*18,345+p*231,91+i*18,369+p*231,169+i*18,400+p*231,131+i*18);
  }
 }
}
function landscape(c:C,t:number,kind:string){
 base(c,'#a28b7c','#32374a','#4c4947');
 const light=154+35*swing(t,.43);
 polygon(c,'#70666e',[0,320,0,271,99,223,201,245,317,176,418,240,527,208,638,247,768,186,960,241,960,345]);
 polygon(c,'#514951',[0,352,161,269,311,322,499,247,662,295,811,244,960,298,960,385,0,385]);
 if(kind==='cross'||kind==='hope'){
  polygon(c,'#d1a98261',[376,165,581,150,702,409,256,409]);
  rect(c,466,137,26,205,'#503d41');rect(c,414,178,129,23,'#503d41');
  line(c,'#b48c67',3,468,139,468,340);
  person(c,352,284,.75,t,'#77574e','reach');
  person(c,643,281,.73,t,'#564e62','walk');
  if(kind==='hope'){
   for(let i=0;i<4;i++)ellipse(c,658+i*40,light-10+i*8,17,2,'#eee0a7');
  }
 }else if(kind==='flood'){
  rect(c,0,321,960,159,'#587b82');person(c,498,287,1,t,'#7f5347','reach');
  for(let i=0;i<13;i++){
   const y=325+i*11;
   for(let j=0;j<6;j++){const x=j*165+24*swing(t,2,i+j);curve(c,'#b7c5b28f',3,x,y,x+42,y-20,x+68,y+15,x+119,y);}
  }
 }else if(kind==='manna'){
  for(let i=0;i<4;i++)person(c,232+i*158,273,.88,t+i,'#755f55','work');
  for(let i=0;i<37;i++){const x=128+(i*137)%696;ellipse(c,x,360+(i*43)%72,4,2,'#e9cd9e');}
 }else if(kind==='creatures'){
  for(let i=0;i<2;i++){
   const x=i?656:312,y=314, f=swing(t,2,i)*10;
   ellipse(c,x,y,60,32,i?'#d6c7aa':'#a77249');
   if(i){
    for(const [dx,dy] of [[-40,-9],[-15,-19],[14,-20],[42,-13],[-33,11],[-4,13],[27,11]] as const)
     ellipse(c,x+dx,y+dy,20,17,'#e5d7b8');
   }else{
    for(let j=0;j<10;j++){
     const angle=j*Math.PI/5;
     ellipse(c,x-51+28*Math.cos(angle),y-20+31*Math.sin(angle)+f*.16,15,15,'#744432');
    }
   }
   ellipse(c,x-55,y-22,27,29,i?'#d6c7aa':'#956346');
   ellipse(c,x-70,y-19,13,10,i?'#8f7870':'#c2915d');
   ellipse(c,x-48,y-44,9,7,i?'#aa8c79':'#976247');
   ellipse(c,x-67,y-29,2.6,2.6,ink);
   for(let j=0;j<4;j++)line(c,i?'#c6b398':'#926641',10,x-39+j*25,y+14,x-45+j*26+(j%2?f:-f),y+53);
   curve(c,i?'#d6c7aa':'#996b49',7,x+50,y-8,x+81,y-26-f,x+93,y-18,x+(i?64:85),y+(i?6:-44)+f);
  }
  for(let i=0;i<2;i++){
   const x=(i?630:332)+40*swing(t,.8,i),y=(i?112:141)+10*swing(t,1.3,i), wing=28*swing(t,5,i);
   ellipse(c,x,y,18,7,i?'#eee5cd':'#3d3339');
   polygon(c,i?'#eee5cd':'#3d3339',[x-19,y,x-45,y+wing,x-9,y+4,x+34,y+wing*.75,x+13,y]);
  }
 }else{
  person(c,311,267,.9,t,'#8f6658','walk');
  person(c,634,266,.9,t+1,'#555368','walk');
  rect(c,463,226,20,132,'#6e5144');
  ellipse(c,473,226,13,7,brass);
  const x=115+((t*46)%720);
  polygon(c,'#755449',[x,306,x+98,306,x+83,343,x+18,345]);
  for(const p of [x+15,x+82]){
   ellipse(c,p,345,23,23,'#493840');
   for(let i=0;i<6;i++){const a=t*2.4+i*Math.PI/3;line(c,brass,2,p,345,p+20*Math.cos(a),345+20*Math.sin(a));}
  }
 }
}
function interior(c:C,t:number,kind:string){
 base(c,'#9a7559','#302536','#584443');arch(c,317,47,330,299,'#a9775261');pillars(c);
 if(kind==='gate'){
  const f=35+20*swing(t,.9);
  rect(c,379,138,199,210,'#362a36');
  polygon(c,'#805c49',[379,138,473-f,155,473-f,331,379,348]);
  polygon(c,'#a17851',[578,138,483+f,155,483+f,331,578,348]);
  for(const x of [410,441,516,547])line(c,brass,3,x,161,x,322);
  person(c,289,276,1.05,t,'#66576a','reach');
 }else if(kind==='chain'){
  for(let i=0;i<8;i++){
   const x=210+i*77,y=267-70*Math.sin(i*Math.PI/7)+swing(t,1.65,i*.32)*9;
   c.strokeStyle=i===4?'#f1d18d':'#ba905d';c.lineWidth=12;
   c.beginPath();c.ellipse(x,y,38,i%2?13:26,-.16*Math.cos(i),0,Math.PI*2);c.stroke();
  }
  person(c,106,267,.74,t,'#70554c','reach');
  person(c,845,267,.74,t+1,'#66566c','reach');
 }else{
  person(c,365,228,1.2,t,'#746370','rest');
  person(c,626,235,1.18,t,'#8b5f4d','reach');
  polygon(c,'#5e403c',[408,310,571,310,592,343,385,343]);
  book(c,489,301,.56,t);
  if(kind==='burden'){
   ellipse(c,354,254,53+swing(t,1.5)*3,27,'#756351');
   curve(c,'#a39064',6,319,234,337,206,369,214,390,242);
  }
 }
}

function openingDetail(c:C,t:number,art:string){
 if(art==='templeExit'){
  base(c,'#9e7b65','#362937','#654c4b');
  arch(c,201,33,300,325,'#bea887');pillars(c);
  polygon(c,'#dab28350',[250,325,473,325,529,480,89,480]);
  const step=40*swing(t,1.15);
  person(c,375+step,252,1.32,t,'#835b4f','walk');
  ellipse(c,382+step,175+2*swing(t,1.4,375*.021),8,11,'#eccdb2');
  person(c,699,244,.89,t,'#a59681','rest');
  line(c,'#b8a283',7,550,346,808,346);
  return;
 }
 if(art==='arrival'){
  base(c,'#82928f','#262d3d','#4b4c52');
  polygon(c,'#555461',[143,181,492,59,818,180,818,376,143,376]);
  polygon(c,'#756c71',[132,181,491,48,830,181,794,194,491,83,166,194]);
  arch(c,424,158,129,222,'#bc9965');arch(c,229,184,76,134,'#bd955f');
  arch(c,671,184,76,134,'#bd955f');
  polygon(c,'#deb77d46',[457,370,524,369,676,480,285,480]);
  for(const [x,y,scale,coat] of [[230,307,.91,'#705c5f'],[637,323,.9,'#5d6376'],[743,315,.74,'#8a675e']] as const)
   person(c,x+swing(t,.85,x)*23,y,scale,t,coat,'walk');
  return;
 }
 if(art==='assembly'||art==='pew'||art==='balcony'||art==='address'||art==='prayerClose'){
  const high=art==='balcony',near=art==='pew'||art==='prayerClose',atPulpit=art==='address';
  base(c,near?'#987360':high?'#7e7a83':'#a2785d','#302b3a','#574854');
  for(const x of [48,305,565,825])arch(c,x,44,105,268,'#c49c7373');
  if(atPulpit){
   person(c,515,228,1.8,t,'#484052','reach');
   polygon(c,'#6f4b42',[432,264,649,264,621,465,465,465]);
   line(c,'#b78963',13,427,265,650,265);book(c,536,255,.88,t);
   ellipse(c,766,396,57,13,'#352934');
  }else if(near){
   person(c,365,226,1.82,t,'#8d6253',art==='pew'?'reach':'rest');
   person(c,675,267,1.24,t,'#56536c','rest');
   polygon(c,'#593f43',[158,342,796,342,865,406,84,406]);
   line(c,'#bb906c',9,157,342,795,342);book(c,539,333,.89,t);
  }else{
   const n=high?3:2;
   for(let i=0;i<n;i++){
    const y=192+i*82,x=128+i*37;
    for(let j=0;j<4;j++)person(c,x+j*171,y,high?.65+i*.13:.86+i*.16,t+j*.47,
     ['#b27d61','#4e596d','#8b665c','#635363'][j]??'#79605e',j===i?'reach':'rest');
    polygon(c,'#543c44',[x-60,y+43,x+579,y+43,x+620,y+65,x-83,y+65]);
    line(c,'#8d6262',4,x-60,y+43,x+579,y+43);
   }
  }
  return;
 }
 if(art==='windowLight'||art==='stillPrayer'||art==='bookDetail'||art==='bookStudy'||art==='writing'||art==='preparation'||art==='almanac'){
  const study=art==='bookStudy'||art==='preparation', writing=art==='writing'||art==='preparation'||art==='almanac';
  base(c,writing?'#987366':'#a19682','#383549','#544753');
  arch(c,study?82:626,42,225,289,art==='windowLight'?'#d8b681':'#a28378');
  const sway=swing(t,1.4)*47,window=study?82:626;
  polygon(c,'#7f6573',[window+213,46,window+147,49,window+136+sway,172,window+170+sway*.55,320,window+219,329]);
  curve(c,'#d1a68a7a',4,window+181,63,window+168+sway,115,window+154+sway,216,window+184,314);
  polygon(c,'#6a4c49',[89,318,825,318,902,454,29,454]);
  line(c,'#c3936e',7,89,319,825,319);
  if(study||art==='stillPrayer')person(c,study?673:224,233,1.32,t,'#756071',art==='stillPrayer'?'rest':'work');
  const bx=art==='windowLight'?559:study?399:486;
  book(c,bx,345,art==='bookDetail'?2.2:1.54,t);
  if(writing){
   const x=bx+43*swing(t,2.1),y=321+7*swing(t,3);
   curve(c,'#d1ad84',9,x,y,x+12,y-29,x+28,y-44,x+46,y-72);
   line(c,'#463642',3,x,y,x+45,y-70);
   if(art==='almanac'){
    rect(c,159,341,146,79,'#e0bf94');
    for(let i=0;i<6;i++)line(c,'#8d675b',1,171,356+i*10,288,356+i*10);
    for(let i=0;i<7;i++)line(c,'#8d675b',1,172+i*18,355,172+i*18,405);
   }
  }else if(art==='bookDetail'){
   const rise=12*swing(t,1.4);
   polygon(c,'#f2d4a4',[490,323,526,290+rise,656,291+rise,644,323,515,353]);
   line(c,'#ac8262',3,527,313+rise,632,304+rise);
  }
  return;
 }
 const dusk=art==='crossDusk'||art==='crossNear';
 const warm=art==='threshold'||art==='gift'||art==='tableWelcome'||art==='dawn';
 base(c,warm?'#c39371':dusk?'#867181':'#928a82','#30354a','#584f57');
 if(dusk){
  polygon(c,'#655867',[0,336,138,257,280,312,445,240,577,319,756,196,960,298,960,480,0,480]);
  const x=art==='crossNear'?635:276, y=art==='crossNear'?104:184, scale=art==='crossNear'?1.24:.73;
  rect(c,x-13*scale,y,26*scale,204*scale,'#473a43');
  rect(c,x-61*scale,y+42*scale,122*scale,24*scale,'#473a43');
  line(c,'#b0876c',4,x-14*scale,y,x-14*scale,y+190*scale);
  person(c,art==='crossNear'?272:630,296,.98,t,'#867166','walk');
  return;
 }
 if(art==='threshold'||art==='porch'||art==='dawn'||art==='road'){
  const side=art==='porch'?190:art==='road'?723:489;
  if(art==='road'){
   polygon(c,'#a59480',[123,480,470,310,536,310,747,480]);
   polygon(c,'#706d79',[0,333,107,216,243,292,440,179,595,309,813,185,960,278,960,334]);
  }else{
   arch(c,side-109,56,218,282,art==='dawn'?'#e9c38e':'#b18d73');
   polygon(c,'#f2c38355',[side-83,333,side+110,330,side+300,480,side-230,480]);
   line(c,'#504550',7,side-100,334,side+104,334);
  }
  person(c,side-116+19*swing(t,1.03),280,1.03,t,'#6e6074','walk');
  person(c,side+83,258,.8,t+.8,'#9b745e',warm?'reach':'rest');
  return;
 }
 const stage=art==='gift'||art==='tableWelcome';
 const work=art==='brace'||art==='labor'||art==='handwork';
 const x=work?338:art==='mirror'?646:305;
 arch(c,work?637:116,42,208,290,'#bd9c7975');
 person(c,x,237,1.3,t,work?'#96715e':'#6b6179',work?'work':'reach');
 if(art==='mirror'){
  ellipse(c,429,194,100,119,'#d3a979');
  ellipse(c,429,194,91,110,'#aca4aa');
  ellipse(c,449,176+swing(t,1.7)*7,29,41,'#867981');
  polygon(c,'#857483',[413,219,480,215,498,280,387,280]);
  line(c,'#e5cfb8',3,393,118,466,103);
 }else{
  polygon(c,'#62464a',[404,331,773,331,823,396,368,396]);
  if(stage){
   person(c,773,213,1.18,t+.3,'#aa7f61','reach');
   ellipse(c,587+swing(t,1.6)*13,335,53,10,'#c0a47b');
   if(art==='gift')polygon(c,'#ae8867',[539,328,608,323,648,344,555,353]);
  }else{
   rect(c,513,287,98,31,'#a47c65');rect(c,531,265,111,23,'#76595d');
   if(art==='brace'){
    line(c,'#bd956e',15,489,331,611,232+swing(t,1.3)*6,696,330);
    line(c,'#59444b',6,609,235,613,324);
   }else{
    const a=swing(t,2.3)*30;
    line(c,'#d0a07a',10,484+a,258,624+a,315);
    line(c,'#6d555c',16,513+a,254,490+a,296);
   }
  }
 }
}


export const paintHolySpirit:Painter=(c,art,t,elapsed)=>{
 c.save();
 switch(art){
  case 'chapel':case 'pulpit':case 'objector':chapel(c,t,art==='chapel',art==='objector');break;
  case 'fountain':case 'fountainDry':fountain(c,t,art==='fountain'||elapsed<1.4);break;
  case 'temple':temple(c,t);break;
  case 'potter':case 'statue':case 'workbench':case 'stone':case 'seed':workshop(c,t,art);break;
  case 'wind':case 'scripture':case 'cradle':case 'adoption':case 'robe':windowScene(c,t,art);break;
  case 'cross':case 'hope':case 'manna':case 'street':case 'flood':case 'creatures':landscape(c,t,art);break;
  case 'gate':case 'chain':case 'nicodemus':case 'burden':interior(c,t,art);break;
  case 'templeExit':case 'arrival':case 'assembly':case 'pew':case 'balcony':case 'address':case 'prayerClose':
  case 'windowLight':case 'stillPrayer':case 'bookDetail':case 'bookStudy':case 'writing':case 'preparation':
  case 'almanac':case 'crossNear':case 'crossDusk':case 'threshold':case 'porch':case 'dawn':case 'road':
  case 'gift':case 'tableWelcome':case 'brace':case 'labor':case 'handwork':case 'mirror':
   openingDetail(c,t,art);break;
  default:throw new Error('Unknown Holy Spirit artwork: '+art);
 }
 c.restore();
};
