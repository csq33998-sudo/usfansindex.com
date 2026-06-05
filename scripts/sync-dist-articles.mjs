import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const articlesDir = join(dist, "articles");
const scriptPath = "/scripts/site.js";

const articles = [
  ["best-usfans-spreadsheet-for-streetwear-finds", "Spreadsheet", "Best USFans Spreadsheet for Streetwear Finds"],
  ["usfans-spreadsheet-sneakers-guide", "Sneakers", "USFans Spreadsheet Sneakers Guide"],
  ["usfans-hoodie-spreadsheet-for-streetwear-hauls", "Hoodies", "USFans Hoodie Spreadsheet for Streetwear Hauls"],
  ["usfans-spreadsheet-jackets-and-outerwear", "Jackets", "USFans Spreadsheet for Jackets and Outerwear"],
  ["usfans-spreadsheet-denim-cargos-pants", "Denim", "USFans Spreadsheet for Denim, Cargos and Pants"],
  ["usfans-bag-spreadsheet-crossbody-backpack-guide", "Bags", "USFans Bag Spreadsheet: Crossbody and Backpack Guide"],
  ["usfans-accessories-spreadsheet-caps-belts-jewelry", "Accessories", "USFans Accessories Spreadsheet for Caps, Belts and Jewelry"],
  ["usfans-spreadsheet-qc-checklist", "QC", "USFans Spreadsheet QC Checklist"],
  ["usfans-agent-shopping-spreadsheet-workflow", "Workflow", "USFans Agent Shopping Spreadsheet Workflow"],
  ["usfans-spreadsheet-vs-streetwear-search-site", "Comparison", "USFans Spreadsheet vs Streetwear Search Site"],
];

const oldArticleRedirects = [
  ["usfans-finds-sneakers-hoodies-jackets-bags", "usfans-spreadsheet-sneakers-guide"],
  ["how-to-use-usfans-agent-links-for-streetwear-hauls", "usfans-agent-shopping-spreadsheet-workflow"],
  ["w2c-streetwear-guide-for-usfans-shoppers", "usfans-hoodie-spreadsheet-for-streetwear-hauls"],
  ["best-usfans-alternatives-for-finding-streetwear", "usfans-spreadsheet-vs-streetwear-search-site"],
  ["usfans-spreadsheet-vs-maisonlooks-streetstyle", "usfans-spreadsheet-vs-streetwear-search-site"],
  ["how-to-find-qc-friendly-streetwear-links", "usfans-spreadsheet-qc-checklist"],
  ["best-agent-shopping-spreadsheet-for-streetwear-hauls", "best-usfans-spreadsheet-for-streetwear-finds"],
  ["usfans-review-for-streetwear-shoppers", "usfans-spreadsheet-vs-streetwear-search-site"],
  ["usfans-links-for-streetwear-agent-shopping", "usfans-agent-shopping-spreadsheet-workflow"],
];

const header = `<header class="site-header"> <nav class="nav" aria-label="Primary navigation"> <a class="brand" href="/"> <img class="brand-logo" src="/favicon.svg" alt="USFans spreadsheet logo for streetwear finds, agent links, and curated shopping lists" width="42" height="42"> <span>USFans Index</span> </a> <div class="nav-links"> <a href="/" data-i18n="navHome">Home</a> <a href="/finds/" data-i18n="navFinds">Finds</a> <a href="/spreadsheet/" data-i18n="navSpreadsheet">Spreadsheet</a> <a href="/guide/" data-i18n="navGuide">Guide</a> <a href="/articles/" data-i18n="navArticles">Articles</a> <a class="nav-cta" href="https://streetstyle.maisonlooks.com/" target="_blank" rel="noopener noreferrer" data-i18n="navMaisonLooks">Open MaisonLooks</a> </div> <div class="nav-tools" aria-label="Site preferences"> <label class="language-label"> <span data-i18n="languageLabel">Language</span> <select class="language-select" data-language-select aria-label="Language"> <option value="en">English</option> <option value="de">Deutsch</option> <option value="fr">Français</option> <option value="es">Español</option> <option value="it">Italiano</option> <option value="nl">Nederlands</option> <option value="pt">Português</option> </select> </label> <button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle dark mode"> <span data-theme-icon aria-hidden="true">Moon</span> <span data-i18n="themeToggle">Dark</span> </button> </div> </nav> </header>`;
const footer = `<footer class="footer"> <div> <strong>USFans Index</strong> <p data-i18n="footerText">USFans spreadsheet finds, agent shopping guidance, and organized streetwear research.</p> </div> <a href="https://streetstyle.maisonlooks.com/" target="_blank" rel="noopener noreferrer" data-i18n="footerCta">Explore Streetstyle</a> </footer>`;

