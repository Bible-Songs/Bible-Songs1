import {createExcellencyPainter} from './excellency-paint';

type Scene={readonly art:string};
type Point=readonly [number,number];
const recipes:Readonly<Record<string,readonly [string,readonly string[]]>>={
 stars:['night',['star']],gathering:['chamber',['guests','teacher','guests']],
 book:['table',['scroll','quill']],value:['table',['scales']],
 garden:['grove',['olive','kneeling','chalice']],pearl:['table',['pearl']],
 ruins:['ruins',['rubble']],seed:['meadow',['roots']],preacher:['city',['teacher','crowd']],
 flowers:['garden',['rose','lily']],city:['city',['cityscape']],
 tomb:['graves',['tomb','rising']],world:['night',['globe','orbit']],
 ice:['summit',['mountains']],rings:['table',['rings']],
 search:['road',['traveler','lamp']],prayer:['chamber',['kneeling']],
 throne:['hall',['throne']],shore:['coast',['rock']],river:['coast',['rock','water']],
 cross:['dusk',['cross']],scales:['table',['scales']],
};
const amber='#d6ad69';
function polygon(c:CanvasRenderingContext2D,points:readonly Point[],color:string){
 c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));
 c.closePath();c.fillStyle=color;c.fill();
}
function line(c:CanvasRenderingContext2D,points:readonly Point[],color:string,size:number){
 c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));
 c.strokeStyle=color;c.lineWidth=size;c.lineCap='round';c.stroke();
}
function ellipse(c:CanvasRenderingContext2D,x:number,y:number,rx:number,ry:number,color:string){
 c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();
}
function gem(c:CanvasRenderingContext2D,x:number,y:number,size:number,tone:number,t:number){
 const colors=[
 ['#d5ebe3','#8bbabf','#527b89','#edf6da'],
 ['#c78b84','#9d4d51','#592d42','#e6b4a0'],
 ['#92c4a1','#438377','#255252','#d3e1ad'],
 ['#9eaecf','#536f9d','#303d68','#d9deea'],
 ] as const;
 const palette=colors[tone%4]??colors[0];
 c.save();c.translate(x,y);c.scale(size,size);
 ellipse(c,0,19,46,8,'rgba(11,22,27,.43)');
 polygon(c,[[-45,-25],[-27,-49],[25,-49],[45,-25],[0,23]],palette[2]);
 polygon(c,[[-45,-25],[-27,-49],[-12,-25]],palette[0]);
 polygon(c,[[-27,-49],[25,-49],[13,-25],[-12,-25]],palette[3]);
 polygon(c,[[25,-49],[45,-25],[13,-25]],palette[1]);
 polygon(c,[[-45,-25],[-12,-25],[0,23]],palette[1]);
 polygon(c,[[-12,-25],[13,-25],[0,23]],palette[0]);
 polygon(c,[[13,-25],[45,-25],[0,23]],palette[2]);
 line(c,[[-44,-25],[44,-25]],palette[3],1);
 const pulse=.3+.7*Math.max(0,Math.sin(t*1.3+tone*1.4));
 c.globalAlpha=pulse;
 line(c,[[-25,-53],[-25,-35]],'#fff5cf',1.8);
 line(c,[[-33,-44],[-17,-44]],'#fff5cf',1.8);
 c.restore();
}
function rough(c:CanvasRenderingContext2D,x:number,y:number,s:number){
 c.save();c.translate(x,y);c.scale(s,s);
 ellipse(c,0,6,58,12,'rgba(13,24,27,.4)');
 polygon(c,[[-57,0],[-44,-43],[-10,-64],[29,-54],[59,-17],[40,7]],'#6b7570');
 polygon(c,[[-44,-43],[-10,-64],[29,-54],[2,-25]],'#a6ada0');
 polygon(c,[[2,-25],[29,-54],[59,-17],[40,7]],'#4d5e5e');
 line(c,[[-30,-40],[-8,-31],[-13,-12]],'#535d58',2);
 c.restore();
}
function crown(c:CanvasRenderingContext2D,t:number){
 polygon(c,[[297,366],[265,228],[342,278],[397,195],[473,275],[552,196],[611,278],[688,229],[659,366]],'#a77f4d');
 polygon(c,[[297,342],[659,342],[654,383],[302,383]],'#dbb67a');
 for(let i=0;i<5;i++)gem(c,337+i*71,347,.55,i,t);
 line(c,[[303,373],[652,373]],'#f0d7a3',3);
}
function casket(c:CanvasRenderingContext2D,t:number){
 polygon(c,[[294,318],[675,318],[639,425],[328,425]],'#644833');
 polygon(c,[[294,318],[325,291],[644,291],[675,318]],'#c29a64');
 polygon(c,[[319,319],[650,319],[624,393],[343,393]],'#283c43');
 polygon(c,[[325,291],[333,173],[625,173],[644,291]],'#a57c4a');
 polygon(c,[[342,274],[347,189],[611,189],[625,274]],'#405458');
 for(let i=0;i<6;i++)gem(c,370+i%3*106,335+Math.floor(i/3)*37,.55,i,t);
 c.fillStyle=amber;c.fillRect(465,392,33,29);
}
export function createJewelsPainter(scenes:readonly Scene[]){
 const compositions=scenes.map(scene=>{
  const recipe=recipes[scene.art];
  return {art:scene.art,setting:recipe?.[0]??(scene.art==='mine'?'graves':'table'),objects:recipe?.[1]??[]};
 });
 const base=createExcellencyPainter(compositions);
 return (c:CanvasRenderingContext2D,art:string,t:number,elapsed:number,index:number)=>{
  base(c,art,t,elapsed,index);
  const time=t===0?0:t;
  switch(art){
   case 'casket':casket(c,time);break;
   case 'crown':crown(c,time);break;
   case 'collection':case 'sizes':case 'rare':case 'rubies':case 'sapphire':{
    const single=art==='sapphire';
    for(let i=0;i<(single?1:6);i++){
     const size=single?2.7:art==='sizes'?.45+i*.29:art==='rare'?(i===2?1.7:.35):1.1;
     gem(c,single?480:220+i%3*255,single?342:270+Math.floor(i/3)*115,size,art==='rubies'?1:single?3:i,time);
    }
    break;
   }
   case 'diamond':case 'prism':case 'small':{
    if(art==='prism'){
     polygon(c,[[0,124],[458,256],[458,287],[0,151]],'rgba(254,241,191,.35)');
     for(let i=0;i<5;i++)polygon(c,[[505,274],[960,178+i*34],[960,197+i*34]],['#b77c73','#be9c68','#b8bc83','#7caba0','#8e9caf'][i]??amber);
    }
    gem(c,480,349,art==='small'?1:3,0,time);break;
   }
   case 'breastplate':
    line(c,[[352,160],[332,112]],amber,18);
    line(c,[[612,160],[632,112]],amber,18);
    for(const x of [332,632]){
     c.beginPath();c.arc(x,104,15,0,Math.PI*2);c.strokeStyle='#e3c48b';c.lineWidth=7;c.stroke();
    }
    polygon(c,[[335,149],[628,149],[661,395],[304,395]],'#a0804e');
    for(let i=0;i<12;i++)gem(c,365+i%3*113,206+Math.floor(i/3)*52,.53,i,time);
    break;
   case 'wheel':case 'cutting':case 'dust':{
    c.fillStyle='#725840';c.fillRect(309,342,339,22);c.fillRect(346,362,20,65);c.fillRect(606,362,20,65);
    ellipse(c,475,280,110,110,'#445355');ellipse(c,475,280,101,101,'#88948a');
    ellipse(c,475,280,28,28,'#b49c73');
    for(let i=0;i<12;i++){
     const a=i*Math.PI/6+time*1.4;
     line(c,[[475+Math.cos(a)*37,280+Math.sin(a)*37],[475+Math.cos(a)*94,280+Math.sin(a)*94]],'#627671',3);
    }
    gem(c,577,240,.83,0,time);
    line(c,[[578,210],[682,150]],'#b19065',13);
    for(let i=0;i<12;i++){const x=572+i*8,y=267+((time*49+i*17)%120);ellipse(c,x,y,1.5,2,amber);}
    if(art==='dust')gem(c,738,389,.37,0,time);
    break;
   }
   case 'mine':
    polygon(c,[[175,445],[238,177],[404,111],[716,194],[798,445]],'#4a5150');
    polygon(c,[[295,444],[332,240],[442,174],[628,240],[675,444]],'#1d3038');
    line(c,[[313,443],[335,237],[442,185],[624,245],[656,443]],'#9b7a50',13);
    for(let i=0;i<4;i++)rough(c,240+i*160,423,.55);
    gem(c,423,344,1.05,2,time);gem(c,579,409,.65,0,time);
    break;
   case 'glass':
    polygon(c,[[290,380],[485,214],[702,288],[506,433]],'rgba(185,214,209,.25)');
    line(c,[[350,357],[540,281]],'#e8e2c4',3);gem(c,540,280,1.2,0,time);break;
   case 'furnace':
    c.fillStyle='#82725b';c.fillRect(302,169,352,251);
    polygon(c,[[355,407],[355,266],[405,227],[560,227],[604,266],[604,407]],'#302a28');
    for(let i=0;i<7;i++)polygon(c,[[355+i*33,402],[370+i*33,323+Math.sin(time*3+i)*22],[401+i*31,402]],i%2?'#bd7544':'#ddac64');
    gem(c,478,331,1.1,0,time);break;
   case 'rough':rough(c,480,366,2.5);gem(c,489,300,.65,2,time);break;
   case 'lab':
    c.fillStyle='#866d4f';c.fillRect(210,370,540,17);
    for(let i=0;i<3;i++){
     const x=315+i*171;
     polygon(c,[[x-17,208],[x+17,208],[x+17,272],[x+56,350],[x-56,350],[x-17,272]],'rgba(193,215,205,.45)');
     polygon(c,[[x-42,333],[x+43,333],[x+25,300],[x-26,300]],['#628f8c','#a17a65','#84956e'][i]??amber);
    }break;
   case 'washing':
    ellipse(c,480,366,177,54,'#b09970');ellipse(c,480,356,159,40,'#608887');rough(c,490,345,1.4);
    for(let i=0;i<7;i++)ellipse(c,460+i*8,193+(i*31+time*49)%113,3,7,'#b6d3c5');
    break;
   case 'brook':
    polygon(c,[[355,135],[568,135],[681,480],[179,480]],'#5f8b8b');
    for(let i=0;i<14;i++)rough(c,280+(i*93)%375,230+(i*51)%218,.35);
    gem(c,496,353,1.2,1,time);break;
   case 'lost':rough(c,367,395,1.8);gem(c,530,345,1.45,3,time);break;
   case 'counterfeit':
    gem(c,326,349,1.7,3,time);gem(c,619,349,1.7,3,time);
    c.strokeStyle='#d8c3a0';c.lineWidth=9;c.beginPath();c.arc(631,315,72,0,Math.PI*2);c.stroke();
    line(c,[[681,366],[745,427]],'#a78359',14);break;
   case 'transform':{
    const progress=Math.min(1,elapsed/7);
    c.save();c.globalAlpha=1-progress;rough(c,480,369,2.3);c.restore();
    c.save();c.globalAlpha=progress;gem(c,480,349,2.5,0,time);c.restore();break;
   }
  }
 };
}
