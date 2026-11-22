import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';

type Word={text:string;start:number;end:number};
type Timing={cue:number;at:number[];words:Word[]};
type Scene={cue:number;art:string;line:string;start:number};
type Cue={start:number;text:string};
function rows<T>(name:string,valid:(value:unknown)=>value is T):T[]{
 const value:unknown=JSON.parse(readFileSync(new URL('../source/'+name,import.meta.url),'utf8'));
 assert(Array.isArray(value)&&value.every(valid),'Invalid '+name);return value;
}
const record=(value:unknown):value is Record<string,unknown>=>value!==null&&typeof value==='object';
const word=(value:unknown):value is Word=>record(value)&&typeof value['text']==='string'&&typeof value['start']==='number'&&typeof value['end']==='number';
const scenes=rows<Scene>('bruised-reed-scenes.json',(value):value is Scene=>record(value)&&typeof value['cue']==='number'&&typeof value['art']==='string'&&typeof value['line']==='string'&&typeof value['start']==='number');
const timing=rows<Timing>('bruised-reed-caption-timing.json',(value):value is Timing=>record(value)&&typeof value['cue']==='number'&&Array.isArray(value['at'])&&value['at'].every(t=>typeof t==='number')&&Array.isArray(value['words'])&&value['words'].every(word));
const cues=rows<Cue>('bruised-reed-cues.json',(value):value is Cue=>record(value)&&typeof value['start']==='number'&&typeof value['text']==='string');
if(process.env['BIBLE_ALLOW_PREVIEW']!=='1'){
 for(const filename of ['bruised-reed-scenes.json','bruised-reed-caption-timing.json']){const data:unknown=JSON.parse(readFileSync(new URL('../source/'+filename,import.meta.url),'utf8'));assert(Array.isArray(data)&&data.every(row=>record(row)&&!('previewOnly' in row)),'Provisional assets must not ship');}
}
assert.equal(timing.length,scenes.length);
assert(scenes.length>200,'Full book scene coverage');
const user={id:'00000000-0000-4000-8000-000000000009',aud:'authenticated',role:'authenticated',email:'fixture@example.invalid',app_metadata:{},user_metadata:{bible_songs_preferences:{favorite:false,speed:1}}};
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,chromiumSandbox:true,args:['--autoplay-policy=no-user-gesture-required']});
const errors:string[]=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:1100}});
 await context.addInitScript(account=>{
  const exp=Math.floor(Date.now()/1000)+3600,encode=(value:object)=>btoa(JSON.stringify(value)).replaceAll('=','');
  sessionStorage.setItem('sb-rzvfeeatzksvgxucbzbo-auth-token',JSON.stringify({access_token:encode({alg:'HS256'})+'.'+encode({sub:account.id,exp})+'.fixture',refresh_token:'fixture',expires_at:exp,user:account}));
  // Deterministic media clock exercises the real player, transcript and Canvas components
  // at book-wide positions without downloading four hours for every visual assertion.
  type State={time:number;paused:boolean;from:number};
  const states=new WeakMap<HTMLMediaElement,State>();
  const state=(media:HTMLMediaElement)=>{let value=states.get(media);if(!value){value={time:0,paused:true,from:performance.now()};states.set(media,value);}return value;};
  const now=(media:HTMLMediaElement)=>{const value=state(media);return value.time+(value.paused?0:(performance.now()-value.from)/1000*media.playbackRate);};
  Object.defineProperties(HTMLMediaElement.prototype,{
   currentTime:{configurable:true,get(this:HTMLMediaElement){return now(this);},set(this:HTMLMediaElement,time:number){const value=state(this);value.time=time;value.from=performance.now();this.dispatchEvent(new Event('timeupdate'));this.dispatchEvent(new Event('seeked'));}},
   paused:{configurable:true,get(this:HTMLMediaElement){return state(this).paused;}},
   ended:{configurable:true,get(){return false;}},
   duration:{configurable:true,get(){return 14499.4;}},
   readyState:{configurable:true,get(){return 4;}},
  });
  HTMLMediaElement.prototype.play=function(){const value=state(this);value.from=performance.now();value.paused=false;this.dispatchEvent(new Event('loadedmetadata'));this.dispatchEvent(new Event('playing'));return Promise.resolve();};
  HTMLMediaElement.prototype.pause=function(){const value=state(this);value.time=now(this);value.paused=true;this.dispatchEvent(new Event('pause'));};
 },user);
 const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://rzvfeeatzksvgxucbzbo.supabase.co/**',route=>route.fulfill({json:user}));
 await page.route(/\.(?:m4a|mp3)(?:\?|$)/,route=>route.abort());
 await page.goto(process.env['BIBLE_TEST_URL']??'http://127.0.0.1:5190/Bible-Songs1/');
 await page.waitForTimeout(250);
 if(errors.length)throw Error('Page errors: '+errors.join('; '));
 await page.getByRole('button',{name:'Listening Library',exact:true}).click();
 const table=page.getByRole('table',{name:'Published readings — quick actions'});
 await table.getByRole('button',{name:'Watch animation for The Bruised Reed',exact:true}).click();
 const card=page.getByRole('article').filter({has:page.getByRole('heading',{name:'The Bruised Reed',exact:true})});
 const figure=card.getByRole('figure');await figure.waitFor();
 await card.getByRole('button',{name:'Hide animation',exact:true}).waitFor();
 const audio=page.locator('.document-library audio');
 await audio.evaluate(element=>(element as HTMLAudioElement).pause());
 async function seek(time:number){
  await audio.evaluate((element,position)=>{const media=element as HTMLAudioElement;media.currentTime=position;media.dispatchEvent(new Event('timeupdate'));},time);
  await page.waitForFunction(position=>{const media=document.querySelector<HTMLAudioElement>('.document-library audio');return media!==null&&Math.abs(media.currentTime-position)<.02;},time);
  await page.evaluate(()=>new Promise<void>(done=>requestAnimationFrame(()=>requestAnimationFrame(()=>done()))));
 }
 const checks:{index:number;cue:number;art:string;time:number;caption:string}[]=[];
 const sampleKeys=['reed','wick','seed','clock','anchor','victory'];
 const indices=[0,...sampleKeys.map(art=>scenes.findIndex(scene=>scene.art===art)),Math.floor(scenes.length/2),scenes.length-1].filter((value,index,array)=>value>=0&&array.indexOf(value)===index);
 for(const index of indices){
  const scene=scenes[index],entry=timing[index];assert(scene&&entry);
  const end=entry.words.at(-1)?.end;assert(end!==undefined);
  const at=Math.min(14499.3,end+1);
  await seek(at);
  const caption=figure.locator(`[data-caption-id="${index}"]`);await caption.waitFor();
  assert.equal(await caption.getAttribute('aria-label'),scene.line);
  assert.equal(await caption.evaluate(element=>getComputedStyle(element).opacity),'1');
  assert(await figure.locator('canvas').evaluate(canvas=>canvas instanceof HTMLCanvasElement&&canvas.width===960&&canvas.height===480&&canvas.toDataURL().length>20000));
  const cue=cues[scene.cue];assert(cue&&cue.text.includes(scene.line));
  await figure.screenshot({path:`/tmp/bruised-reed-${index}-${scene.art}.png`});
  checks.push({index,cue:scene.cue,art:scene.art,time:at,caption:scene.line});
 }
 // Exact word clocks should reveal an in-progress word, then freeze while paused.
 const middle=Math.floor(scenes.length/2),entry=timing[middle];assert(entry);
 const first=entry.words[0];assert(first&&first.end>first.start);
 await seek((first.start+first.end)/2);
 const partial=figure.locator(`[data-caption-id="${middle}"] .prayer-animation-word`).first();
 const clipping=await partial.evaluate(element=>getComputedStyle(element).clipPath);
 assert.match(clipping,/inset/);assert(!clipping.includes('100%')&&!/^inset\(0(?:px)? 0(?:px)?/.test(clipping),'Partial word reveal');
 await page.waitForTimeout(150);
 assert.equal(await partial.evaluate(element=>getComputedStyle(element).clipPath),clipping,'Paused reveal is stable');
 // Audit every completed caption's four-second hold in the live DOM, including scene boundaries.
 for(const [index,row]of timing.entries()){
  const end=row.words.at(-1)?.end;assert(end!==undefined);
  await seek(Math.min(end+3.95,14499.3));
  const caption=figure.locator(`[data-caption-id="${index}"]`);
  assert.equal(await caption.count(),1,`Retained caption ${index}`);
  assert.equal(await caption.evaluate(element=>getComputedStyle(element).opacity),'1',`Four-second hold ${index}`);
 }
 // Transcript current passage follows a deep seek and is positioned inside its scroll panel.
 const deep=timing[Math.floor(timing.length*.8)],deepScene=scenes[Math.floor(scenes.length*.8)];assert(deep&&deepScene);
 const position=deep.words[0]?.start;assert(position!==undefined);await seek(position+1);
 const transcript=card.getByLabel('The Bruised Reed transcript');
 const active=transcript.locator('[aria-current="true"]');assert.equal(await active.count(),1);
 assert(await active.evaluate(element=>{const panel=element.parentElement;if(!panel)return false;const box=panel.getBoundingClientRect(),row=element.getBoundingClientRect();return row.top>=box.top-2&&row.top<box.bottom;}));
 await card.getByRole('combobox',{name:'Playback speed'}).selectOption('1.5');
 assert.equal(await audio.evaluate(element=>(element as HTMLAudioElement).playbackRate),1.5);
 await card.getByRole('button',{name:'Play The Bruised Reed',exact:true}).click();
 await card.getByRole('button',{name:'Pause The Bruised Reed',exact:true}).waitFor();
 const before=await audio.evaluate(element=>(element as HTMLAudioElement).currentTime);await page.waitForTimeout(200);
 const after=await audio.evaluate(element=>(element as HTMLAudioElement).currentTime);assert(after-before>.2,'Clock advances at 1.5×');
 await card.getByRole('button',{name:'Pause The Bruised Reed',exact:true}).click();
 await page.setViewportSize({width:390,height:844});await seek(position+2);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await figure.screenshot({path:'/tmp/bruised-reed-mobile.png'});
 assert(await figure.evaluate(element=>{const bounds=element.getBoundingClientRect();return bounds.width<=innerWidth&&bounds.left>=0;}));
 await page.emulateMedia({reducedMotion:'reduce'});
 await card.getByRole('button',{name:'Hide animation',exact:true}).click();
 await card.getByRole('button',{name:'Watch with animation',exact:true}).click();
 await audio.evaluate(element=>(element as HTMLAudioElement).pause());await seek(first.start-.1);
 assert.equal(await card.getByRole('figure').locator(`[data-caption-id="${middle}"]`).count(),0,'Reduced motion does not show early captions');
 await seek(first.start+.01);
 assert.equal(await card.getByRole('figure').locator(`[data-caption-id="${middle}"] .prayer-animation-word`).first().evaluate(element=>getComputedStyle(element).clipPath),'inset(0px 0% 0px 0px)');
 for(const title of ['God’s Jewels','Prayer, the Cure for Care','The Excellency of Christ']){
  await table.getByRole('button',{name:`Watch animation for ${title}`,exact:true}).click();
  const existing=page.getByRole('article').filter({has:page.getByRole('heading',{name:title,exact:true})});
  await existing.getByRole('figure').waitFor();await existing.getByRole('button',{name:'Hide animation',exact:true}).click();
 }
 assert.deepEqual(errors,[]);
 writeFileSync('/tmp/bruised-reed-browser-checks.json',JSON.stringify({scenes:scenes.length,hold:4,samples:checks,errors,checks:['table/card launch','book-wide seek','exact partial word reveal','pause','all-caption hold','transcript follow','1.5x','mobile','reduced motion','existing animations']},null,2)+'\n');
 console.log(`Bruised Reed: ${scenes.length} caption holds, media-clock integration, screenshots and regression checks passed.`);
}finally{await browser.close();}
