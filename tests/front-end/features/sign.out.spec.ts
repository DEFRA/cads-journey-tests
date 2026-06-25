import { test } from '../../fixtures/test.fixture'

test.describe('UI', () => {
  test('Sign out from the application', async ({
    signOutPageStepDefinitions,
    dashboardPageStepDefinitions
  }) => {
    await dashboardPageStepDefinitions.INaviagteToDashboardPage()
    await signOutPageStepDefinitions.ISignedOutSuccessfullyFromTheApplication()
  })
})
