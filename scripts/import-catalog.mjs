import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {categoryDefinitions,categoryFor} from '../src/data/taxonomy.mjs';
const preview=process.argv.includes('--preview');
const source=preview ? [...new Map(readdirSync('output/full-catalog').filter(n=>/^\d+\.json$/.test(n)).sort((a,b)=>parseInt(a)-parseInt(b)).flatMap(n=>JSON.parse(readFileSync('output/full-catalog/'+n,'utf8')).items).map(p=>[p.id,p])).values()] : JSON.parse(readFileSync('output/full-catalog/catalog.json','utf8'));
const report=preview ? {collectedAt:new Date().toISOString(),expected:JSON.parse(readFileSync('output/full-catalog/1.json','utf8')).total,unique:source.length,complete:false} : {...JSON.parse(readFileSync('output/full-catalog/report.json','utf8')),complete:true};
if(!preview&&(source.length!==report.expected||new Set(source.map(p=>p.id)).size!==source.length))throw Error('Incomplete or duplicate source snapshot');
const previous=JSON.parse(readFileSync('src/data/source-details.json','utf8'));
const old=new Map(previous.map(p=>[p.sourceUrl,p]));
const products=source.map(item=>{
 const sourceUrl='https://streetstyle.maisonlooks.com/en/p/'+item.slug;
 const verified=old.get(sourceUrl);
 return {id:item.id,name:item.title,slug:item.slug,category:categoryFor(item),sourceCategory:item.primaryCategory?.name||'Not categorized',sourceCategorySlug:item.primaryCategory?.slug||'',brand:item.brand?.canonicalName||'',priceCny:item.price,imageUrl:item.imageUrl||null,sourceUrl,w2cUrl:verified?.w2cUrl||null,qcPhotos:verified?.qcPhotos||[],hasSourceQc:!!item.hasQcPhotos};
});
const categories=categoryDefinitions.map(c=>({...c,count:products.filter(p=>p.category===c.slug).length}));
mkdirSync('public/catalog',{recursive:true});
writeFileSync('src/data/catalog.json',JSON.stringify(products));
writeFileSync('src/data/catalog-meta.json',JSON.stringify({...report,categories,verifiedPurchaseLinks:products.filter(p=>p.w2cUrl).length,missingImages:products.filter(p=>!p.imageUrl).length,inferredCategoryCount:products.filter(p=>!p.sourceCategorySlug&&p.category!=='other').length},null,2));
for(const c of [{slug:'all'},...categories])writeFileSync('public/catalog/'+c.slug+'.json',JSON.stringify(c.slug==='all'?products:products.filter(p=>p.category===c.slug)));
console.log(JSON.stringify({total:products.length,categories:categories.map(c=>[c.name,c.count])}));
