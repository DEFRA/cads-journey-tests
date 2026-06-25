import { expect } from '@playwright/test'
import { SignOutPage } from '../page-objects/sign.out.page'
import { HomePage } from '../page-objects/home.page'

export class SignOutPageStepDefinitions {
  private readonly signOutPage: SignOutPage
  private readonly homePage: HomePage
  constructor(signOutPage: SignOutPage, homePage: HomePage) {
    this.signOutPage = signOutPage
    this.homePage = homePage
  }

  async ISignedOutSuccessfullyFromTheApplication() {
    await this.signOutPage.signOutLink.click()
    await this.signOutPage.clickHereLink.click()
    await expect(this.homePage.heading).toHaveText('Home')
    await expect(this.homePage.signInButton).toBeVisible()
  }
}
