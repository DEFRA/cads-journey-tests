import { expect } from '@playwright/test'
import { SignOutPage } from '../page-objects/sign.out.page'
import { HomePage } from '../page-objects/home.page'
import { TestEnv } from '../../../configs/env'

export class SignOutPageStepDefinitions {
  private readonly signOutPage: SignOutPage
  private readonly homePage: HomePage
  private readonly env: TestEnv
  constructor(signOutPage: SignOutPage, homePage: HomePage, env: TestEnv) {
    this.signOutPage = signOutPage
    this.homePage = homePage
    this.env = env
  }

  async ISignedOutSuccessfullyFromTheApplication() {
    if (this.env === 'local') {
      await this.signOutPage.signOutLink.click()
      await this.signOutPage.clickHereLink.click()
      await expect(this.homePage.heading).toHaveText('Home')
      await expect(this.homePage.signInButton).toBeVisible()
    } else {
      await this.signOutPage.signOutLink.click()
      await this.signOutPage.userTableRow.waitFor({ state: 'visible' })
      await this.signOutPage.userTableRow.click()
      await this.signOutPage.heading.waitFor({ state: 'visible' })
      await expect(this.homePage.heading).toHaveText('Home')
      await expect(this.homePage.signInButton).toBeVisible()
    }
  }
}
