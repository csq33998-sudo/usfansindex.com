// Reads the public catalog through external Chrome, using the same endpoint
// observed when scrolling the source storefront. Keeps resumable page snapshots.
import {mkdirSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import {browser} from './source-browser.mjs';
const dir='output/full-catalog';mkdirSync(dir,{recursive:true});
const endpoint='/api/products/search?hasQc=false&sort=recommended&shopId=a64ab45b-4d38-44d5-aecc-c6d00b1a1193&limit=100&skipFacets=true';
function collect(pages){return browser(`async page => await page.evaluate(async ({pages,endpoint})=>await (async()=>{const results=[];for(const n of pages){await new Promise(r=>setTimeout(r,3000));for(let attempt=0;attempt<4;attempt++){try{const r=await fetch(endpoint+'&page='+n);if(!r.ok)throw Error('HTTP '+r.status);const d=await r.json();if(!Array.isArray(d.items))throw Error('Missing items');results.push(d);break;}catch(e){if(attempt===3)throw e;await new Promise(r=>setTimeout(r,60000));}}}return results;})(),${JSON.stringify({pages,endpoint})})`);}
if(!existsSync(dir+'/1.json'))writeFileSync(dir+'/1.json',JSON.stringify(collect([1])[0]));
const first=JSON.parse(readFileSync(dir+'/1.json','utf8'));
for(let start=2;start<=first.totalPages;start+=4){
 const pages=Array.from({length:Math.min(4,first.totalPages-start+1)},(_,i)=>start+i).filter(n=>!existsSync(dir+'/'+n+'.json'));
 if(!pages.length)continue;
 const results=collect(pages);
 for(let i=0;i<pages.length;i++)writeFileSync(dir+'/'+pages[i]+'.json',JSON.stringify(results[i]));
 console.log('Saved pages '+pages.join(',')+' / '+first.totalPages);
}
const unique=new Map();let raw=0;
for(let n=1;n<=first.totalPages;n++){const d=JSON.parse(readFileSync(dir+'/'+n+'.json','utf8'));raw+=d.items.length;for(const item of d.items)unique.set(item.id,item);}
writeFileSync(dir+'/catalog.json',JSON.stringify([...unique.values()]));
const report={collectedAt:new Date().toISOString(),source:'https://streetstyle.maisonlooks.com/',expected:first.total,raw,unique:unique.size,pages:first.totalPages,categories:{}};
for(const item of unique.values()){const c=item.primaryCategory?.slug||'uncategorized';report.categories[c]=(report.categories[c]||0)+1;}
writeFileSync(dir+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
if(unique.size!==first.total)throw Error('Catalog count mismatch; reconcile before importing');
