import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    include: ["test/**/*.?(c|m)[jt]s?(x)"],
    typecheck: {
      include: ["test/**/*.?(c|m)[jt]s?(x)"],
    },
  },
});
