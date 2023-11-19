import { defineConfig } from "astro/config";

// Integrations
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import react from "@astrojs/react";
import solidJs from "@astrojs/solid-js";

// Adaptors
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [
    tailwind(),
    preact({
      include: ["**/preact/*"],
    }),
    react({
      include: ["**/react/*"],
    }),
    solidJs({
      include: ["**/solid/*"],
    }),
  ],
  adapter: node({
    mode: "standalone",
  }),
});
