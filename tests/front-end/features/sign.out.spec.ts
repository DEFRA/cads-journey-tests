import { test } from '../../fixtures/test.fixture'

test.describe('Sign Out Journey Tests @UI', () => {
  test(
    'Sign out from the application',
    {
      tag: ['@Smoke']
    },
    async ({ signOutPageStepDefinitions, dashboardPageStepDefinitions }) => {
      await dashboardPageStepDefinitions.INaviagteToDashboardPage()
      await signOutPageStepDefinitions.ISignedOutSuccessfullyFromTheApplication()
    }
  )
})
