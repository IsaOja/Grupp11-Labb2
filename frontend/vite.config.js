import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // allow overriding the API host with VITE_API_URL; fallback to localhost for local dev
      "/api": process.env.VITE_API_URL || "http://localhost:3000",
    },
    allowedHosts: ["express.ebros.se", "localhost", "127.0.0.1"],
  },
});
