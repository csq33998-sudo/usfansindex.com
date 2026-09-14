import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {categoryDefinitions} from '../src/data/taxonomy.mjs';
const products=JSON.parse(readFileSync('src/data/catalog.json','utf8'));
const meta=JSON.parse(readFileSync('src/data/catalog-meta.json','utf8'));
assert.equal(meta.complete,true,'A partial preview must never be published');
assert.equal(products.length,meta.expected,'Imported catalog must match the full source total');
assert.equal(products.length,meta.unique,'Unique source count must match imported products');
for(const field of ['id','sourceUrl'])assert.equal(new Set(products.map(p=>p[field])).size,products.length,'Duplicate '+field);
const slugs=new Set(categoryDefinitions.map(c=>c.slug));
assert.equal(meta.categories.reduce((sum,c)=>sum+c.count,0),products.length,'Every product belongs to one category');
for(const c of meta.categories)assert.equal(c.count,products.filter(p=>p.category===c.slug).length,'Category count: '+c.slug);
for(const p of products){
 assert.ok(p.name?.trim(),'Missing product name: '+p.id);
 assert.ok(slugs.has(p.category),'Unrecognized category: '+p.id);
 assert.equal(new URL(p.sourceUrl).hostname,'streetstyle.maisonlooks.com');
 assert.equal(new URL(p.sourceUrl).hash,'');
 assert.ok(p.priceCny==null||Number.isFinite(p.priceCny),'Invalid price: '+p.id);
 if(p.w2cUrl)assert.ok(['weidian.com','item.taobao.com','detail.1688.com'].includes(new URL(p.w2cUrl).hostname),'Invalid purchase URL: '+p.id);
 for(const url of [p.imageUrl,...p.qcPhotos].filter(Boolean)){assert.equal(new URL(url).protocol,'https:');assert.ok(['cdn.maisonlooks.com','si.geilicdn.com'].includes(new URL(url).hostname),'Unknown source image host: '+p.id);}
 assert.equal(new Set(p.qcPhotos).size,p.qcPhotos.length,'Duplicate QC references: '+p.id);
 assert.ok(p.qcPhotos.every(url=>url.includes('/source-qc/')),'Product images must not be labeled QC');
}
for(const c of [{slug:'all',count:products.length},...meta.categories]){
 const data=JSON.parse(readFileSync('public/catalog/'+c.slug+'.json','utf8'));
 assert.equal(data.length,c.count,'Search index matches rendered catalog: '+c.slug);
 if(c.slug!=='all')assert.ok(data.every(p=>p.category===c.slug),'Search category must be isolated');
}
console.log('PASS: '+products.length+' unique products; full source total, category coverage, image URLs and search indexes verified.');
