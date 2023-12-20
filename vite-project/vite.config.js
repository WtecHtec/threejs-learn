import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from "vite-plugin-glsl"
import requireTransform from 'vite-plugin-require-transform';
import path, { resolve } from 'path';
// import htmlPlugin from 'vite-plugin-html';
import addIdPlugin from './add-id-plugin';

const root = path.resolve(__dirname, 'src/html');


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [addIdPlugin(), vue(), glsl(), requireTransform({
    fileRegex: /.js$|.vue$/
  }),],
  root,
  resolve: {
    alias: {
      "@": resolve(__dirname,'./src'),
    },
  },
  optimizeDeps: {
    include: ['vite-plugin-html']
  },
  build: {
    cssCodeSplit: true,
    assetsDir: `./assets`,
    outDir: resolve(__dirname,'dist'),
    rollupOptions: {
      input: {
        // helloword: path.resolve(root, './helloworld/index.html' ),
        base: path.resolve(root, './base/index.html' ),
      },
      output: {
        dir: './dist'
      },
    },
  },
  configureWebpack: (config) => {
    console.log('config.module.rules==', config.module.rules)
    config.module.rules.push({
      test: /\.glsl$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "raw-loader",
        },
      ],
    });
  },
})
