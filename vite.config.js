import { defineConfig } from "vite"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

// Plugin to copy CSS files
const copyCssPlugin = () => {
  return {
    name: "copy-css",
    generateBundle() {
      // Ensure dist/css directory exists
      mkdirSync(resolve(__dirname, "dist/css"), { recursive: true })
      
      // Copy all CSS files from css/ to dist/css/
      const cssDir = resolve(__dirname, "css")
      try {
        const files = readdirSync(cssDir)
        files.forEach(file => {
          if (file.endsWith(".css")) {
            const srcPath = resolve(cssDir, file)
            const destPath = resolve(__dirname, "dist/css", file)
            copyFileSync(srcPath, destPath)
            console.log(`📄 Copied ${file} to dist/css/`)
          }
        })
      } catch (error) {
        console.warn("No CSS directory found or error copying CSS files:", error.message)
      }
    }
  }
}

export default defineConfig({
  // Build configuration
  build: {
    // Output directory for built files
    outDir: "dist",

    // Don't clean the output directory to preserve our CSS files
    emptyOutDir: false,

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

  plugins: [copyCssPlugin()],
})
