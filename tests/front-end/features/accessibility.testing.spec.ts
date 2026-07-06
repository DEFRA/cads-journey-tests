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
    await test.step('Home Page', async () => {
      await homePageStepDefinitions.INaviagteToHomePage()
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(axeTags)
        .analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    await test.step('Dashboard Page', async () => {
      await dashboardPageStepDefinitions.INaviagteToDashboardPage()
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(axeTags)
        .analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    await test.step('Cattle Registration Page', async () => {
      await cattleRegistrationsPageStepDefinitions.INaviagteToCattleRegistrationsPage()
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(axeTags)
        .analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    await test.step('Cattle Deaths Page', async () => {
      await cattleDeathsPageStepDefinitions.INaviagteToCattleDeathsPage()
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(axeTags)
        .analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    await test.step('Cattle Imports Page', async () => {
      await cattleImportsPageStepDefinitions.INaviagteToCattleImportsPage()
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(axeTags)
        .analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })

    await test.step('Administration Page', async () => {
      await administrationPageStepDefinitions.INaviagteToAdministrationPage()
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(axeTags)
        .analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
  })
})
