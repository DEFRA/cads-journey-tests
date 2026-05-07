import { LoginPage } from '../page-objects/login.page'
import { expect } from '@playwright/test'
import { getEnv } from '../../../configs/env'

export class LoginPageStepDefinitions {
  private readonly loginPage: LoginPage
  constructor(loginPage: LoginPage) {
    this.loginPage = loginPage
  }

  async INaviagteToLoginPage() {
    await this.loginPage.navigateToLoginPage()
  }

  async ILoginWithValidCredentials(username: string, password: string) {
    const env = getEnv()
    if (env === 'local') {
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

  async ISignedOutSuccessfullyFromTheApplication() {
    await this.loginPage.signedOutButton.click()
    await this.loginPage.hereLink.click()
    await expect(this.loginPage.signInButton).toBeVisible()
    await expect(this.loginPage.heading).toHaveText('Home')
  }
}
