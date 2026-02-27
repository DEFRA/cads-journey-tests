import { defineConfig, devices } from '@playwright/test'
import type { GitHubActionOptions } from '@estruyf/github-actions-reporter'

// Set Environment
// process.env.ENV = 'dev'

const ENV = process.env.ENV ?? 'local'
const isLocal = ENV === 'local'
const configByEnv = {
  local: {
    ui: 'http://127.0.0.1:3000',
    api: 'http://127.0.0.1:5555'
  },
  dev: {
    ui: 'DEV_URL',
    api: 'DEV_URL'
  }
}
const { ui, api } = configByEnv[ENV as keyof typeof configByEnv]
process.env.apiURL = api
process.env.apiKey = !process.env.CI && ENV === 'dev' ? 'API_KEY' : undefined

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',
  testMatch: '**/*.spec.ts',

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['list'], // CLI console output
    ['html', { outputFolder: 'playwright-report/html' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    [
      '@estruyf/github-actions-reporter',
      <GitHubActionOptions>{
        title: 'My custom title',
        useDetails: true,
        showError: true
      }
    ]
    // ['junit', { outputFile: 'report/results.xml' }]
  ],

  use: {
    baseURL: ui,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  // Run your local dev server before starting the tests.
  // Include these *only if LOCAL=true*
  ...(isLocal
    ? [
        {
          name: 'frontend-server',
          webServer: {
            command: 'cd {PATH TO PROJECT} && npm run dev',
            port: 3000,
            reuseExistingServer: true
          }
        },
        {
          name: 'backend-server',
          webServer: {
            command:
              'cd {PATH TO PROJECT} && docker-compose -f docker-compose.yml -f docker-compose.override.mac.arm.yml up --build',
            port: 5555,
            reuseExistingServer: true
          }
        }
      ]
    : [])
})
