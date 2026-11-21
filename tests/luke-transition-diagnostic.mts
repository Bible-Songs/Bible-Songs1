import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const user={
 id:'00000000-0000-4000-8000-000000000009',
 aud:'authenticated',role:'authenticated',email:'fixture@example.invalid',
 app_metadata:{},user_metadata:{bible_songs_preferences:{favorite:false,speed:1}},
};
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,chromiumSandbox:true,args:['--autoplay-policy=no-user-gesture-required']});
try{
 const context=await browser.newContext();
 await context.addInitScript(account=>{
  const exp=Math.floor(Date.now()/1000)+3600;
  const encode=(value:object)=>btoa(JSON.stringify(value)).replaceAll('=','');
  sessionStorage.setItem('sb-rzvfeeatzksvgxucbzbo-auth-token',JSON.stringify({
   access_token:encode({alg:'HS256'})+'.'+encode({sub:account.id,exp})+'.fixture',
   refresh_token:'fixture',expires_at:exp,user:account,
  }));
 },user);
 await context.addInitScript(()=>{
  const events=['loadedmetadata','durationchange','seeking','seeked','playing','pause','ended','error','waiting','stalled','emptied'];
  for(const name of events)document.addEventListener(name,event=>{
   const a=event.target;
   if(a instanceof HTMLAudioElement&&a.currentSrc.includes('readings--luke-'))console.log('LUKE_TRACE',JSON.stringify({event:name,time:a.currentTime,duration:a.duration,paused:a.paused,ended:a.ended,seeking:a.seeking,ready:a.readyState,network:a.networkState,rate:a.playbackRate,src:a.currentSrc,error:a.error?.message}));
  },true);
 });
 const page=await context.newPage();
 page.on('console',message=>{if(message.text().startsWith('LUKE_TRACE'))console.log(message.text());});
 await page.route('https://rzvfeeatzksvgxucbzbo.supabase.co/**',async route=>{
  if(route.request().method()==='PUT'){
   const body:unknown=route.request().postDataJSON();
   assert(body&&typeof body==='object'&&'data' in body);
  }
  await route.fulfill({json:user});
 });
 await page.goto('http://127.0.0.1:5190/Bible-Songs1/');
 await page.locator('.app-header').getByText(/Auto-synced at/).waitFor();
 await page.getByRole('combobox',{name:'Playback speed'}).selectOption('1.5');
 const chapter=page.locator('.chapter-picker select');
 let failures=0;
 for(const offset of [4,4,4,4,12,12]){
  const continuous=page.getByRole('button',{name:'Continuous reading',exact:true});
  if(await continuous.getAttribute('aria-pressed')==='true')await continuous.click();
  await chapter.selectOption({label:'Luke 1'});
  await page.locator('.scripture-text .text-cue').nth(60).click();
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('audio')).some(a=>a.currentSrc.includes('readings--luke-1--')&&!a.paused&&!a.seeking&&a.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&Number.isFinite(a.duration)&&a.currentTime>60));
  await continuous.click();
  console.log('ATTEMPT',offset);
  await page.locator('audio').evaluate((a,remaining)=>{if(!(a instanceof HTMLAudioElement)||!Number.isFinite(a.duration))throw new Error('Missing Luke metadata');a.currentTime=a.duration-remaining;},offset);
  try{
   await page.waitForFunction(()=>Array.from(document.querySelectorAll('audio')).some(a=>a.currentSrc.includes('readings--luke-2--')&&!a.paused&&!a.seeking&&a.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&a.currentTime>0),undefined,{timeout:30000});
   console.log('PASS',offset);
  }catch(error){
   failures++;
   console.log('FAIL',offset,String(error));
   console.log('STATE',JSON.stringify(await page.locator('audio').evaluateAll(nodes=>nodes.map(a=>a instanceof HTMLAudioElement?{src:a.currentSrc,t:a.currentTime,d:a.duration,paused:a.paused,ended:a.ended,seeking:a.seeking,ready:a.readyState,rate:a.playbackRate,error:a.error?.message,seekable:Array.from({length:a.seekable.length},(_,i)=>[a.seekable.start(i),a.seekable.end(i)])}:null))));
  }
 }
 assert.equal(failures,0,'Every real Luke chapter transition must complete');
}finally{await browser.close();}
