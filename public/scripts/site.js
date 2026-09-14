"use strict";
const search = document.querySelector('#search');
const category = document.querySelector('#category');
const rows = [...document.querySelectorAll('#product-table tbody tr')];
let toastTimer;
let pageIndex = 0;
const pageSize = 8;
function filter(resetPage = true) {
 if (resetPage) pageIndex = 0;
 const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
 const matches = rows.filter(row => {
  const searchable = (row.dataset.name + ' ' + row.querySelector('.product-name').textContent + ' ' + row.querySelector('[data-filter]').textContent).toLowerCase();
  return (!category.value || row.dataset.category === category.value) && terms.every(term => searchable.includes(term));
 });
 const count = matches.length;
 const pages = Math.max(1, Math.ceil(count / pageSize));
 pageIndex = Math.min(pageIndex, pages - 1);
 const visible = new Set(matches.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
 rows.forEach(row => { row.hidden = !visible.has(row); });
 document.querySelector('#results').textContent = count ? 'Showing '+(pageIndex*pageSize+1)+'–'+Math.min((pageIndex+1)*pageSize,count)+' of '+count+' items' : '0 matching items';
 document.querySelector('#empty').hidden = count > 0;
 const pagination = document.querySelector('#pagination');
 if (pagination) {
  pagination.hidden = count <= pageSize;
  document.querySelector('#page-status').textContent = (pageIndex+1)+' / '+pages;
  document.querySelector('#previous-page').disabled = pageIndex === 0;
  document.querySelector('#next-page').disabled = pageIndex >= pages - 1;
 }
 document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter === category.value)));
 document.querySelectorAll('a[data-category]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.category === category.value)));
}
function updateUrl() {
 const url = new URL(location.href);
 url.hash = '';
 if (search.value.trim()) url.searchParams.set('q', search.value.trim());
 else url.searchParams.delete('q');
 if (pageIndex > 0) url.searchParams.set('page', String(pageIndex + 1));
 else url.searchParams.delete('page');
 history.replaceState(null, '', url.pathname + url.search);
}
function chooseCategory(value) {
 location.assign(value ? '/categories/' + value.toLowerCase() + '/' : '/database/');
}
function reset(){
 if (category.dataset.categoryBase) { location.assign('/database/'); return; }
 search.value='';category.value='';filter();updateUrl();
}
function fromUrl(){
 const params = new URLSearchParams(location.search);
 search.value = params.get('q') || '';
 const page = Number(params.get('page'));
 pageIndex = Number.isSafeInteger(page) && page > 0 ? page - 1 : 0;
 filter(false);
 updateUrl();
}
search.addEventListener('input',()=>{filter();updateUrl();});
category.addEventListener('change',()=>chooseCategory(category.value));
document.querySelector('#reset').addEventListener('click',reset);
document.querySelector('[data-reset]').addEventListener('click',()=>{reset();search.focus();});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>chooseCategory(button.dataset.filter)));
window.addEventListener('popstate',fromUrl);
document.querySelector('#previous-page')?.addEventListener('click',()=>{pageIndex--;filter(false);updateUrl();document.querySelector('#database').scrollIntoView();});
document.querySelector('#next-page')?.addEventListener('click',()=>{pageIndex++;filter(false);updateUrl();document.querySelector('#database').scrollIntoView();});
function notify(text){clearTimeout(toastTimer);const toast=document.querySelector('#toast');toast.textContent=text;toast.hidden=false;toastTimer=setTimeout(()=>{toast.hidden=true;toast.textContent='';},2400);}
async function copyText(text){
 if(window.isSecureContext && navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(text);return true;}catch{}}
 const active=document.activeElement, field=document.createElement('textarea');
 field.value=text;field.readOnly=true;field.style.cssText='position:fixed;top:0;left:0;opacity:0;width:1px;height:1px;font-size:16px';
 document.body.append(field);
 try{field.focus();field.select();field.setSelectionRange(0,text.length);return document.execCommand('copy');}
 catch{return false;}finally{field.remove();if(active instanceof HTMLElement)active.focus({preventScroll:true});}
}
document.addEventListener('click',async event=>{
 const button=event.target instanceof Element ? event.target.closest('[data-copy]'):null;
 if(!button || button.disabled)return;
 let url;try{url=new URL(button.dataset.copy);if(!['https:','http:'].includes(url.protocol))throw Error();}catch{notify('Link unavailable.');return;}
 const label=button.textContent;button.disabled=true;button.textContent='Copying…';
 const success=await copyText(url.href);
 if(success){button.textContent='Copied!';notify('Copied!');setTimeout(()=>{button.textContent=label;button.disabled=false;},1800);}
 else{button.textContent=label;button.disabled=false;const dialog=document.querySelector('#manual-dialog'),input=document.querySelector('#manual-link');input.value=url.href;if(!dialog.open)dialog.showModal();input.focus();input.select();input.setSelectionRange(0,input.value.length);}
});
fromUrl();

document.querySelectorAll("[data-gallery]").forEach(link=>link.addEventListener("click",event=>{const dialog=document.getElementById(link.dataset.gallery);if(dialog&&typeof dialog.showModal==="function"){event.preventDefault();dialog.showModal();}}));
