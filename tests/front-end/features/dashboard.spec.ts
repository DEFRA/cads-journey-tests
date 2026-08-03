import { test } from '../../fixtures/test.fixture'

test.describe('Dashboard Journey Tests @UI', () => {
  test('Dashboard page', async ({ dashboardPageStepDefinitions }) => {
    await dashboardPageStepDefinitions.INaviagteToDashboardPage()
    await dashboardPageStepDefinitions.IHaveLandedOnTheDashboardPage()
    await dashboardPageStepDefinitions.TheDashboardPageDisplaysCorrectContent()
  })
})
