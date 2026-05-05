import { DashboardPage } from '../page-objects/dashboard.page'
import { expect } from '@playwright/test'

export class DashboardPageStepDefinitions {
  private readonly dashboardPage: DashboardPage
  constructor(dashboardPage: DashboardPage) {
    this.dashboardPage = dashboardPage
  }

  async INaviagteToDashboardPage() {
    await this.dashboardPage.navigateToDashboardPage()
  }

  async IHaveLandedOnTheDashboardPage() {
    await expect(this.dashboardPage.heading).toBeVisible()
    await expect(this.dashboardPage.heading).toHaveText('Dashboard')
  }

  async TheDashboardPageDisplaysCorrectContent() {
    const breadcrumbs = await this.dashboardPage.breadcrumbs
      .allTextContents()
      .then((texts) => texts.map((text) => text.trim()))
    expect(breadcrumbs).toContain('Home')
    expect(breadcrumbs).toContain('Dashboard')
  }

  async TheDashboardPageNavigatesToCorrectReport() {
    const reportLinks = (await this.dashboardPage.reports.all()).slice(0, 4)
    const reportTitles = await this.dashboardPage.getReportsTextContents()
    for (const [index, reportLink] of reportLinks.entries()) {
      await reportLink.click()
      expect((await this.dashboardPage.heading.textContent())!).toContain(
        reportTitles.at(index)!
      )
      await this.dashboardPage.page.goBack()
    }
  }
}
