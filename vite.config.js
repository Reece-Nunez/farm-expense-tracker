export default defineConfig({
  base: '/', // 👈 This is the fix
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["aws-amplify", "@aws-amplify/auth"],
    esbuildOptions: {
      target: "esnext",
    },
  },
});
