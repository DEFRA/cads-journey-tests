/* eslint-disable no-console */
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface PlaywrightTest {
  title: string
  status: 'passed' | 'failed' | 'skipped'
  error?: string
}

interface Spec {
  tests: PlaywrightTest[]
}

interface Suite {
  suites?: Suite[]
  specs?: Spec[]
}

interface PlaywrightReport {
  suites: Suite[]
  stats?: {
    total: number
    passed: number
    failed: number
    skipped: number
  }
}

const webhookUrl = process.env.SLACK_WEBHOOK_URL

if (!webhookUrl) {
  console.error('SLACK_WEBHOOK_URL not set')
  process.exit(1)
}

// Path to the Playwright JSON report
const reportPath = path.resolve(__dirname, 'playwright-report/results.json')
if (!fs.existsSync(reportPath)) {
  console.error('Playwright report not found:', reportPath)
  process.exit(1)
}

const report: PlaywrightReport = JSON.parse(
  fs.readFileSync(reportPath, 'utf-8')
)

// Flatten all tests
function getAllTests(suites: Suite[] = []): PlaywrightTest[] {
  const tests: PlaywrightTest[] = []

  for (const suite of suites) {
    // Collect tests in this suite's specs
    if (suite.specs) {
      for (const spec of suite.specs) {
        if (spec.tests) {
          tests.push(...spec.tests)
        }
      }
    }
    // Recurse into nested suites
    if (suite.suites) {
      tests.push(...getAllTests(suite.suites))
    }
  }

  return tests
}
const allTests = getAllTests(report.suites)

const failedTests = allTests.filter((t) => t.status === 'failed')

const message =
  failedTests.length === 0
    ? {
        text: `✅ All Playwright tests passed! (${report.stats?.total ?? allTests.length} tests)`
      }
    : {
        text: `❌ Playwright tests failed!\n${failedTests.map((t) => `• ${t.title}`).join('\n')}`
      }
message.text = message.text + '\n' + process.env.BUILD_URL
// Post to Slack
axios
  .post(webhookUrl, message)
  .then(() => console.log('Slack notification sent!'))
  .catch((err) => console.error('Error posting to Slack:', err))
