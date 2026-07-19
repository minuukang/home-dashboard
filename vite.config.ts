import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

const proxy = {
  "/api": {
    target: "http://localhost:3001",
    changeOrigin: true,
  },
};

export default defineConfig({
  plugins: [basicSsl()],
  build: {
    target: "es2020",
  },
  server: {
    https: {},
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    open: true,
    proxy,
  },
  preview: {
    https: {},
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    open: true,
    proxy,
  },
});
