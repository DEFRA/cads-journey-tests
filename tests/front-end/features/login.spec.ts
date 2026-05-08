import { test } from '../../fixtures/test.fixture'

test.describe('UI', () => {
  test('Logout from the application', async ({ loginPageStepDefinitions }) => {
    await loginPageStepDefinitions.INaviagteToLoginPage()
    await loginPageStepDefinitions.ILoginWithValidCredentials(
      process.env.CADS_MIP_DEFAULT_USER_EMAIL!,
      process.env.CADS_MIP_DEFAULT_USER_PASSWORD!
    )
    await loginPageStepDefinitions.ISignedOutSuccessfullyFromTheApplication()
  })
})
