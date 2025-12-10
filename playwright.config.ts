import { defineConfig } from '@playwright/test';
import { loadConfig } from './utils/configLoader';

const cfg = loadConfig();


export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,

  use: {
    baseURL: 'http://localhost:4200',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
  },

  reporter: [['html'], ['list']],

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
