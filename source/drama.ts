import type {ReadingBoundary} from './reading-cues';

const narrator='warm';
const cast:Record<string,string>={
 God:'composite', Scripture:'voice7', 'Unnamed speakers':'voice9', Adam:'classic', Eve:'voice5', Serpent:'voice9', Cain:'voice3',
 Lamech:'voice7', Noah:'voice7', Builders:'voice7', Abram:'classic',
 Pharaoh:'voice9', Melchizedek:'voice7', 'King of Sodom':'voice3',
};
const roles:Record<number,Record<number,string[]>>={
 1:{3:['God'],6:['God'],9:['God'],11:['God'],14:['God'],20:['God'],22:['God'],24:['God'],26:['God'],28:['God'],29:['God']},
 2:{16:['God'],18:['God'],23:['Adam']},
 3:{1:['Serpent'],2:['Eve'],4:['Serpent'],5:['Serpent'],9:['God'],10:['Adam','Adam'],11:['God','God'],12:['Adam'],13:['God','Eve'],14:['God'],16:['God'],17:['God'],22:['God']},
 4:{1:['Eve'],6:['God','God'],8:['Cain'],9:['God','Cain','Cain'],10:['God','God'],13:['Cain'],15:['God','God'],23:['Lamech'],25:['Eve']},
 5:{29:['Lamech']},
 6:{3:['God'],7:['God'],13:['God']},
 7:{1:['God']},
 8:{16:['God'],21:['God']},
 9:{1:['God'],9:['God'],12:['God'],17:['God'],25:['Noah'],26:['Noah']},
 11:{3:['Builders'],4:['Builders','Builders'],6:['God']},
 12:{1:['God'],7:['God'],11:['Abram'],18:['Pharaoh']},
 13:{8:['Abram'],14:['God']},
 14:{19:['Melchizedek'],21:['King of Sodom'],22:['Abram']},
 15:{1:['God'],2:['Abram'],3:['Abram'],4:['God'],5:['God','God'],7:['God'],8:['Abram'],9:['God'],13:['God'],18:['God']},
};

const romansRoles:typeof roles={
 1:{17:['Scripture']},
 2:{6:['Scripture'],24:['Scripture']},
 3:{4:['Scripture'],8:['Unnamed speakers'],10:['Scripture'],13:['Scripture','Scripture'],
    14:['Scripture'],15:['Scripture'],18:['Scripture']},
 4:{3:['Scripture'],7:['Scripture'],17:['God'],18:['God'],22:['Scripture'],23:['Scripture']},
};

export function dramaCues(chapter:number, verses:{verse:number;text:string}[], boundaries:ReadingBoundary[],book:'genesis'|'romans'='genesis'){
 let speaker:string|undefined;
 const dialogue=new Map<number,{start:number;end:number;voice:string}[]>();
 for(const verse of verses){
  const speakers=(book==='romans'?romansRoles:roles)[chapter]?.[verse.verse]??[];
  let opening=0;
  let start=0;
  const ranges:{start:number;end:number;voice:string}[]=[];
  for(const match of verse.text.matchAll(/[“”]/g)){
   const offset=match.index!;
   if(match[0]==='“'){
    speaker=speakers[opening++];
    start=offset;
   }else{
    if(speaker)ranges.push({start,end:offset+1,voice:cast[speaker]});
    speaker=undefined;
   }
  }
  if(speaker)ranges.push({start,end:verse.text.length,voice:cast[speaker]});
  dialogue.set(verse.verse,ranges);
 }
 return boundaries.map((cue,index)=>{
  const next=boundaries[index+1];
  for(let verse=cue.verse;verse<=(next?.verse??verses.at(-1)?.verse??cue.verse);verse++){
   const from=verse===cue.verse?cue.offset:0;
   const to=verse===next?.verse?next.offset:Infinity;
   const speech=dialogue.get(verse)?.find(range=>range.start<to&&range.end>from);
   if(speech)return {...cue,voice:speech.voice};
  }
  return {...cue,voice:narrator};
 });
}
