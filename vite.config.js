import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ai_evaluation: resolve(__dirname, 'ai-evaluation.html'),
        propostas: resolve(__dirname, 'cases/automacao-propostas/index.html'),
        renovacao: resolve(__dirname, 'cases/renovacao-lembretes-calendario/index.html'),
        antigravity: resolve(__dirname, 'cases/desenvolvimento-assistido-antigravity/index.html'),
        landing_raphael: resolve(__dirname, 'cases/landing-page-raphael-seguros/index.html'),
        financeiro: resolve(__dirname, 'cases/organizador-financeiro/index.html'),
      },
    },
  },
});
