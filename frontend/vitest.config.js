import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    fileParallelism: false,
    pool: "forks",
    coverage: {
      provider: "v8",
      include: ["src/js/**/*.js"],
      exclude: ["src/js/deployed.inc.js"],
      reporter: ["text", "text-summary"],
    },
  },
});
