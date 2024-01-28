import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "vueclid",
      fileName: "vueclid",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  plugins: [vue()],
});
