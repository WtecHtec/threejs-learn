import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path';

import addIdPlugin from './add-id-plugin';

const root = path.resolve(__dirname, 'src/html');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [addIdPlugin(), react()],
  root,
  build: {
    cssCodeSplit: true,
    assetsDir: `./assets`,
    outDir: resolve(__dirname,'dist'),
    rollupOptions: {
      input: {
        // helloword: path.resolve(root, './helloworld/index.html' ),
        base: path.resolve(root, './picker/index.html' ),
      },
      output: {
        dir: './dist'
      },
    },
  },
})
