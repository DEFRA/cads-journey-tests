import { test } from '../../fixtures/test.fixture'

test.describe('UI', () => {
  test('Home page', async ({ homePageStepDefinitions }) => {
    await homePageStepDefinitions.INaviagteToHomePage()
    await homePageStepDefinitions.IHaveLandedOnTheHomePage()
  })

  test('Navigate to dashboard page', async ({
    homePageStepDefinitions,
    dashboardPageStepDefinitions
  }) => {
    await homePageStepDefinitions.INaviagteToHomePage()
    await homePageStepDefinitions.IHaveLandedOnTheHomePage()
    await homePageStepDefinitions.NavigateToDashboardPage()
    await dashboardPageStepDefinitions.IHaveLandedOnTheDashboardPage()
  })
})
