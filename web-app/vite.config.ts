import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import istanbul from "vite-plugin-istanbul";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/mds/dist/assets/**/*",
          dest: "./",
          rename: { stripBase: 4 },
        },
      ],
    }),
    process.env.VITE_COVERAGE === "true"
      ? istanbul({
          requireEnv: true,
          checkProd: true,
          forceBuildInstrument: true,
        })
      : undefined,
  ],
  base: "./",
  build: {
    outDir: "build",
    sourcemap: false,
    chunkSizeWarningLimit: 2000, //use npx vite-bundle-visualizer
    rollupOptions: {
      checks: {
        pluginTimings: process.env.VITE_COVERAGE === "true" ? false : true,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5005,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:9090",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  legacy: {
    // still needed by "react-use-websocket" in trace
    inconsistentCjsInterop: true,
  },
});
