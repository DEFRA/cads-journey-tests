import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { defineConfig, devices } from '@playwright/test'
import type { GitHubActionOptions } from '@estruyf/github-actions-reporter'
import { ReporterDescription } from 'playwright/test'

// Set Environment
const ENV = process.env.ENVIRONMENT ?? 'local'
const isLocal = ENV === 'local'

// Only load env files for local + docker
let envFile: string | null = null

if (ENV === 'local') envFile = '.env'
if (ENV === 'docker') envFile = '.env.docker'

if (envFile && fs.existsSync(envFile)) {
  dotenv.config({ path: envFile })
}

// Read values from environment variables
const ui = process.env.CADS_MIP_FRONTEND_BASE_URL
const api = process.env.CADS_CDS_BACKEND_BASE_URL
const apiExt = process.env.CADS_CDS_BACKEND_EXTERNAL_BASE_URL ?? ''
const isCDPEnvironment = ENV === 'dev' || ENV === 'test'

process.env.apiURL = api
process.env.apiURLExt = apiExt
process.env.apiKey =
  !process.env.CI && ENV === 'dev' && process.env.CDP === undefined
    ? 'API_KEY'
    : undefined
const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY
if (proxy) {
  console.log('Proxy:', proxy)
}
const reporters: ReporterDescription[] = [
  ['list'], // CLI console output
  [
    'html',
    {
      outputFolder: './playwright-report/html',
      open: isCDPEnvironment ? 'never' : 'on-failure'
    }
  ],
  ['json', { outputFile: './playwright-report/results.json' }],
  ['allure-playwright', { reportDir: '/app/allure-report' }]
]

// Enable GitHub reporter ONLY inside GitHub Actions runner
if (process.env.GITHUB_ACTIONS === 'true') {
  reporters.push([
    '@estruyf/github-actions-reporter',
    <GitHubActionOptions>{
      title: `Journey Tests on environment: ${ENV}`,
      useDetails: true,
      showError: true
    }
  ])
}

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
  reporter: reporters,

  use: {
    baseURL: ui,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    proxy: proxy ? { server: proxy } : undefined
  },
  // Configure projects for major browsers.
  projects: [
    // Auth setup that writes `playwright/.auth/user.json`
    { name: 'setup', testDir: 'tests/fixtures', testMatch: 'setup.ts' },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json'
      },
      dependencies: ['setup'],
      testIgnore: ['**/login.spec.ts']
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
