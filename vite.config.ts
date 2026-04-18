import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: "server/server.ts",
    outDir: "dist/server",
  },
});
