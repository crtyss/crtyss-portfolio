import { defineConfig } from '@playwright/test'
import { existsSync } from 'node:fs'
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
export default defineConfig({
  testDir: './tests', workers: 1, timeout: 45000, reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:3111', reducedMotion: 'reduce', launchOptions: { executablePath: process.env.CHROME_BIN || (existsSync(chrome) ? chrome : undefined) } },
  webServer: { command: 'node tests/serve.mjs', url: 'http://127.0.0.1:3111/api/admin/session', reuseExistingServer: false },
  projects: [{ name: 'desktop', use: { viewport: { width: 1440, height: 900 } } }, { name: 'mobile', use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } }],
})
