
import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';

const s_PACKAGE_ID = 'modules/sheet-only';

export default defineConfig({
  root: 'src',
  base: `/${s_PACKAGE_ID}/`,
  publicDir: false,
  server: {
    port: 30001,
    open: '/game',
    proxy: {
      // Serves static files from main Foundry server.
      [`^(/${s_PACKAGE_ID}/(assets|lang|packs|style.css))`]: 'http://localhost:30000',

      // All other paths besides package ID path are served from main Foundry server.
      [`^(?!/${s_PACKAGE_ID}/)`]: 'http://localhost:30000',

      // Enable socket.io from main Foundry server.
      '/socket.io': {target: 'ws://localhost:30000', ws: true}
    }
  },
  build: {
    outDir: __dirname + "/dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: 'src/index.js',
      output: {
        entryFileNames: 'index.js'
      },
      plugins: [
        // Copies additional files
        copy({
          targets: [
            { src: 'module.json', dest: 'dist/'},
            { src: 'LICENSE', dest: 'dist/'},
            { src: 'styles/*', dest: 'dist/styles'},
            { src: 'templates/*', dest: 'dist/templates'},
            {src: 'lang/*', dest: 'dist/lang'},
          ],
          hook: 'writeBundle',
        }),
      ],
    },
  },
});