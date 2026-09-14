import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://usfansindex.com",
  integrations: [sitemap({
    filter: (page) => page === "https://usfansindex.com/",
    serialize: (item) => ({ ...item, lastmod: new Date("2026-09-14T00:00:00Z") }),
  })],
  devToolbar: {
    enabled: false,
  },
});
