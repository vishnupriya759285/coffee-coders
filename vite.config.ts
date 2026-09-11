import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
  optimizeDeps: {
    include: ['@huggingface/transformers'],
  },
});
