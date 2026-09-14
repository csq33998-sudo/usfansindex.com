// Run with PLAYWRIGHT_CLI_PATH pointing to an installed @playwright/cli entry.
// Reads public pages through the existing external browser session.
// Writes a reviewable snapshot only; never publishes or invents missing fields.
// By default resumes the checkpoint; pass --fresh to start a new snapshot.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
const cli = process.env.PLAYWRIGHT_CLI_PATH;
if (!cli) throw new Error('Set PLAYWRIGHT_CLI_PATH to the installed playwright-cli.js');
const session = process.env.SOURCE_BROWSER_SESSION || 'usfans-source';
mkdirSync('output/source-refresh', { recursive: true });
function run(command, ...args) {
  const r = spawnSync(process.execPath, [cli, '-s='+session, command, ...args], {encoding:'utf8',maxBuffer:8*1024*1024,timeout:90000,windowsHide:true});
  if(r.error || r.status !== 0 || /### Error/.test(r.stdout)) throw Error(r.error?.message || r.stdout + r.stderr);
  return r.stdout;
}
function execute(code) {
  const out = run('run-code', code);
  const match = out.match(/### Result\r?\n([\s\S]*?)(?=\r?\n### |$)/);
  if(!match) throw Error('No structured result: '+out);
  return JSON.parse(match[1]);
}
const groups = [
 ['Sneakers','sneakers'],['Hoodies','hoodies-sweatshirts'],['T-Shirts','t-shirts'],
 ['Jackets','jackets'],['Accessories','eyewear'],['Bags','bags-backpacks'],
 ['Pants','trousers-pants'],['Watches','jewelry-watches'],['Shorts','shorts'],['Knitwear','sweaters-knits']
];
const output='output/source-refresh/products.json';
const records = !process.argv.includes('--fresh') && existsSync(output) ? JSON.parse(readFileSync(output,'utf8')) : [];
for(const [category,slug] of groups){
 if(records.filter(r=>r.category===category).length>=8)continue;
 const url='https://streetstyle.maisonlooks.com/en/c/'+slug;
 writeFileSync('output/source-refresh/'+slug+'-navigation.txt',run('goto',url));
 const listing=execute(`async page => {await page.locator('h3').first().waitFor();return await page.evaluate(()=>[...document.querySelectorAll('h3')].map(h=>{const a=h.closest('a'),p=h.parentElement.parentElement.querySelector('p');return {name:h.textContent,sourceUrl:a?.href,priceCny:Number(p?.textContent.replace(/[^0-9.]/g,''))};}).filter(p=>p.sourceUrl?.includes('/en/p/')&&p.priceCny>0));}`);
 writeFileSync('output/source-refresh/'+slug+'-list.json',JSON.stringify(listing,null,2));
 console.log(category+': '+listing.length+' source candidates');
 const candidates=listing.filter(candidate=>!records.some(r=>r.sourceUrl===candidate.sourceUrl))
  .filter(candidate=>category!=='Watches'||/watch|chronograph|day-date|gmt|submariner|nautilus|royal oak|speedmaster|santos/i.test(candidate.name))
  .filter(candidate=>category!=='Shorts'||/shorts/i.test(candidate.name))
  .filter(candidate=>category!=='Knitwear'||/sweater|knit|cardigan|pullover/i.test(candidate.name))
  .filter(candidate=>category!=='Bags'||/bag|backpack|tote|satchel/i.test(candidate.name));
 for(let offset=0;offset<candidates.length;offset+=2){
  if(records.filter(r=>r.category===category).length>=8)break;
  const batch=candidates.slice(offset,offset+2);
  const details=execute(`async root => {return await Promise.all(${JSON.stringify(batch)}.map(async candidate=>{
   const page=await root.context().newPage();
   try{
    // Capture this tab's own Copy Link action without sharing the OS clipboard.
    await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__sourceCopied=String(text);}}});});
    await page.goto(candidate.sourceUrl);
    const qcButton=page.getByRole('button',{name:/^\\d+ QC photos?$/});
    try{await qcButton.waitFor({timeout:12000});}catch{}
    const linkButton=page.getByRole('button',{name:'Link',exact:true});
    await linkButton.waitFor({timeout:10000});
    let w2cUrl=await linkButton.getAttribute('title');
    if(!/^https?:/.test(w2cUrl)){await linkButton.click({timeout:8000});w2cUrl=await page.evaluate(()=>window.__sourceCopied);}
    const name=await page.getByRole('heading',{level:1}).innerText();
    const imageUrl=await page.evaluate(()=>document.images[0]?.currentSrc);
    let qcPhotos=[];
    if(await qcButton.count()){try{await qcButton.click({timeout:8000});await page.getByRole('img',{name:'QC photo',exact:true}).first().waitFor({timeout:8000});}catch{}qcPhotos=await page.evaluate(()=>[...new Set([...document.images].filter(i=>i.alt==='QC photo').map(i=>i.currentSrc||i.src).filter(Boolean))]);}
    return {name,imageUrl,w2cUrl,qcPhotos};
   }catch(error){return {error:error.message};}finally{await page.close();}
  }));}`);
  for(let i=0;i<batch.length;i++){
   if(records.filter(r=>r.category===category).length>=8)break;
   const candidate=batch[i],detail=details[i];
   try{
   if(detail.error)throw Error(detail.error);
   if(!/^https:\/\/(weidian\.com|item\.taobao\.com|detail\.1688\.com)\//.test(detail.w2cUrl))throw Error('Missing original purchase URL');
   if(!detail.qcPhotos.length)throw Error('No source QC photos');
   // Watches may be distinct models in one multi-variant merchant listing.
   if(category!=='Watches'&&records.some(r=>r.w2cUrl===detail.w2cUrl))throw Error('Duplicate purchase listing');
   records.push({...candidate,...detail,category,id:candidate.sourceUrl.split('-').pop(),batch:null,qcUrl:detail.qcPhotos[0],sourceCategoryUrl:url,checkedAt:new Date().toISOString()});
   writeFileSync(output,JSON.stringify(records,null,2)+'\n');
   console.log('Saved '+records.length+'/80 · '+category+' '+records.filter(r=>r.category===category).length+'/8 · '+detail.name);
  }catch(error){console.log('Skipped '+candidate.name+': '+error.message.slice(0,200));}
  }
 }
 console.log('Category complete: '+category+' = '+records.filter(r=>r.category===category).length);
}
console.log(JSON.stringify(Object.fromEntries(groups.map(([name])=>[name,records.filter(r=>r.category===name).length]))));
