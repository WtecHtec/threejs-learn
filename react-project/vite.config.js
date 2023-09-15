import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path';
const root = path.resolve(__dirname, 'src/html');
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root,
})
