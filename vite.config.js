import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    hmr: {
      port: 5173
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom", "aws-amplify", "@aws-amplify/datastore", "@aws-amplify/api"]
  },
  optimizeDeps: {
    include: ["aws-amplify", "aws-amplify/api", "aws-amplify/auth", "aws-amplify/storage"]
  }
});
