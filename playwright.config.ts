import { defineConfig, devices } from '@playwright/test'
import type { GitHubActionOptions } from '@estruyf/github-actions-reporter'

// Set Environment
// process.env.ENVIRONMENT = 'dev'

const ENV = process.env.ENVIRONMENT ?? 'local'
const isLocal = ENV === 'local'

const configByEnv = {
  local: {
    ui: 'http://localhost:3000',
    api: 'http://localhost:5555'
  },
  docker: {
    ui: 'http://127.0.0.1:3000',
    api: 'http://127.0.0.1:5555'
  },
  dev: {
    ui: 'https://cads-mis.dev.cdp-int.defra.cloud',
    api: 'https://cads-data-service.dev.cdp-int.defra.cloud'
  },
  test: {
    ui: 'https://cads-mis.test.cdp-int.defra.cloud',
    api: 'https://cads-data-service.test.cdp-int.defra.cloud'
  }
}
const { ui, api } = configByEnv[ENV as keyof typeof configByEnv]
process.env.apiURL = api
process.env.apiKey = !process.env.CI && ENV === 'dev' ? 'API_KEY' : undefined
const isCDPEnvironment = ENV === 'dev' || ENV === 'test'

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
    [
      'html',
      {
        outputFolder: 'playwright-report/html',
        open: isCDPEnvironment ? 'never' : 'on-failure'
      }
    ],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['allure-playwright', { reportDir: 'allure-report' }],
    [
      '@estruyf/github-actions-reporter',
      <GitHubActionOptions>{
        title: 'Journey Tests on environment: ' + ENV,
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
