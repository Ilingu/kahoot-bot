import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

const manifest = {
  name: "Kahoot BOT",
  short_name: "Kahoot BOT",
  description: "A simple Kahoot Bot that answer randomly",
  icons: [
    {
      src: "/IMG/favicon.ico",
      sizes: "32x32",
      type: "image/x-icon",
    },
    {
      src: "/IMG/logo-kahootbot-128.webp",
      sizes: "128x128",
      type: "image/webp",
    },
    {
      src: "/IMG/logo-kahootbot-192.webp",
      sizes: "192x192",
      type: "image/webp",
    },
    {
      src: "/IMG/logo-kahootbot-192.webp",
      sizes: "192x192",
      type: "image/webp",
      purpose: "maskable",
    },
    {
      src: "/IMG/logo-kahootbot-512.webp",
      sizes: "512x512",
      type: "image/webp",
    },
  ],
  id: "/",
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
