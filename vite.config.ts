import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { zipExtensions } from './plugins/zipExtensions'

export default defineConfig({
  plugins: [react(), tailwindcss(), zipExtensions()],
})
