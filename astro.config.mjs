import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://usfansindex.com",
  integrations: [sitemap()],
  devToolbar: {
    enabled: false,
  },
});
