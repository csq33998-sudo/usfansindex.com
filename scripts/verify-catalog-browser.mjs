import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
import {browser} from './source-browser.mjs';
mkdirSync('output/catalog-verification',{recursive:true});
const result=browser(`async root=>{
 const page=await root.context().newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:4321/database/');
  const cards=await page.locator('.catalog-card').count();
  const qc=page.locator('[data-qc-photos]').nth(1),expected=JSON.parse(await qc.getAttribute('data-qc-photos')).length;
  await qc.click();const gallery=await page.locator('#catalog-qc-photos img').count();await page.keyboard.press('Escape');
  const closed=!(await page.locator('#catalog-qc-dialog').evaluate(d=>d.open));
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Test denied clipboard');}}}));
  const copy=page.locator('[data-copy]').first(),link=await copy.getAttribute('data-copy');await copy.click();
  const fallback=await page.locator('#manual-link').inputValue();await page.keyboard.press('Escape');
  await page.route('**/catalog/bags.json',route=>route.abort());await page.goto('http://127.0.0.1:4321/categories/bags/');
  await page.locator('#search').fill('Dior');await page.locator('#catalog-error').waitFor({state:'visible'});
  const retained=await page.locator('.catalog-card').count();await page.unroute('**/catalog/bags.json');
  await page.locator('#retry-search').click();await page.waitForFunction(()=>location.search.includes('Dior')&&document.querySelector('#catalog-error').hidden);
  const recovered=await page.locator('#results').innerText();
  await page.goto('http://127.0.0.1:4321/database/');await page.setViewportSize({width:390,height:844});
  await page.locator('.categories-toggle').click();const mobileBox=await page.locator('#categories-panel').boundingBox();
  const rows=await page.locator('.categories-menu-links a').evaluateAll(as=>as.map(a=>({display:getComputedStyle(a).display,overflow:a.scrollWidth>a.clientWidth})));
  await page.screenshot({path:'output/catalog-verification/mobile-menu.png'});await page.keyboard.press('Escape');
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'output/catalog-verification/desktop.png'});
  return {cards,expected,gallery,closed,copyFallback:link===fallback,retained,recovered,mobileBox,rows,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};
 }finally{await page.close();}
}`,'usfans-rebuild');
assert.equal(result.cards,48);assert.equal(result.gallery,result.expected);assert.ok(result.closed);assert.ok(result.copyFallback);assert.equal(result.retained,48);assert.ok(!result.overflow);assert.equal(result.errors.length,0);assert.ok(result.rows.every(r=>r.display==='flex'&&!r.overflow));assert.ok(result.mobileBox.x>=0&&result.mobileBox.x+result.mobileBox.width<=390);
writeFileSync('output/catalog-verification/interactions.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
