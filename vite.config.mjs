import fs from 'node:fs';
import { defineConfig } from 'vite';

const bundleFiles = fs.readdirSync('./src/js/bundles').map((file) => `src/js/bundles/${file}`);
console.log('----Bundle Files----');
console.log(bundleFiles);

export default defineConfig({
  root: 'src',
  build: {
    manifest: false,
    outDir: '../public',
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: ['src/main.js', ...bundleFiles],
      output: {
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js'
      }
    }
  }
});