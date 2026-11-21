import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {chromium} from 'playwright';
import type {Page} from 'playwright';

type Sermon='prayer'|'excellency'|'jewels';
type Case={sermon:Sermon;scene:number;caption:string;end:number;next:number;start:number;finish:number};
function record(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Expected record');return value as Record<string,unknown>;}
function finite(value:unknown):number{if(typeof value!=='number'||!Number.isFinite(value))throw new Error('Expected time');return value;}
function list(value:unknown):unknown[]{if(!Array.isArray(value))throw new Error('Expected list');return value as unknown[];}
async function json(path:string):Promise<unknown>{return JSON.parse(await readFile(path,'utf8'));}
const project=resolve('..'),work=join(project,'video-previews/caption-retention-2026-11-21');
await mkdir(work,{recursive:true});
const plan=record(await json(join(project,'video-previews/caption-audit-2026-11-21/three-second-remedy-plan.json')));
const audit=record(await json(join(project,'video-previews/caption-audit-2026-11-21/audit.json')));
const results=list(audit['results']).map(record);
const cases:Case[]=[];
for(const value of list(plan['rows'])){
 const row=record(value),title=row['sermon'];if(typeof title!=='string')throw new Error('Missing title');
 const sermon:Sermon=title.startsWith('Prayer')?'prayer':title.startsWith('The Excellency')?'excellency':'jewels';
 const group=results.find(r=>r['title']===title);if(!group)throw new Error('Missing audit');
 const rows=list(group['rows']).map(record),scene=finite(row['scene']),current=rows[scene-1],next=rows[scene];
 if(!current||!next||typeof row['caption']!=='string')throw new Error('Missing caption');
 const timings=list(await json('source/'+sermon+'-caption-timing.json')).map(record);
 const timing=sermon==='prayer'?timings.find(t=>t['cue']===current['cue']):timings[scene-1];
 const incoming=sermon==='prayer'?timings.find(t=>t['cue']===next['cue']):timings[scene];
 if(!timing||!incoming)throw new Error('Missing timing');
 const at=list(timing['at']).map(finite),following=list(incoming['at']).map(finite);
 const end=finite(row['uncappedRevealEnd']);
 cases.push({sermon,scene,caption:row['caption'],end,next:finite(row['nextCaptionOnset']),start:Math.max(0,finite(at[0])-.4),finish:Math.max(end+3.7,finite(following.at(-1))+1.9)});
}
assert.equal(cases.length,35);
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,chromiumSandbox:true});
async function render(page:Page,item:Case,time:number):Promise<void>{
 await page.evaluate(async ({sermon,time})=>{window.captionPreview.render(sermon,time);await new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));},{sermon:item.sermon,time});
}
try{
 const page=await browser.newPage({viewport:{width:960,height:1280}});
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:5191/Bible-Songs1/tests/caption-preview.html');
 await page.waitForFunction(()=>!!window.captionPreview);
 const checks=[];
 for(const width of [960,390]){
  await page.setViewportSize({width,height:width===390?844:1280});
  for(const item of cases){
   const time=item.end+2.9;await render(page,item,time);
   const line=page.locator(`[data-caption-id="${item.scene-1}"]`);
   assert.equal(await line.getAttribute('aria-label'),item.caption);
   assert.equal(await line.evaluate(el=>Number(getComputedStyle(el).opacity)),1,'Caption dimmed before three-second hold');
   assert(await line.locator('.prayer-animation-word').evaluateAll(words=>words.every(word=>word instanceof HTMLElement&&word.style.clipPath==='inset(0px 0% 0px 0px)')),'Incomplete outgoing reveal');
   const bounds=await page.locator('[data-caption-id]').evaluateAll(lines=>lines.map(line=>{const r=line.getBoundingClientRect();return{top:r.top,bottom:r.bottom,left:r.left,right:r.right};}));
   assert(bounds.length<=2,'More than two visible captions');
   if(bounds.length===2){const upper=bounds[0],lower=bounds[1];assert(upper&&lower&&lower.top>=upper.bottom,'Captions collide');}
   assert(bounds.every(b=>b.left>=0&&b.right<=width),'Caption exceeds viewport');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
   const fadeAt=Math.max(item.next,item.end+3);
   await render(page,item,fadeAt+.25);
   const fading=page.locator(`[data-caption-id="${item.scene-1}"]`);
   assert(Math.abs(await fading.evaluate(el=>Number(getComputedStyle(el).opacity))-.5)<.001,'Fade timing changed');
   await render(page,item,fadeAt+.6);assert.equal(await page.locator(`[data-caption-id="${item.scene-1}"]`).count(),0);
   checks.push({sermon:item.sermon,scene:item.scene,width,passed:true});
  }
 }
 for(const sermon of ['prayer','excellency','jewels'] as const){
  const item=cases.find(c=>c.sermon===sermon&&c.next<c.end+3);if(!item)throw new Error('Missing overlap');
  await page.setViewportSize({width:390,height:844});await render(page,item,Math.max(item.next+.6,item.end+1));
  await page.locator('figure').screenshot({path:join(work,sermon+'-mobile.png')});
  await page.emulateMedia({reducedMotion:'reduce'});await render(page,item,item.next+.1);
  await render(page,item,item.start); // Backward seek must discard later captions.
  const ids=await page.locator('[data-caption-id]').evaluateAll(nodes=>nodes.map(node=>Number(node.getAttribute('data-caption-id'))));
  assert(ids.every(id=>id<=item.scene-1));await page.emulateMedia({reducedMotion:'no-preference'});
 }
 assert.deepEqual(errors,[]);
 await writeFile(join(work,'browser-checks.json'),JSON.stringify({checks,allPassed:true,reducedMotionAndBackwardSeek:true},null,2)+'\n');
 console.log('All 35 transitions passed at desktop and mobile widths; reduced motion and backward seeking passed.');
 if(process.argv.includes('--export')){
  const assets:Record<Sermon,string>={prayer:'GitHub History/Release Assets/2026-11-17_audio-1.0.124/assets/prayer-the-cure-for-care-spurgeon.m4a',jewels:'GitHub History/Release Assets/2026-11-17_audio-1.0.124/assets/gods-jewels-spurgeon.m4a',excellency:'GitHub History/Release Assets/2026-11-16_audio-1.0.114/assets/library/excellency-of-christ-edwards.m4a'};
  const queue=cases.values();let done=0;
  async function worker():Promise<void>{
   const page=await browser.newPage({viewport:{width:960,height:1280}});
   await page.goto('http://127.0.0.1:5191/Bible-Songs1/tests/caption-preview.html');await page.waitForFunction(()=>!!window.captionPreview);
   try{for(const item of queue){
    const name=`${item.sermon}-scene-${String(item.scene).padStart(3,'0')}.mp4`,output=join(work,name),fps=15,frames=Math.ceil((item.finish-item.start)*fps);
    const ffmpeg=spawn(join(project,'video-previews/tools/ffmpeg'),['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0','-ss',String(item.start),'-i',join(project,assets[item.sermon]),'-map','0:v:0','-map','1:a:0','-t',String(frames/fps),'-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2','-af','apad','-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart',output],{stdio:['pipe','ignore','inherit']});
    const completion=once(ffmpeg,'close');
    for(let frame=0;frame<frames;frame++){
     await render(page,item,item.start+frame/fps);
     const image=await page.locator('figure').screenshot({type:'jpeg',quality:88,animations:'allow'});
     if(!ffmpeg.stdin.write(image))await once(ffmpeg.stdin,'drain');
    }
    ffmpeg.stdin.end();const [code]=await completion;assert.equal(code,0,'Preview encoding failed');
    done++;console.log(`Preview ${done}/35: ${name}`);
   }}finally{await page.close();}
  }
  const workers=await Promise.allSettled([worker(),worker()]);for(const result of workers)if(result.status==='rejected')throw result.reason;
  await writeFile(join(work,'index.html'),'<!doctype html><meta charset="utf-8"><title>35 caption previews</title><style>body{font:18px system-ui;max-width:1000px;margin:2em auto;background:#172b31;color:#f8e9cb}a{color:#b9e3d4}li{margin:1em}video{max-width:100%}</style><h1>35 caption transition previews</h1><p>Local draft. Original narration and wording; outgoing caption above incoming caption, held three seconds after reveal. At normal playback speed.</p><ol>'+cases.map(c=>`<li>${c.sermon}, scene ${c.scene}: ${c.caption.replaceAll('&','&amp;').replaceAll('<','&lt;')}<br><a href="${c.sermon}-scene-${String(c.scene).padStart(3,'0')}.mp4">Watch MP4</a></li>`).join('')+'</ol>');
  console.log('All 35 MP4 previews and index completed.');
 }
}finally{await browser.close();}
