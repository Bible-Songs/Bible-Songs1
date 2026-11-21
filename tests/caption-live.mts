import {readFile} from 'node:fs/promises';
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
 const page=await context.newPage();
 const media=await readFile('../GitHub History/Release Assets/2026-11-17_audio-1.0.124/assets/prayer-the-cure-for-care-spurgeon.m4a');
 await page.route('**/prayer-the-cure-for-care-spurgeon.m4a?*',async route=>{
  const match=route.request().headers()['range']?.match(/^bytes=(\d+)-(\d*)$/);
  const from=match?Number(match[1]):0,to=match?.[2]?Math.min(Number(match[2]),media.length-1):media.length-1;
  if(from<0||to<from||from>=media.length)throw new Error('Invalid media range');
  const headers:Record<string,string>={'content-type':'audio/mp4','accept-ranges':'bytes','access-control-allow-origin':'*'};
  if(match)headers['content-range']=`bytes ${from}-${to}/${media.length}`;
  await route.fulfill({status:match?206:200,headers,body:media.subarray(from,to+1)});
 });
 await page.route('https://rzvfeeatzksvgxucbzbo.supabase.co/**',async route=>{
  if(route.request().method()==='PUT'){
   const body:unknown=route.request().postDataJSON();
   assert(body&&typeof body==='object'&&'data' in body);
  }
  await route.fulfill({json:user});
 });
 await page.goto('http://127.0.0.1:5190/Bible-Songs1/');

 await page.locator('.app-header').getByText(/Auto-synced at/).waitFor();
 await page.getByRole('button',{name:'Listening Library',exact:true}).click();
 const card=page.getByRole('article').filter({hasText:'Prayer, the Cure for Care'});
 await card.getByRole('button',{name:'Watch with animation'}).click();
 const audio=page.locator('.document-library audio');
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('audio')).some(a=>a.readyState>=2&&!a.paused));
 await page.locator('.document-library .transport').getByRole('combobox',{name:'Playback speed'}).selectOption('1.5');
 await audio.evaluate(a=>{if(a instanceof HTMLAudioElement)a.currentTime=279.8;});
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('.document-library audio')).some(a=>a instanceof HTMLAudioElement&&!a.seeking&&a.currentTime>282.5));
 const outgoing=page.locator('.sermon-caption-outgoing');
 assert.equal(await outgoing.getAttribute('aria-label'),'Turn into a prayer everything that is a care.');
 assert.equal(await outgoing.evaluate(el=>getComputedStyle(el).opacity),'1');
 await audio.evaluate(a=>{if(a instanceof HTMLAudioElement)a.pause();});
 const opacity=await outgoing.evaluate(el=>getComputedStyle(el).opacity);
 await page.waitForTimeout(250);assert.equal(await outgoing.evaluate(el=>getComputedStyle(el).opacity),opacity);
 await audio.evaluate(async a=>{if(a instanceof HTMLAudioElement)await a.play();});
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('.document-library audio')).some(a=>a instanceof HTMLAudioElement&&a.currentTime>284));
 assert.equal(await page.locator('.sermon-caption-outgoing').count(),0);
 await audio.evaluate(a=>{if(a instanceof HTMLAudioElement){a.pause();a.currentTime=277;}});
 await page.waitForFunction(()=>document.querySelector('.sermon-caption-current')?.getAttribute('aria-label')?.startsWith('Turn into a prayer'));
 await audio.evaluate(a=>{if(a instanceof HTMLAudioElement)a.currentTime=a.duration;});
 await page.waitForFunction(()=>document.querySelector('.sermon-caption-current')?.getAttribute('aria-label')?.includes('Amen.'));
 assert(await page.locator('.sermon-caption-current .prayer-animation-word').evaluateAll(words=>words.every(word=>word instanceof HTMLElement&&word.style.clipPath.includes('0%'))));
 console.log('Real audio at 1.5x, completed-caption hold, pause/resume, backward seek and final retained caption passed.');
}finally{await browser.close();}
