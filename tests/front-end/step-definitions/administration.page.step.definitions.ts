import { expect } from '@playwright/test'
import { AdministrationPage } from '../page-objects/administration.page'

export class AdministrationPageStepDefinitions {
  private readonly administrationPage: AdministrationPage
  constructor(administrationPage: AdministrationPage) {
    this.administrationPage = administrationPage
  }

  async INaviagteToAdministrationPage() {
    await this.administrationPage.administrationTab.click()
  }

  async IHaveLandedOnTheAdministrationPage() {
    await expect(this.administrationPage.heading).toBeVisible()
    await expect(this.administrationPage.heading).toHaveText('Administration')
  }
}
