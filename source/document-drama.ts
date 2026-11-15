type Part={text:string;voice:string};
const narrator='warm';
const cast=['classic','voice5','voice3','voice8','composite','voice10','voice7','voice9','voice6'];

export const speakerLine=/^([A-Z][\p{L}'’-]*(?: [A-Z][\p{L}'’-]*)?):\s+(.+)$/u;

export function documentDrama(lines:string[],scriptLabels=true):Part[][]{
 const speakers=new Map<string,string>();
 let dialogueVoice:string|undefined;
 function voiceFor(name:string){
  const key=name.toLowerCase();
  if(!speakers.has(key))speakers.set(key,cast[speakers.size%cast.length]);
  return speakers.get(key)!;
 }
 return lines.map(line=>{
  const script=scriptLabels?line.match(speakerLine):null;
  if(script&&!dialogueVoice)return [{text:script[2],voice:voiceFor(script[1])}];
  const parts:Part[]=[];
  const push=(text:string,voice:string)=>{
   if(!text.trim())return;
   const previous=parts.at(-1);
   if(previous?.voice===voice)previous.text+=' '+text.trim();
   else parts.push({text:text.trim(),voice});
  };
  let start=0;
  for(const quote of line.matchAll(/[“”"]/g)){
   const offset=quote.index;
   const opening=quote[0]==='“'||(quote[0]==='"'&&!dialogueVoice);
   if(opening){
    const before=line.slice(0,offset).match(/\b([A-Z][\p{L}'’-]*) (?:said|asked|replied|whispered|shouted)[,:]?\s*$/u);
    const after=line.slice(offset+1).match(/^[^“”"]*[”"]\s*[, ]*([A-Z][\p{L}'’-]*) (?:said|asked|replied|whispered|shouted)\b/u);
    const name=before?.[1]??after?.[1];
    push(line.slice(start,offset),dialogueVoice??narrator);
    dialogueVoice=name?voiceFor(name):narrator;
   }else{
    push(line.slice(start,offset),dialogueVoice??narrator);
    dialogueVoice=undefined;
   }
   start=offset+1;
  }
  push(line.slice(start),dialogueVoice??narrator);
  return parts.length?parts:[{text:line,voice:narrator}];
 });
}
