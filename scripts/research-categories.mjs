import {mkdirSync,writeFileSync} from 'node:fs';
import {browser} from './source-browser.mjs';
mkdirSync('output/category-research',{recursive:true});
const groups=[['Shoes','https://repsw2c.com/category-911-Shoes.html'],...['Hoodies/Sweaters','T-Shirts','Jackets','Pants/Shorts','Headwear','Sets','Underwear/Underpants','Jersey','Accessories'].map((name,i)=>[name,`https://repsw2c.com/search-${912+i}/name/Shoes.html`])];
const findings=[];
for(const [name,url] of groups){
 const result=browser(`async root=>{const page=await root.context().newPage();try{await page.goto(${JSON.stringify(url)},{waitUntil:'domcontentloaded'});await page.locator('body').waitFor();return {url:page.url(),title:await page.title(),text:(await page.locator('body').innerText()).slice(0,12000),links:await page.locator('a').evaluateAll(as=>as.map(a=>({text:a.textContent.trim(),href:a.href}))),imageCount:await page.locator('img').count()};}finally{await page.close();}}`,'usfans-categories');
 findings.push({name,...result});writeFileSync('output/category-research/reference.json',JSON.stringify(findings,null,2));console.log(name+': '+result.title+'; '+result.imageCount+' images');
}
