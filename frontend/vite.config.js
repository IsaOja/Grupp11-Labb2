import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const proxyTarget =
    env.VITE_API_PROXY || env.VITE_API_URL || "http://localhost:3000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": proxyTarget,
      },
      allowedHosts: ["express.ebros.se", "localhost", "127.0.0.1"],
    },
  };
});
