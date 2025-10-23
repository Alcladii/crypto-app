import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   sourcemap: true,
  // },
  server: {
    host: true, // or '0.0.0.0'
    port: 5173,
  },

})
