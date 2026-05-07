import { test } from '../../fixtures/test.fixture'

test.describe('UI', () => {
  test('Dashboard page', async ({ dashboardPageStepDefinitions }) => {
    await dashboardPageStepDefinitions.INaviagteToDashboardPage()
    await dashboardPageStepDefinitions.IHaveLandedOnTheDashboardPage()
    await dashboardPageStepDefinitions.TheDashboardPageDisplaysCorrectContent()
    // await dashboardPageStepDefinitions.TheDashboardPageNavigatesToCorrectReport()
  })
})
