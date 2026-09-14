import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 15, 'Expected homepage, four content pages, and ten categories');
const fileFor = pathname => join('dist', pathname === '/' ? 'index.html' : pathname.endsWith('.html') ? pathname : pathname + '/index.html');
for (const value of urls) {
  const url = new URL(value);
  assert.equal(url.hash, '', 'No fragments in sitemap');
  const html = readFileSync(fileFor(url.pathname), 'utf8');
  assert.ok(html.includes(`rel="canonical" href="${value}"`), 'Page must have its own canonical: ' + value);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, 'One main heading: ' + value);
  assert.equal((html.match(/data-language=/g) || []).length, 27, 'Language picker on every page');
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    const target = new URL(href, value);
    if (target.origin !== url.origin) continue;
    assert.equal(target.hash, '', 'No fragments in internal links: ' + href);
    if (!target.pathname.match(/\.[a-z]+$/i)) assert.ok(existsSync(fileFor(target.pathname)), 'Internal route exists: ' + href);
  }
  if (url.pathname.startsWith('/categories/')) {
    assert.equal((html.match(/<tr data-name=/g) || []).length, 8, 'Category content is present without JavaScript');
  }
}
const redirects = JSON.parse(readFileSync('vercel.json', 'utf8')).redirects;
for (const redirect of redirects) {
  assert.ok(!redirect.destination.includes('#'), 'Redirect has no fragment');
  assert.ok(existsSync(fileFor(redirect.destination)), 'Redirect destination exists');
  assert.notEqual(redirect.source.replace(/\/$/, ''), redirect.destination.replace(/\/$/, ''), 'No self redirects');
}
console.log('PASS: 15 canonical pages; all internal routes and redirects resolve without fragments; category pages contain eight items.');
