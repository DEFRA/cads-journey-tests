import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { CattleRegistrationsPage } from '../page-objects/cattle.registrations.page'
import { HomePage } from '../page-objects/home.page'
import { DashboardPage, REPORT_TITLES } from '../page-objects/dashboard.page'
import { Download, expect } from '@playwright/test'

export class CattleRegistrationsPageStepDefinitions {
  private readonly cattleRegistrationsPage: CattleRegistrationsPage
  private readonly homePage: HomePage
  private readonly dashboardPage: DashboardPage
  private download?: Download
  private downloadPath?: string

  constructor(
    cattleRegistrationsPage: CattleRegistrationsPage,
    homePage: HomePage,
    dashboardPage: DashboardPage
  ) {
    this.cattleRegistrationsPage = cattleRegistrationsPage
    this.homePage = homePage
    this.dashboardPage = dashboardPage
  }

  async INaviagteToCattleRegistrationsPage() {
    await this.cattleRegistrationsPage.goto('/')
    await this.homePage.startNowButton.click()
    await this.dashboardPage
      .getReport(REPORT_TITLES.GB_CATTLE_REGISTRATIONS)
      .click()
  }

  async IDownloadTheReport() {
    await this.cattleRegistrationsPage.yearDropdown.selectOption('2025')
    await this.cattleRegistrationsPage.monthDropdown.selectOption('January')
    const downloadPromise =
      this.cattleRegistrationsPage.page.waitForEvent('download')
    await this.cattleRegistrationsPage.downloadButton.click()
    this.download = await downloadPromise
    this.downloadPath = path.join(
      os.tmpdir(),
      `cads-download-${Date.now()}-${this.download.suggestedFilename()}`
    )
    await this.download.saveAs(this.downloadPath)
  }

  async TheReportDownloadedSuccessfully() {
    await expect(
      this.cattleRegistrationsPage.reportDownloadSuccessBanner
    ).toBeVisible()
    if (!this.downloadPath) {
      throw new Error('Download should be saved in IDownloadTheReport')
    }
    expect(fs.existsSync(this.downloadPath)).toBe(true)
    expect(this.cattleRegistrationsPage.downloadButton).toBeDisabled()
    await this.cattleRegistrationsPage.requestAnotherReportLink.click()
    await expect(this.cattleRegistrationsPage.downloadButton).toBeEnabled()
  }
}
