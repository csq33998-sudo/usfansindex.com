import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const products = JSON.parse(readFileSync(new URL('../src/data/source-details.json', import.meta.url), 'utf8'));
const categories = ['Sneakers','Hoodies','T-Shirts','Jackets','Accessories','Bags','Pants','Watches','Shorts','Knitwear'];
assert.equal(products.length,80,'The catalog must contain 80 items');
for(const category of categories)assert.equal(products.filter(p=>p.category===category).length,8,category+' must contain eight items');
for(const field of ['id','sourceUrl','name'])assert.equal(new Set(products.map(p=>p[field])).size,80,'Duplicate '+field);
for(const p of products){
 assert.ok(p.name?.trim() && Number.isFinite(p.priceCny) && p.priceCny>0,'Missing name or price: '+p.id);
 assert.equal(new URL(p.sourceUrl).hostname,'streetstyle.maisonlooks.com');
 assert.ok(['weidian.com','item.taobao.com','detail.1688.com'].includes(new URL(p.w2cUrl).hostname),'Invalid purchase link: '+p.id);
 assert.ok(p.qcPhotos.length>0,'Missing QC references: '+p.id);
 assert.equal(new Set(p.qcPhotos).size,p.qcPhotos.length,'Duplicate QC images: '+p.id);
 for(const url of [p.imageUrl,...p.qcPhotos]){assert.equal(new URL(url).protocol,'https:');assert.equal(new URL(url).hostname,'cdn.maisonlooks.com');}
 assert.ok(p.qcPhotos.every(url=>url.includes('/source-qc/')),'Product images cannot be labeled QC');
}
console.log('PASS: 10 categories × 8 distinct source items; prices, source links, W2C links and QC references present.');
