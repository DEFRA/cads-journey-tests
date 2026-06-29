import { LoginPage } from '../page-objects/login.page'
import { getEnv, TestEnv } from '../../../configs/env'

export class LoginPageStepDefinitions {
  private readonly loginPage: LoginPage
  private readonly env: TestEnv
  constructor(loginPage: LoginPage) {
    this.loginPage = loginPage
    this.env = getEnv()
  }

  async INaviagteToLoginPage() {
    await this.loginPage.navigateToLoginPage()
  }

  async ILoginWithValidCredentials(username: string, password: string) {
    if (this.env === 'local') {
      await this.loginPage.usernameInput.fill(username)
      await this.loginPage.passwordInput.fill(password)
      await this.loginPage.loginButton.click()
    } else {
      await this.loginPage.usernameInput.fill(username)
      await this.loginPage.nextButton.click()
      await this.loginPage.passwordInput.fill(password)
      await this.loginPage.nextButton.click()
      await this.loginPage.nextButton.click()
    }
  }
}
