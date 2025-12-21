import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  shims: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
  splitting: true,
  treeshake: true,
  clean: true,
  minify: true,
});
