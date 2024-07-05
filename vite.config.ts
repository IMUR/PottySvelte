import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    hmr: {
      overlay: false,
    },
  },
  build: {
    sourcemap: false, // Disable source maps
  },
});
