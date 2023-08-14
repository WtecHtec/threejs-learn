import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from "vite-plugin-glsl"

import path, { resolve } from 'path';

const root = path.resolve(__dirname, 'src/html');


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), glsl()],
  root,
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
        helloword: path.resolve(root, './helloworld/index.html' ),
        shadow: path.resolve(root, './shadow/index.html' )
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
