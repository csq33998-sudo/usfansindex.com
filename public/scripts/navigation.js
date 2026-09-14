(() => {
  // Fragments never reach the server; migrate old bookmarked section URLs here.
  const fragment = location.hash.slice(1);
  if (fragment) {
    const [section, query = ''] = fragment.split('?');
    const routes = {database:'/database/', 'how-it-works':'/how-it-works/', trust:'/trust/', faq:'/faq/'};
    const categories = ['sneakers','hoodies','t-shirts','jackets','accessories','bags','pants','watches','shorts','knitwear'];
    const category = new URLSearchParams(query).get('category')?.toLowerCase();
    const destination = section === 'database' && categories.includes(category)
      ? '/categories/' + category + '/' : routes[section];
    if (destination) location.replace(destination + location.search);
    else history.replaceState(null, '', location.pathname + location.search);
  }
  document.querySelector('[data-skip-main]')?.addEventListener('click', () => {
    const main = document.getElementById('main-content');
    main?.focus();
    main?.scrollIntoView();
  });
  const picker=document.querySelector('.categories-picker');
  const toggle=picker?.querySelector('.categories-toggle');
  const panel=document.querySelector('#categories-panel');
  if(!picker||!toggle||!panel)return;
  const setOpen=open=>{panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));};
  toggle.addEventListener('click',()=>setOpen(panel.hidden));
  document.addEventListener('click',event=>{if(!picker.contains(event.target))setOpen(false);});
  document.addEventListener('focusin',event=>{if(!picker.contains(event.target))setOpen(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){setOpen(false);toggle.focus();}});
  picker.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'&&event.target===toggle){event.preventDefault();setOpen(true);panel.querySelector('a')?.focus();}
  });
  panel.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setOpen(false)));
})();
