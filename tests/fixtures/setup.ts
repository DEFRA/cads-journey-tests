import { AuthFile } from '../utils/enums'
import { test as setup } from './test.fixture'

setup(
  'authenticate',
  async ({ page, loginPageStepDefinitions, dashboardPageStepDefinitions }) => {
    await loginPageStepDefinitions.INaviagteToLoginPage()
    await loginPageStepDefinitions.ILoginWithValidCredentials(
      process.env.CADS_MIP_FRONTEND_USERNAME!,
      process.env.CADS_MIP_FRONTEND_PASSWORD!
    )
    await dashboardPageStepDefinitions.IHaveLandedOnTheDashboardPage()
    await page.context().storageState({ path: AuthFile.User })
  }
)