const articleDescriptions = {
  "Best USFans Spreadsheet for Streetwear Finds": "Find how a USFans spreadsheet should organize streetwear categories, W2C links, QC priorities, price bands, and agent-ready haul notes.",
  "USFans Spreadsheet Sneakers Guide": "Use a USFans sneaker spreadsheet to compare silhouettes, colorways, sizing notes, QC photo priorities, budgets, and W2C links.",
  "USFans Hoodie Spreadsheet for Streetwear Hauls": "Plan hoodie finds inside a USFans spreadsheet with fit notes, fabric weight, graphic checks, sizing context, and agent haul priorities.",
  "USFans Spreadsheet for Jackets and Outerwear": "Build jacket rows for a USFans spreadsheet with shell, puffer, varsity, workwear, sizing, zipper, lining, and QC details.",
  "USFans Spreadsheet for Denim, Cargos and Pants": "Organize denim, cargos, and pants in a USFans spreadsheet with waist, inseam, wash, leg shape, stacking, and sizing notes.",
  "USFans Bag Spreadsheet: Crossbody and Backpack Guide": "Compare USFans bag spreadsheet finds by crossbody, backpack, tote, sling, hardware, capacity, shipping weight, and W2C context.",
  "USFans Accessories Spreadsheet for Caps, Belts and Jewelry": "Use a USFans accessories spreadsheet for caps, belts, jewelry, socks, beanies, QC details, and low-weight haul fillers.",
  "USFans Spreadsheet QC Checklist": "Review USFans spreadsheet rows with QC checks for photos, sizing, materials, logos, stitching, colors, seller consistency, and agent notes.",
  "USFans Agent Shopping Spreadsheet Workflow": "Plan a USFans agent shopping spreadsheet from keyword research to W2C links, category sorting, QC checks, sizing, and final haul decisions.",
  "USFans Spreadsheet vs Streetwear Search Site": "Compare a USFans spreadsheet with a streetwear search site for Google discovery, W2C research, category browsing, and haul planning.",
};

function pageShell(title, description, body, canonical) {
  return `<!DOCTYPE html><html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index, follow"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:type" content="website"><title>${escapeHtml(title)}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="apple-touch-icon" href="/favicon.svg"><script>const savedTheme = localStorage.getItem("theme"); if (savedTheme === "dark") document.documentElement.classList.add("dark");</script><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="/styles/global.css"></head> <body> <a class="skip-link" href="#main" data-i18n="skip">Skip to content</a> ${header} ${body} ${footer} <script src="${scriptPath}" defer></script> </body> </html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function articleDescription(title) {
  return articleDescriptions[title] ?? `USFans spreadsheet guide for ${title}, W2C links, QC notes, category browsing, and agent shopping context.`;
}

function articleIndex() {
  const cards = articles.map(([slug, category, title]) => `<article class="article-card"> <span data-i18n="article.${slug}.category">${category}</span> <h2><a href="/articles/${slug}/" data-i18n="article.${slug}.title">${escapeHtml(title)}</a></h2> <p data-i18n="article.${slug}.description">${escapeHtml(articleDescription(title))}</p> <small><span data-i18n="article.${slug}.keyword">${escapeHtml(title.replace(/ Guide| for .*|: .*/g, ""))}</span> - <span data-i18n="article.${slug}.readTime">5 min read</span></small> </article>`).join("");
  const body = `<main id="main" class="page"> <section class="page-head"> <p class="eyebrow" data-i18n="navArticles">Articles</p> <h1 data-i18n="articlesPageTitle">USFans spreadsheet articles for streetwear search intent.</h1> <p data-i18n="articlesPageIntro">Guides written around USFans spreadsheet, USFans finds, W2C streetwear, agent shopping links, QC checks, category spreadsheets, and organized haul research.</p> </section> <section class="article-grid">${cards}</section> </main>`;
  return pageShell("USFans Spreadsheet Articles - Finds, W2C Links & Agent Shopping Guides", "Read USFans spreadsheet articles for W2C streetwear links, agent shopping workflows, QC checklists, category guides, and organized haul research.", body, "https://usfansindex.com/articles/");
}

function articlePage(slug, category, title, related) {
  const sections = [1, 2, 3, 4].map((num) => `<section><h2 data-i18n="article.${slug}.section${num}Heading">Search intent</h2><p data-i18n="article.${slug}.section${num}Body">${escapeHtml(articleDescription(title))}</p></section>`).join("");
  const relatedLinks = related.map(([relatedSlug, , relatedTitle]) => `<a href="/articles/${relatedSlug}/"><span data-i18n="article.${relatedSlug}.keyword">${escapeHtml(relatedTitle.replace(/ Guide| for .*|: .*/g, ""))}</span><strong data-i18n="article.${relatedSlug}.title">${escapeHtml(relatedTitle)}</strong></a>`).join("");
  const body = `<main id="main" class="page article-page"> <article class="article-body"> <p class="eyebrow" data-i18n="article.${slug}.keyword">${escapeHtml(title.replace(/ Guide| for .*|: .*/g, ""))}</p> <h1 data-i18n="article.${slug}.title">${escapeHtml(title)}</h1> <p class="article-intro" data-i18n="article.${slug}.intro">${escapeHtml(`${title} helps shoppers turn USFans spreadsheet searches into clearer streetwear decisions before they move into deeper product discovery.`)}</p> <div class="article-meta"><span data-i18n="article.${slug}.category">${category}</span><span data-i18n="article.${slug}.readTime">5 min read</span></div>${sections}<div class="article-cta"><p data-i18n="articleCtaText">Continue from this USFans spreadsheet guide with matching streetwear finds, W2C links, QC-aware browsing, and agent-ready category discovery.</p><a class="button primary" href="https://streetstyle.maisonlooks.com/" target="_blank" rel="noopener noreferrer" data-i18n="article.${slug}.cta">Open MaisonLooks streetwear search</a></div></article><aside class="related-articles" aria-label="Related articles"><h2 data-i18n="relatedArticlesTitle">Related USFans guides</h2>${relatedLinks}</aside></main>`;
  return pageShell(title, articleDescription(title), body, `https://usfansindex.com/articles/${slug}/`);
}

