import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

const code = readFileSync("dist/scripts/site.js", "utf8").replace(
  /const languageSelect[\s\S]*$/,
  "globalThis.__translations = translations;",
);
const context = { globalThis: {} };
vm.createContext(context);
vm.runInContext(code, context);

const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith(".html")) files.push(file);
  }
}

walk("dist/articles");

const keys = new Set();
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) {
    keys.add(match[1]);
  }
}

console.log(`article html files=${files.length}`);
console.log(`article keys=${keys.size}`);
for (const lang of ["en", "de", "fr", "es", "it", "nl", "pt"]) {
  const missing = [...keys].filter((key) => !(key in context.globalThis.__translations[lang]));
  console.log(`${lang} missing=${missing.length}${missing.length ? ` ${missing.join(",")}` : ""}`);
}
