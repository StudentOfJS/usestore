import preact from "@preact/preset-vite";
import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { splitVendorChunkPlugin } from "vite";

export default defineConfig({
  plugins: [
    preact(),
    splitVendorChunkPlugin(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
        entry: path.resolve(__dirname, "src/lib/index.ts"),
        name: "useStore",
        formats: ["es", "umd"],
        fileName: (format) => `useStore.${format}.js`,
    },
    rollupOptions: {
      external: ["preact", "store"],
      output: {
        globals: {
          preact: "Preact",
        },
      },
    },
  },
});
