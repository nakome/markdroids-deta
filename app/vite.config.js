import { defineConfig, loadEnv } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { splitVendorChunkPlugin } from 'vite';

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
  // Extends 'process.env.*' with VITE_*-variables from '.env.(mode=production|development)'
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [
      ViteMinifyPlugin({}),
      splitVendorChunkPlugin()
    ],
    build: {
      outDir: "./dist",
      minify: true,
      brotliSize: false,
    },
    assetsInclude: ["**/*.md", "**/*.svg"],
  });
};
