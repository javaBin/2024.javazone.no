import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
//import vercelStatic from '@astrojs/vercel/static';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: vercel({
      edgeMiddleware: true,
  }),
  integrations: [tailwind({
    applyBaseStyles: false
  }), react()],
    astro: {
      preset: 'vercel-edge',
    }
});
