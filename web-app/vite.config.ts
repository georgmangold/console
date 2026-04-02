import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import istanbul from "vite-plugin-istanbul";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.VITE_COVERAGE === "true"
      ? istanbul({
          requireEnv: true,
          checkProd: true,
          forceBuildInstrument: true,
        })
      : undefined,
    createHtmlPlugin({
      minify: true,
      entry: "src/index.tsx",
    }),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/mds/dist/assets/**/*",
          dest: "./",
          rename: { stripBase: 4 },
        },
      ],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  base: "./",
  build: {
    outDir: "build",
    sourcemap: false,
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
    // needed by "react-use-websocket" in trace
    inconsistentCjsInterop: true,
  },
});
