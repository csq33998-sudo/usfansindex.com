(() => {
  'use strict';
  const picker = document.querySelector('[data-language-picker]');
  if (!picker) return;
  const toggle = picker.querySelector('.language-toggle');
  const panel = picker.querySelector('#language-panel');
  const label = picker.querySelector('[data-language-label]');
  const options = [...picker.querySelectorAll('[data-language]')];
  const feedback = picker.querySelector('.language-feedback');
  const message = picker.querySelector('[data-language-message]');
  const fallback = picker.querySelector('[data-translation-fallback]');
  let translatorPromise;
  let request = 0;
  const preferenceKey = 'usfans-language';
  function remember(code) {
    try { localStorage.setItem(preferenceKey, code); } catch { /* Storage may be disabled. */ }
  }

  function close(returnFocus = false) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }
  function select(code) {
    const selected = options.find(option => option.dataset.language === code);
    if (!selected) return;
    label.textContent = selected.textContent;
    options.forEach(option => option.setAttribute('aria-pressed', String(option === selected)));
    document.documentElement.lang = code;
    remember(code);
  }
  toggle.disabled = false;
  toggle.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (!picker.contains(event.target)) close();
  });
  document.addEventListener('focusin', event => {
    if (!picker.contains(event.target)) close();
  });
  picker.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
    if (event.target === toggle && event.key === 'ArrowDown') {
      event.preventDefault(); panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      options.find(option => option.getAttribute('aria-pressed') === 'true')?.focus();
    }
  });

  function loadTranslator() {
    if (translatorPromise) return translatorPromise;
    translatorPromise = new Promise((resolve, reject) => {
      let settled = false;
      const host = document.createElement('div');
      host.id = 'google-translate-element';
      host.className = 'translation-provider notranslate';
      (document.querySelector('footer') || document.body).append(host);
      const script = document.createElement('script');
      const cleanup = () => { clearTimeout(timeout); observer.disconnect(); };
      const fail = () => {
        if (settled) return;
        settled = true; cleanup(); script.remove(); host.remove();
        reject(new Error('Translation service unavailable'));
      };
      const observer = new MutationObserver(() => {
        const combo = host.querySelector('select.goog-te-combo');
        if (!combo || combo.options.length < 2 || settled) return;
        settled = true; cleanup();
        combo.addEventListener('change', () => { if (combo.value) select(combo.value); });
        resolve(combo);
      });
      observer.observe(host, { childList: true, subtree: true });
      const timeout = setTimeout(fail, 15000);
      window.usfansTranslateReady = () => {
        if (settled) return;
        try {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en', autoDisplay: false,
            includedLanguages: options.map(option => option.dataset.language).join(','),
          }, host.id);
        } catch { fail(); }
      };
      script.src = 'https://translate.google.com/translate_a/element.js?cb=usfansTranslateReady';
      script.async = true;
      script.onerror = fail;
      document.head.append(script);
    }).catch(error => { translatorPromise = undefined; throw error; });
    return translatorPromise;
  }

  function restoreEnglish() {
    remember('en');
    // Google may set both host-only and parent-domain cookies.
    const parts = location.hostname.split('.');
    const domains = ['', ...parts.map((_, index) => '; domain=' + parts.slice(index).join('.'))];
    domains.forEach(domain => {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + domain;
    });
    location.reload();
  }
  async function translate(code) {
    const currentRequest = ++request;
    fallback.hidden = true;
    if (code === 'en') {
      toggle.removeAttribute('aria-busy');
      remember('en');
      if (translatorPromise || document.documentElement.lang !== 'en' || document.cookie.includes('googtrans=')) restoreEnglish();
      else feedback.hidden = true;
      return;
    }
    feedback.hidden = false;
    message.textContent = 'Loading Google Translate…';
    toggle.setAttribute('aria-busy', 'true');
    try {
      const combo = await loadTranslator();
      if (currentRequest !== request) return;
      combo.value = code;
      if (combo.value !== code) throw new Error('Language unavailable');
      combo.dispatchEvent(new Event('change', { bubbles: true }));
      feedback.hidden = true;
    } catch {
      if (currentRequest !== request) return;
      message.textContent = 'Translation could not load. Please try again.';
      const url = new URL('https://translate.google.com/translate');
      const pageUrl = new URL(location.pathname + location.search + location.hash, 'https://usfansindex.com');
      url.search = new URLSearchParams({ sl: 'en', tl: code, u: pageUrl.href });
      fallback.href = url.href;
      fallback.hidden = false;
    } finally {
      if (currentRequest === request) toggle.removeAttribute('aria-busy');
    }
  }
  options.forEach(option => option.addEventListener('click', () => {
    close(true);
    translate(option.dataset.language);
  }));
  const saved = document.cookie.split('; ').find(cookie => cookie.startsWith('googtrans='));
  let code = saved?.split('/').pop();
  try { code = localStorage.getItem(preferenceKey) || code; } catch { /* Cookie fallback. */ }
  if (code && code !== 'en' && options.some(option => option.dataset.language === code)) translate(code);
})();
