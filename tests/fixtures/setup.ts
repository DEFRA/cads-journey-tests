import { test as setup } from './test.fixture'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page, loginPageStepDefinitions }) => {
  await loginPageStepDefinitions.INaviagteToLoginPage()
  await loginPageStepDefinitions.ILoginWithValidCredentials(
    process.env.CADS_MIP_FRONTEND_USERNAME!,
    process.env.CADS_MIP_FRONTEND_PASSWORD!
  )

  await page.context().storageState({ path: authFile })
})
