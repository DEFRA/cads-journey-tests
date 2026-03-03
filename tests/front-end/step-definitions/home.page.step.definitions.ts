import { HomePage } from '../page-objects/home.page'
import { expect } from '@playwright/test'

export class HomePageStepDefinitions {
  private readonly homePage: HomePage
  constructor(homePage: HomePage) {
    this.homePage = homePage
  }

  async INaviagteToHomePage() {
    await this.homePage.navigateToHomePage()
  }

  async IHaveLandedOnTheHomePage() {
    await expect(this.homePage.heading).toBeVisible()
    await expect(this.homePage.heading).toHaveText('Home')
  }
}
