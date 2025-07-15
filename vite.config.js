import { defineConfig } from "vite"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  // Build configuration
  build: {
    // Output directory for built files
    outDir: "dist",

    // Clean the output directory
    emptyOutDir: true,

    // Build library mode for multiple entry points
    lib: {
      entry: {
        "js/login": resolve(__dirname, "js/login.ts"),
        // Add more entry points here as needed
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },

    // Rollup options
    rollupOptions: {
      // Don't bundle external dependencies
      external: [],

      output: {
        // Ensure clean output without module wrapper
        format: "es",
        entryFileNames: "[name].js",

        // Don't add hash to filenames
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },

    // Target modern browsers
    target: "es2022",

    // Don't minify for easier debugging
    minify: false,
  },

  // TypeScript configuration
  esbuild: {
    target: "es2022",
    format: "esm",
  },
})
