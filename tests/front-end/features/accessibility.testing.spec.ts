import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '../../fixtures/test.fixture'

const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

test.describe('Accessibility Tests', () => {
  test('pages should not have automatically detectable accessibility issues', async ({
    page,
    homePageStepDefinitions,
    dashboardPageStepDefinitions,
    cattleRegistrationsPageStepDefinitions,
    cattleDeathsPageStepDefinitions,
    cattleImportsPageStepDefinitions,
    administrationPageStepDefinitions
  }) => {
    const failures: {
      step: string
      url: string
      violations: unknown[]
    }[] = []

    async function scan(step: string) {
      const results = await new AxeBuilder({ page }).withTags(axeTags).analyze()
      console.log(page.url())
      if (results.violations.length > 0) {
        failures.push({
          step,
          url: page.url(),
          violations: results.violations
        })
      }
    }

    await test.step('Home Page', async () => {
      await homePageStepDefinitions.INaviagteToHomePage()
      await scan('Home Page')
    })

    await test.step('Dashboard Page', async () => {
      await dashboardPageStepDefinitions.INaviagteToDashboardPage()
      await scan('Dashboard Page')
    })

    await test.step('Cattle Registration Page', async () => {
      await cattleRegistrationsPageStepDefinitions.INaviagteToCattleRegistrationsPage()
      await scan('Cattle Registration Page')
    })

    await test.step('Cattle Deaths Page', async () => {
      await cattleDeathsPageStepDefinitions.INaviagteToCattleDeathsPage()
      await scan('Cattle Deaths Page')
    })

    await test.step('Cattle Imports Page', async () => {
      await cattleImportsPageStepDefinitions.INaviagteToCattleImportsPage()
      await scan('Cattle Imports Page')
    })

    await test.step('Administration Page', async () => {
      await administrationPageStepDefinitions.INaviagteToAdministrationPage()
      await scan('Administration Page')
    })

    // Report all violations together at the end (so we don't stop at the first failing page).
    expect(
      failures.map(({ step, url, violations }) => ({
        step,
        url,
        violationCount: violations.length,
        violationIds: (violations as { id: string }[]).map((v) => v.id)
      }))
    ).toEqual([])
  })
})
