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
function reset(){search.value='';category.value='';filter();history.replaceState(null,'',location.pathname+location.search+'#database');}
function fromHash(){if(location.hash.startsWith('#database?')){const value=new URLSearchParams(location.hash.split('?')[1]).get('category');category.value=[...category.options].some(o=>o.value===value)?value:'';filter();document.querySelector('#database').scrollIntoView();}}
search.addEventListener('input',filter);
category.addEventListener('change',()=>{filter();history.replaceState(null,'',location.pathname+location.search+'#database?category='+encodeURIComponent(category.value));});
document.querySelector('#reset').addEventListener('click',reset);
document.querySelector('[data-reset]').addEventListener('click',()=>{reset();search.focus();});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{category.value=button.dataset.filter;filter();}));
document.querySelectorAll('a[data-category]').forEach(a=>a.addEventListener('click',()=>{search.value='';category.value=a.dataset.category;filter();document.querySelector('#database').scrollIntoView();}));
window.addEventListener('hashchange',fromHash);
document.querySelector('#previous-page')?.addEventListener('click',()=>{pageIndex--;filter(false);document.querySelector('#database').scrollIntoView();});
document.querySelector('#next-page')?.addEventListener('click',()=>{pageIndex++;filter(false);document.querySelector('#database').scrollIntoView();});
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
filter();fromHash();

document.querySelectorAll("[data-gallery]").forEach(link=>link.addEventListener("click",event=>{const dialog=document.getElementById(link.dataset.gallery);if(dialog&&typeof dialog.showModal==="function"){event.preventDefault();dialog.showModal();}}));
