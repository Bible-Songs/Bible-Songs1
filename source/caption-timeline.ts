export type CaptionWord={readonly text:string;readonly start:number;readonly end:number};
export type TimedCaption={readonly id:number;readonly line:string;readonly start:number;readonly end:number;readonly words:readonly CaptionWord[]};
export const CAPTION_HOLD=3;
export const CAPTION_FADE=.5;

export function timedCaption(id:number,line:string,starts:readonly number[],fallback:number):TimedCaption{
 const text=line.split(' ');
 const words:CaptionWord[]=[];
 for(let index=0;index<text.length;index+=3){
  const phrase=text.slice(index,index+3).join(' '),part=index/3;
  const start=starts[part]??fallback,end=starts[part+1]??start+1.15;
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)throw new Error('Invalid caption reveal interval');
  let offset=0;
  for(const word of phrase.split(' ')){
   const from=start+(end-start)*offset/(phrase.length+1);
   offset+=word.length+1;
   words.push({text:word,start:from,end:start+(end-start)*offset/(phrase.length+1)});
  }
 }
 return {id,line,start:words[0]?.start??fallback,end:words.at(-1)?.end??fallback,words};
}

export function revealEnd(caption:TimedCaption,duration:number):number{
 return Math.min(caption.end,Number.isFinite(duration)&&duration>0?duration-.05:Infinity);
}

export function captionOpacity(caption:TimedCaption,next:TimedCaption|undefined,position:number,duration:number,minimumHold:number=CAPTION_HOLD):number{
 if(position<caption.start)return 0;
 if(!next||position<next.start)return 1;
 const fadeAt=Math.max(next.start,revealEnd(caption,duration)+minimumHold);
 return Math.max(0,1-Math.max(0,position-fadeAt)/CAPTION_FADE);
}
