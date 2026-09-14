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
})();
