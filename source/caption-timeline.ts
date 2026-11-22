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

export const CAPTION_GAP=1;
// By default a completed caption stays until the next one starts (approved Prayer/Excellency/Jewels behaviour).
// With fadeAfterHold, it stays until CAPTION_FADE + CAPTION_GAP before the next caption (never less than its hold),
// so the old caption has fully gone CAPTION_GAP seconds before the next one appears (Mike, 22 Nov 2026).
export function captionOpacity(caption:TimedCaption,next:TimedCaption|undefined,position:number,duration:number,minimumHold:number=CAPTION_HOLD,fadeAfterHold=false):number{
 if(position<caption.start)return 0;
 if(!next)return 1;
 if(!fadeAfterHold&&position<next.start)return 1;
 const held=revealEnd(caption,duration)+minimumHold;
 const fadeAt=fadeAfterHold?Math.max(held,next.start-CAPTION_GAP-CAPTION_FADE):Math.max(next.start,held);
 return Math.max(0,1-Math.max(0,position-fadeAt)/CAPTION_FADE);
}
