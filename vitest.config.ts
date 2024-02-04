import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    include: ["test/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
});
