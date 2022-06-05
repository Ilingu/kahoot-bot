import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

const manifest = {
  name: "Kahoot BOT",
  short_name: "Kahoot BOT",
  description: "A simple Kahoot Bot that answer randomly",
  icons: [
    {
      src: "favicon.ico",
      sizes: "32x32",
      type: "image/x-icon",
    },
    {
      src: "logo-kahootbot-128.png",
      sizes: "128x128",
      type: "image/png",
    },
    {
      src: "logo-kahootbot-192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "logo-kahootbot-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "logo-kahootbot-512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  background_color: "#18181b",
  theme_color: "#a855f7",
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      includeAssets: ["robots.txt"],
      manifest,
    }),
  ],
});
