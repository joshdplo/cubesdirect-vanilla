import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    manifest: false,
    outDir: '../public',
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: 'src/main.js',
      output: {
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].[ext]',
        entryFileNames: '[name].js'
      }
    }
  }
});