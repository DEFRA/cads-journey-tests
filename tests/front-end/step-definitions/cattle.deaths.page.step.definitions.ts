import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { HomePage } from '../page-objects/home.page'
import { DashboardPage, REPORT_TITLES } from '../page-objects/dashboard.page'
import { Download, expect } from '@playwright/test'
import { CattleDeathsPage } from '../page-objects/cattle.deaths.page'

export class CattleDeathsPageStepDefinitions {
  private readonly cattleDeathsPage: CattleDeathsPage
  private readonly homePage: HomePage
  private readonly dashboardPage: DashboardPage
  private download?: Download
  private downloadPath?: string

  constructor(
    cattleDeathsPage: CattleDeathsPage,
    homePage: HomePage,
    dashboardPage: DashboardPage
  ) {
    this.cattleDeathsPage = cattleDeathsPage
    this.homePage = homePage
    this.dashboardPage = dashboardPage
  }

  async INaviagteToCattleDeathsPage() {
    await this.cattleDeathsPage.goto('/')
    await this.homePage.dashboardTab.click()
    await this.dashboardPage.getReport(REPORT_TITLES.GB_CATTLE_DEATHS).click()
  }

  async IDownloadTheReport() {
    await this.cattleDeathsPage.yearDropdown.selectOption('2025')
    await this.cattleDeathsPage.monthDropdown.selectOption('January')
    const downloadPromise = this.cattleDeathsPage.page.waitForEvent('download')
    await this.cattleDeathsPage.downloadButton.click()
    this.download = await downloadPromise
    this.downloadPath = path.join(
      os.tmpdir(),
      `cads-download-${Date.now()}-${this.download?.suggestedFilename()}`
    )
    await this.download?.saveAs(this.downloadPath)
  }

  async TheReportDownloadedSuccessfully() {
    await expect(
      this.cattleDeathsPage.reportDownloadSuccessBanner
    ).toBeVisible()
    if (!this.downloadPath) {
      throw new Error('Download should be saved in IDownloadTheReport')
    }
    expect(fs.existsSync(this.downloadPath)).toBe(true)
    expect(this.cattleDeathsPage.downloadButton).toBeDisabled()
    await this.cattleDeathsPage.requestAnotherReportLink.click()
    await expect(this.cattleDeathsPage.downloadButton).toBeEnabled()
  }
}
