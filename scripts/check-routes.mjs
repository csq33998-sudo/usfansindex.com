import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const metadata=JSON.parse(readFileSync('src/data/catalog-meta.json','utf8'));
const pageSize=48;
const expected=new Map([['/',null],['/how-it-works/',null],['/trust/',null],['/faq/',null]]);
for(const c of [{slug:'',count:metadata.unique},...metadata.categories.filter(c=>c.count>0)]){
 const base=c.slug?'/categories/'+c.slug+'/':'/database/';
 for(let page=1;page<=Math.ceil(c.count/pageSize);page++)expected.set(base+(page>1?'page/'+page+'/':''),{count:Math.min(pageSize,c.count-(page-1)*pageSize),category:c.slug});
}
const sitemap=readFileSync('dist/sitemap-0.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(urls.length,expected.size,'Sitemap must include every content, category and pagination page');
assert.equal(new Set(urls).size,urls.length,'Unique sitemap URLs');
const fileFor=pathname=>join('dist',pathname==='/'?'index.html':pathname.endsWith('.html')?pathname:pathname+'/index.html');
let allItems=0,categoryItems=0;
const allIds=new Set(),categoryIds=new Set();
for(const value of urls){
 const url=new URL(value),spec=expected.get(url.pathname);assert.ok(expected.has(url.pathname),'Unexpected sitemap URL');
 assert.equal(url.hash,'');const html=readFileSync(fileFor(url.pathname),'utf8');
 assert.ok(html.includes('rel="canonical" href="'+value+'"'),'Self canonical: '+value);
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1,'One H1: '+value);
 assert.equal((html.match(/data-language=/g)||[]).length,27,'Language selector on every page');
 assert.ok(html.includes('id="categories-panel"'),'Category menu on every page');
 for(const [,href]of html.matchAll(/href="([^"]+)"/g)){
  const target=new URL(href,value);if(target.origin!==url.origin)continue;
  assert.equal(target.hash,'','Internal URL must not include a fragment: '+href);
  if(!/\.[a-z]+$/i.test(target.pathname))assert.ok(existsSync(fileFor(target.pathname)),'Internal link resolves: '+href);
 }
 if(spec){const ids=[...html.matchAll(/data-product-id="([^"]+)"/g)].map(m=>m[1]);const count=ids.length;assert.equal(count,spec.count,'Server-rendered product coverage: '+value);if(spec.category){categoryItems+=count;ids.forEach(id=>categoryIds.add(id));}else{allItems+=count;ids.forEach(id=>allIds.add(id));}}
}
assert.equal(allItems,metadata.unique);assert.equal(categoryItems,metadata.unique,'Every product is represented in category HTML');
assert.equal(allIds.size,metadata.unique,'No repeated or missing items across all-product pages');
assert.equal(categoryIds.size,metadata.unique,'No repeated or missing items across category pages');
for(const p of JSON.parse(readFileSync('src/data/catalog.json','utf8')))assert.ok(allIds.has(p.id)&&categoryIds.has(p.id),'Imported product appears in both browsing routes: '+p.id);
for(const r of JSON.parse(readFileSync('vercel.json','utf8')).redirects){assert.ok(!r.destination.includes('#'));assert.ok(existsSync(fileFor(r.destination)),'Redirect target exists');assert.notEqual(r.source.replace(/\/$/,''),r.destination.replace(/\/$/,''),'No redirect loops');}
console.log('PASS: '+urls.length+' canonical pages; '+allItems+' products in all-products and category HTML; clean internal URLs and valid redirects.');