mkdirSync(articlesDir, { recursive: true });
writeFileSync(join(articlesDir, "index.html"), articleIndex(), "utf8");

const homePath = join(dist, "index.html");
try {
  let home = readFileSync(homePath, "utf8");
  const homeCards = articles.slice(0, 4).map(([slug, , title]) => `<article class="article-card"> <span data-i18n="article.${slug}.keyword">${escapeHtml(title.replace(/ Guide| for .*|: .*/g, ""))}</span> <h3><a href="/articles/${slug}/" data-i18n="article.${slug}.title">${escapeHtml(title)}</a></h3> <p data-i18n="article.${slug}.description">${escapeHtml(articleDescription(title))}</p> </article>`).join("");
  const searchKeywords = `<section class="section compact-section"> <div class="section-head"> <p class="eyebrow" data-i18n="searchKeywords">Search keywords</p> <h2 data-i18n="googleIntent">Landing pages built for Google intent</h2> </div> <div class="keyword-cloud large"> <a href="/usfans-spreadsheet/">USFans spreadsheet</a><a href="/usfans-finds/">USFans finds</a><a href="/usfans-agent/">USFans agent</a><a href="/w2c-streetwear/">W2C streetwear</a><a href="/streetwear-spreadsheet/">streetwear spreadsheet</a><a href="/maisonlooks-streetstyle/">MaisonLooks Streetstyle</a> </div> </section>`;
  const homeArticles = `<section class="section compact-section"> <div class="section-head"> <p class="eyebrow" data-i18n="seoArticlesEyebrow">SEO articles</p> <h2 data-i18n="homeArticlesTitle">Guides targeting USFans spreadsheet and W2C streetwear searches</h2> </div> <div class="article-grid home-articles">${homeCards}</div> </section>`;
  const pattern = /<section class="section compact-section">(?:(?!<section class="section compact-section">)[\s\S])*?<div class="article-grid home-articles">[\s\S]*?<\/div>\s*<\/section>/g;
  home = home.replace(pattern, "");
  if (!home.includes('class="keyword-cloud large"')) {
    home = home.replace("</main>", `${searchKeywords}</main>`);
  }
  home = home.replace("</main>", `${homeArticles}</main>`);
  writeFileSync(homePath, home, "utf8");
} catch {
  // Home page is optional for this sync.
}

for (let index = 0; index < articles.length; index += 1) {
  const [slug, category, title] = articles[index];
  const dir = join(articlesDir, slug);
  mkdirSync(dir, { recursive: true });
  const related = articles.filter((item) => item[0] !== slug).slice(0, 3);
  writeFileSync(join(dir, "index.html"), articlePage(slug, category, title, related), "utf8");
}

for (const [oldSlug, newSlug] of oldArticleRedirects) {
  const dir = join(articlesDir, oldSlug);
  mkdirSync(dir, { recursive: true });
  const target = `/articles/${newSlug}/`;
  writeFileSync(
    join(dir, "index.html"),
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="https://usfansindex.com${target}"><script>location.replace("${target}")</script><title>Redirecting</title></head><body><p><a href="${target}">Redirecting to the updated USFans article.</a></p></body></html>`,
    "utf8",
  );
}

const sitemapPath = join(dist, "sitemap-0.xml");
try {
  let sitemap = readFileSync(sitemapPath, "utf8");
  for (const [oldSlug] of oldArticleRedirects) {
    sitemap = sitemap.replace(
      new RegExp(`<url><loc>https://usfansindex\\.com/articles/${oldSlug}/</loc></url>`, "g"),
      "",
    );
  }
  for (const [slug] of articles) {
    const loc = `<url><loc>https://usfansindex.com/articles/${slug}/</loc></url>`;
    if (!sitemap.includes(`/articles/${slug}/`)) sitemap = sitemap.replace("</urlset>", `${loc}</urlset>`);
  }
  writeFileSync(sitemapPath, sitemap, "utf8");
} catch {
  // Sitemap is optional for local verification.
}

console.log(`Synced ${articles.length} article pages plus index into dist/articles.`);


