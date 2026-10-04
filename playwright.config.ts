import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm run dev --workspace @todo/backend',
      url: 'http://127.0.0.1:3001/api/todos',
      reuseExistingServer: !process.env.CI,
      env: { PORT: '3001', CORS_ORIGIN: 'http://127.0.0.1:5173' },
    },
    {
      command: 'npm run dev --workspace @todo/frontend -- --host 127.0.0.1',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      env: { VITE_API_BASE_URL: 'http://127.0.0.1:3001' },
    },
  ],
});
