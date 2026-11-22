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
 await page.route('https://rzvfeeatzksvgxucbzbo.supabase.co/**',async route=>{
  if(route.request().method()==='PUT'){
   const body:unknown=route.request().postDataJSON();
   assert(body&&typeof body==='object'&&'data' in body);
  }
  await route.fulfill({json:user});
 });
 await page.goto(process.env['BIBLE_TEST_URL']??'http://127.0.0.1:5190/Bible-Songs1/');
 const header=page.locator('.app-header');
 await header.getByText(/Auto-synced at/).waitFor();
 await header.getByRole('button',{name:'Sync now'}).click();
 await header.getByText(/^Synced at/).waitFor();
 await header.getByText('Account',{exact:true}).click();
 await header.getByText(user.email,{exact:true}).waitFor();
 const menu=header.locator('.header-account');
 await menu.getByRole('button',{name:'Dark',exact:true}).click();
 assert.equal(await page.locator('.shell').getAttribute('data-theme'),'dark');
 await menu.getByRole('button',{name:'Light',exact:true}).click();
 assert.equal(await page.locator('.shell').getAttribute('data-theme'),'light');
 await menu.getByRole('button',{name:'Mobile',exact:true}).click();
 assert.equal(await page.locator('.sidebar').evaluate(sidebar=>getComputedStyle(sidebar).position),'static');
 await menu.getByRole('button',{name:'Desktop',exact:true}).click();
 assert.equal(await page.locator('.sidebar').evaluate(sidebar=>getComputedStyle(sidebar).position),'fixed');
 await menu.getByRole('button',{name:'Troubleshoot Sync',exact:true}).click();
 await page.getByRole('button',{name:'Check cloud backup',exact:true}).click();
 await page.getByText(/Cloud backup is reachable/).waitFor();
 await page.getByRole('columnheader',{name:'Cloud backup'}).waitFor();
 const [cloud]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download cloud backup'}).click()]);
 assert.equal(cloud.suggestedFilename(),'bible-songs-cloud-backup.json');

 await page.getByLabel('Restore cloud from comparison file').setInputFiles({
  name:'comparison.json',mimeType:'application/json',buffer:Buffer.from('{"unrelated":true}'),
 });
 await page.getByText('Choose a valid Bible Songs backup file.',{exact:true}).waitFor();
 page.once('dialog',dialog=>void dialog.accept());
 await page.getByRole('button',{name:'Overwrite cloud with this device'}).click();
 await page.getByText('Cloud backup replaced.',{exact:true}).waitFor();
 page.once('dialog',dialog=>void dialog.accept());
 await page.getByLabel('Restore cloud from comparison file').setInputFiles({
  name:'comparison.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({cloud:{favorite:false,speed:1,hiddenReadings:[]}})),
 });
 await page.getByText('Cloud backup replaced.',{exact:true}).waitFor();
 await page.getByRole('button',{name:'About',exact:true}).click();
 await page.getByRole('heading',{name:'About',exact:true}).waitFor();
 await page.getByText('Storage',{exact:true}).click();
 await page.getByText(/Theme, layout, last Bible voice/).waitFor();
 await page.getByText(/Problems recorded on this device/).click();
 await page.getByText('No sync problems recorded.',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Sync & backups',exact:true}).click();
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download backup'}).click()]);
 assert.equal(download.suggestedFilename(),'bible-songs-backup.json');
 await page.getByRole('button',{name:'Recovery centre'}).click();
 page.once('dialog',dialog=>void dialog.accept());
 await page.getByLabel('Import backup').setInputFiles({
  name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({favorite:true,speed:1.5})),
 });
 await page.getByText('Preferences restored.',{exact:true}).waitFor();
 const recover=page.getByRole('button',{name:/Restore copy from/}).first();
 await recover.waitFor();
 page.once('dialog',dialog=>void dialog.accept());
 await recover.click();
 await page.getByRole('cell',{name:'1.5×',exact:true}).waitFor();
 page.once('dialog',dialog=>void dialog.accept());
 await page.getByRole('row').filter({hasText:'1.5×'}).getByRole('button',{name:/Restore copy from/}).first().click();

 await page.getByRole('button',{name:'Listening Library',exact:true}).click();
 await header.getByRole('button',{name:'Search',exact:true}).click();
 assert(await page.getByRole('searchbox',{name:'Title'}).evaluate(input=>input===document.activeElement));
 const table=page.getByRole('table',{name:'Published readings — quick actions'});
 const titles=await table.locator('tbody th').allTextContents();
 assert.equal(titles.length,12);
 assert.deepEqual(titles,[...titles].sort((a,b)=>a.localeCompare(b)));
 await page.getByLabel('Sort by').selectOption('Author');
 const authors=await table.locator('tbody tr td:nth-child(3)').allTextContents();
 assert.deepEqual(authors,[...authors].sort((a,b)=>a.localeCompare(b)));
 await page.getByLabel('Sort by').selectOption('Title');
 await page.getByRole('searchbox',{name:'Title'}).fill('Jewels');
 assert.equal(await table.locator('tbody tr').count(),1);
 await table.getByRole('button',{name:'God’s Jewels',exact:true}).click();
 assert(await page.locator('.library-reading-target').evaluate(element=>element===document.activeElement));
 await page.getByRole('searchbox',{name:'Title'}).fill('');
 await page.setViewportSize({width:390,height:844});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 await page.screenshot({path:'/tmp/bible-library-table-mobile.png',fullPage:false});
 await page.setViewportSize({width:1440,height:1000});
 await table.scrollIntoViewIfNeeded();
 await page.screenshot({path:'/tmp/bible-library-table-desktop.png'});
 await table.getByRole('button',{name:'Watch animation for God’s Jewels',exact:true}).click();
 await page.getByRole('button',{name:'Hide animation',exact:true}).click();
 await table.getByRole('button',{name:'Pause audio for God’s Jewels',exact:true}).click();
 const pdf=table.getByRole('link',{name:'Download PDF for God’s Jewels',exact:true});
 assert.match(await pdf.getAttribute('href')??'',/gods-jewels-spurgeon\.pdf/);
 const [tableDownload]=await Promise.all([page.waitForEvent('download'),pdf.click()]);
 assert.equal(tableDownload.suggestedFilename(),'gods-jewels-spurgeon.pdf');
 assert.equal(await tableDownload.failure(),null);
 assert.match(await table.getByRole('link',{name:'Download MP3 for God’s Jewels',exact:true}).getAttribute('href')??'',/gods-jewels-spurgeon\.mp3/);
 const name='God’s Jewels';
 const card=page.getByRole('article').filter({hasText:name});
 await card.getByRole('button',{name:'Play '+name,exact:true}).click();
 await card.getByRole('button',{name:'Pause '+name,exact:true}).click();
 await card.getByRole('button',{name:'Play '+name,exact:true}).waitFor();
 const ranges=page.locator('.sidebar-reading-ranges');
 await ranges.getByText('Romans 1–16',{exact:true}).waitFor();
 assert(await ranges.evaluate(box=>{
  const sidebar=box.closest('aside');
  return sidebar!==null&&box.getBoundingClientRect().right<=sidebar.getBoundingClientRect().right
   &&Array.from(box.querySelectorAll('span')).every(line=>line.scrollWidth<=line.clientWidth+1);
 }));
 await card.getByRole('button',{name:'Play '+name,exact:true}).click();
 await card.getByRole('button',{name:'Pause '+name,exact:true}).waitFor();
 page.once('dialog',dialog=>void dialog.accept());
 await table.getByRole('button',{name:'Remove '+name+' from table',exact:true}).click();
 assert.equal(await table.locator('tbody tr').count(),11);
 await card.waitFor({state:'detached'});
 await page.getByRole('button',{name:'Recovery centre'}).click();
 await page.getByRole('button',{name:'Restore '+name,exact:true}).click();
 await page.getByRole('button',{name:'Listening Library',exact:true}).click();
 await card.waitFor();
 const excellency=page.getByRole('article').filter({hasText:'The Excellency of Christ'});
 const passage=excellency.getByLabel('The Excellency of Christ transcript').getByRole('button').nth(350);
 await passage.click();
 const libraryAudio=page.locator('.document-library audio');
 await page.waitForFunction(()=>Array.from(document.querySelectorAll<HTMLAudioElement>('.document-library audio')).some(
  audio=>!audio.paused&&!audio.seeking&&audio.currentTime>4000&&audio.playbackRate===1.5,
 ));
 assert.match(await libraryAudio.evaluate(audio=>(audio as HTMLAudioElement).currentSrc),/github\.com.*excellency-of-christ-edwards\.m4a/);
 assert.equal(await passage.getAttribute('aria-current'),'true');
 const [sermonDownload]=await Promise.all([page.waitForEvent('download'),excellency.getByRole('link',{name:/Download MP3/}).click()]);
 assert.equal(sermonDownload.suggestedFilename(),'excellency-of-christ-edwards.mp3');
 assert.equal(await sermonDownload.failure(),null);
 assert.match(await excellency.getByRole('link',{name:/Download PDF/}).getAttribute('href')??'',/^\/Bible-Songs1\/library\//);
 await page.getByRole('button',{name:'Bible',exact:true}).click();
 assert.equal(await page.getByRole('combobox',{name:'Playback speed'}).inputValue(),'1.5');
 await page.getByRole('button',{name:'Play audio',exact:true}).click();
 await page.getByRole('button',{name:'Pause audio',exact:true}).click();
 const chapter=page.locator('.chapter-picker select');
 await chapter.selectOption({label:'Luke 1'});
 await page.locator('.scripture-text .text-cue').nth(60).click();
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('audio')).some(
  audio=>audio.currentSrc.includes('readings--luke-1--')&&!audio.paused&&!audio.seeking
   &&audio.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&Number.isFinite(audio.duration)&&audio.currentTime>60,
 ));
 await page.getByRole('button',{name:'Continuous reading'}).click();
 await page.locator('audio').evaluate(audio=>{
  if(!(audio instanceof HTMLAudioElement)||!Number.isFinite(audio.duration)||audio.duration<=4)
   throw new Error('Luke 1 must have loaded audio and a valid duration before seeking to its end.');
  audio.currentTime=audio.duration-4;
 });
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('audio')).some(
  audio=>audio.currentSrc.includes('readings--luke-2--')&&!audio.paused&&!audio.seeking
   &&audio.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA&&Number.isFinite(audio.duration)&&audio.currentTime>0,
 ));
 await chapter.selectOption({label:'Romans 1'});
 await page.locator('.scripture-text .text-cue').nth(20).click();
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('audio')).some(
  audio=>audio.currentSrc.includes('readings--romans-1--')&&!audio.paused&&!audio.seeking&&audio.currentTime>30,
 ));
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 console.log('Account, recovery, sermon seeking and download, Bible seeking and continuous chapter playback passed.');
}finally{await browser.close();}
