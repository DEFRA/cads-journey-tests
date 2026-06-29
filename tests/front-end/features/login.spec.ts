import { test } from '../../fixtures/test.fixture'

test.describe('UI', () => {
  test('Logout from the application', async ({ loginPageStepDefinitions }) => {
    await loginPageStepDefinitions.INaviagteToLoginPage()
    await loginPageStepDefinitions.ILoginWithValidCredentials(
      process.env.CADS_MIP_FRONTEND_USERNAME!,
      process.env.CADS_MIP_FRONTEND_PASSWORD!
    )
  })
})
