import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync } from "fs";

const brandPages = readdirSync(resolve(__dirname, "brands"))
  .filter((f) => f.endsWith(".html"))
  .reduce((acc, file) => {
    const name = file.replace(".html", "");
    acc[name] = resolve(__dirname, "brands", file);
    return acc;
  }, {});

export default defineConfig(({ mode }) => ({
  root: ".",
  publicDir: "public",
  base: mode === "production" ? "/aoa-window-solutions-redesign/" : "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...brandPages,
      },
    },
  },
}));
