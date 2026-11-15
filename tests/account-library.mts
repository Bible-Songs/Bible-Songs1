import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const user={
 id:'00000000-0000-4000-8000-000000000009',
 aud:'authenticated',role:'authenticated',email:'fixture@example.invalid',
 app_metadata:{},user_metadata:{bible_songs_preferences:{favorite:false,speed:1}},
};
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
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
 await page.goto('http://127.0.0.1:5190/Bible-Songs1/');
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
 await card.getByRole('button',{name:'Remove '+name+' from my library',exact:true}).click();
 await card.waitFor({state:'detached'});
 await page.getByRole('button',{name:'Recovery centre'}).click();
 await page.getByRole('button',{name:'Restore '+name,exact:true}).click();
 await page.getByRole('button',{name:'Listening Library',exact:true}).click();
 await card.waitFor();
 await page.getByRole('button',{name:'Bible',exact:true}).click();
 assert.equal(await page.getByRole('combobox',{name:'Playback speed'}).inputValue(),'1.5');
 await page.getByRole('button',{name:'Play audio',exact:true}).click();
 await page.getByRole('button',{name:'Pause audio',exact:true}).click();
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
 console.log('Account theme and layout, cloud comparison, recovery copies, About, and playback passed.');
}finally{await browser.close();}
