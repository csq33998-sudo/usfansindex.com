import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://usfansindex.com",
  trailingSlash: "always",
  integrations: [sitemap({
    filter: (page) => !new URL(page).pathname.startsWith("/404"),
    serialize: (item) => ({ ...item, lastmod: new Date("2026-09-14T00:00:00Z") }),
  })],
  devToolbar: {
    enabled: false,
  },
});
