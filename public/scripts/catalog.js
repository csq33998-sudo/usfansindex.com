(() => {
 'use strict';
 const main=document.querySelector('[data-catalog]');if(!main)return;
 const form=document.querySelector('#catalog-search'),search=document.querySelector('#search'),type=document.querySelector('#product-type'),sort=document.querySelector('#sort');
 const grid=document.querySelector('#catalog-grid'),pagination=document.querySelector('#catalog-pagination'),results=document.querySelector('#results'),error=document.querySelector('#catalog-error');
 const base=main.dataset.catalog==='all'?'/database/':'/categories/'+main.dataset.catalog+'/';
 const pageSize=Number(main.dataset.pageSize);let currentPage=Number(main.dataset.page),dataPromise,revision=0,timer;
 const labels=Object.fromEntries([...document.querySelectorAll('.catalog-sidebar a[href^="/categories/"]')].map(a=>[a.getAttribute('href').split('/')[2],a.querySelector('span').textContent]));
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const format=n=>n.toLocaleString('en-US');
 const active=()=>search.value.trim()||type.value||sort.value!=='source';
 async function load(){
  if(!dataPromise){
   const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
   dataPromise=fetch('/catalog/'+main.dataset.catalog+'.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Catalog request failed');return r.json();}).catch(e=>{dataPromise=null;throw e;}).finally(()=>clearTimeout(timeout));
  }
  return dataPromise;
 }
 function card(p){
  const name=escape(p.name),source=escape(p.sourceUrl),url=escape(p.w2cUrl||p.sourceUrl);
  const image=p.imageUrl?`<img src="${escape(p.imageUrl)}" alt="${name}" width="300" height="300" loading="lazy" decoding="async" referrerpolicy="no-referrer">`:'<span class="missing-image">Image unavailable</span>';
  const price=typeof p.priceCny==='number'&&p.priceCny>0?`<span class="dual-price"><strong>¥${p.priceCny.toFixed(2)}</strong><span class="usd-price">≈$${(p.priceCny/7.2).toFixed(2)}</span></span>`:'<span class="unavailable">Check source price</span>';
  return `<article class="catalog-card" data-product-id="${escape(p.id)}"><a class="catalog-image" href="${source}" target="_blank" rel="noopener noreferrer" aria-label="View ${name} on the source site">${image}</a><div class="catalog-card-body"><a class="catalog-category" href="/categories/${escape(p.category)}/">${escape(labels[p.category]||p.category)}</a><h3><a href="${source}" target="_blank" rel="noopener noreferrer">${name}</a></h3><div class="catalog-card-price">${price}<span class="catalog-qc">${p.hasSourceQc?'QC on source':'Source listing'}</span></div><div class="catalog-card-actions"><a class="button primary" href="${url}" target="_blank" rel="noopener noreferrer">${p.w2cUrl?'Open W2C ↗':'View item ↗'}</a>${p.w2cUrl?`<button class="button secondary" type="button" data-copy="${url}" aria-label="Copy purchase link for ${name}">Copy</button>`:''}</div>${p.qcPhotos?.length?`<button class="catalog-qc-link" type="button" data-qc-photos="${escape(JSON.stringify(p.qcPhotos))}">View QC (${p.qcPhotos.length})</button>`:`<a class="catalog-qc-link" href="${source}" target="_blank" rel="noopener noreferrer">Source details ↗</a>`}</div></article>`;
 }
 function pageUrl(n){
  if(!active())return base+(n>1?'page/'+n+'/':'');
  const params=new URLSearchParams();if(search.value.trim())params.set('q',search.value.trim());if(type.value)params.set('type',type.value);if(sort.value!=='source')params.set('sort',sort.value);if(n>1)params.set('page',String(n));return base+'?'+params;
 }
 function renderPagination(count){
  const pages=Math.max(1,Math.ceil(count/pageSize));
  const numbers=[...new Set([1,...Array.from({length:5},(_,i)=>currentPage-2+i).filter(n=>n>1&&n<pages),pages])].sort((a,b)=>a-b);
  const link=(n,text,cls='')=>`<a class="${cls}" href="${escape(pageUrl(n))}" data-page="${n}" ${n===currentPage?'aria-current="page"':''}>${text}</a>`;
  pagination.innerHTML=(currentPage>1?link(currentPage-1,'← Previous','page-direction'):'')+'<div class="page-numbers">'+numbers.map((n,i)=>(i&&n-numbers[i-1]>1?'<span aria-hidden="true">…</span>':'')+link(n,n)).join('')+'</div>'+(currentPage<pages?link(currentPage+1,'Next →','page-direction'):'');pagination.hidden=count===0;
 }
 async function render({page=1,historyMode='replaceState'}={}){
  const ticket=++revision;error.hidden=true;grid.setAttribute('aria-busy','true');results.textContent='Searching the full catalog…';
  try{
   const data=await load();if(ticket!==revision)return;
   const terms=search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
   const matches=data.filter(p=>(!type.value||p.sourceCategory===type.value)&&terms.every(term=>(p.name+' '+p.brand+' '+p.sourceCategory+' '+(labels[p.category]||p.category)).toLocaleLowerCase().includes(term)));
   const price=p=>typeof p.priceCny==='number'&&p.priceCny>0?p.priceCny:null;
   if(sort.value.startsWith('price-'))matches.sort((a,b)=>price(a)===null?price(b)===null?0:1:price(b)===null?-1:sort.value==='price-asc'?price(a)-price(b):price(b)-price(a));
   if(sort.value==='name')matches.sort((a,b)=>a.name.localeCompare(b.name));
   currentPage=Math.min(Math.max(1,page),Math.max(1,Math.ceil(matches.length/pageSize)));
   grid.innerHTML=matches.slice((currentPage-1)*pageSize,currentPage*pageSize).map(card).join('');
   results.textContent=matches.length?`Showing ${format((currentPage-1)*pageSize+1)}–${format(Math.min(currentPage*pageSize,matches.length))} of ${format(matches.length)} items`:'0 matching items';
   document.querySelector('#catalog-empty').hidden=matches.length>0;renderPagination(matches.length);
   if(historyMode)history[historyMode](null,'',pageUrl(currentPage));
  }catch(e){if(ticket!==revision)return;error.hidden=false;results.textContent='Search unavailable — current page retained.';}
  finally{if(ticket===revision)grid.removeAttribute('aria-busy');}
 }
 const reset=()=>location.assign(base);
 function update(options={}){
  // Google Translate scans a page once. A new document lets it translate the
  // filtered result set reliably while keeping the selected language and URL.
  if(document.documentElement.lang!=='en'){location.assign(pageUrl(options.page||1));return Promise.resolve();}
  window.usfansCatalogReady=render(options);return window.usfansCatalogReady;
 }
 form.addEventListener('submit',e=>{e.preventDefault();clearTimeout(timer);update();});
 search.addEventListener('input',()=>{clearTimeout(timer);revision++;timer=setTimeout(()=>update(),document.documentElement.lang==='en'?300:700);});
 type.addEventListener('change',()=>update());sort.addEventListener('change',()=>update());
 form.addEventListener('reset',e=>{e.preventDefault();reset();});document.querySelector('#clear-search').addEventListener('click',reset);
 document.querySelector('#retry-search').addEventListener('click',()=>update({page:currentPage}));
 pagination.addEventListener('click',e=>{const a=e.target.closest('a[data-page]');if(!a||!active()||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();update({page:Number(a.dataset.page),historyMode:'pushState'}).then(()=>form.scrollIntoView({block:'start'}));});
 function fromUrl(){const params=new URLSearchParams(location.search);search.value=params.get('q')||'';type.value=params.get('type')||'';sort.value=['price-asc','price-desc','name'].includes(params.get('sort'))?params.get('sort'):'source';if(active())return render({page:Number(params.get('page'))||1,historyMode:null});else if(dataPromise)return render({page:Number(location.pathname.match(/\/page\/(\d+)\//)?.[1])||1,historyMode:null});}
 window.addEventListener('popstate',()=>{if(document.documentElement.lang!=='en')location.reload();else window.usfansCatalogReady=fromUrl();});window.usfansCatalogReady=fromUrl();
 const mobile=matchMedia('(max-width: 800px)'),details=document.querySelector('.catalog-sidebar details');details.open=!mobile.matches;mobile.addEventListener('change',()=>{details.open=!mobile.matches;});
 function missingImage(img){if(!(img instanceof HTMLImageElement)||!img.matches('.catalog-image img'))return;const label=document.createElement('span');label.className='missing-image';label.textContent='Image unavailable';img.replaceWith(label);}
 document.addEventListener('error',event=>missingImage(event.target),true);
 document.querySelectorAll('.catalog-image img').forEach(img=>{if(img.complete&&!img.naturalWidth)missingImage(img);});
 let toastTimer;
 document.addEventListener('click',async e=>{
  const qc=e.target.closest('[data-qc-photos]');
  if(qc){
   const name=qc.closest('.catalog-card').querySelector('h3').textContent;
   const images=JSON.parse(qc.dataset.qcPhotos);const container=document.querySelector('#catalog-qc-photos');container.replaceChildren();
   document.querySelector('#catalog-qc-title').textContent=name;
   images.forEach((url,i)=>{const a=document.createElement('a'),img=document.createElement('img');a.href=url;a.target='_blank';a.rel='noopener noreferrer';img.src=url;img.alt='Source QC reference '+(i+1)+' for '+name;img.loading='lazy';img.referrerPolicy='no-referrer';a.append(img);container.append(a);});
   document.querySelector('#catalog-qc-dialog').showModal();return;
  }
  const button=e.target.closest('[data-copy]');if(!button)return;const value=button.dataset.copy;
  try{await navigator.clipboard.writeText(value);const toast=document.querySelector('#toast');toast.textContent='Purchase link copied';toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,2200);}
  catch{const input=document.querySelector('#manual-link');input.value=value;document.querySelector('#manual-dialog').showModal();input.focus();input.select();}
 });
})();
