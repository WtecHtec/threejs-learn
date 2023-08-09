import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


import path, { resolve } from 'path';

const root = path.resolve(__dirname, 'src');


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: './src/html',
  resolve: {
    alias: {
      "@": resolve(__dirname,'./src'),
    },
  },
  build: {
    cssCodeSplit: true,
    assetsDir: `./assets`,
    outDir: resolve(__dirname,'dist'),
    rollupOptions: {
      input: {
        helloword: path.resolve(root, './html/helloworld/index.html' ),
        shadow: path.resolve(root, './html/shadow/index.html' )
      },
      output: {
        dir: './dist'
      },
    },
  },
})
