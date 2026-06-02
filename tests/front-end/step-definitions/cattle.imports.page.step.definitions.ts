import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { HomePage } from '../page-objects/home.page'
import { DashboardPage, REPORT_TITLES } from '../page-objects/dashboard.page'
import { Download, expect } from '@playwright/test'
import { CattleImportsPage } from '../page-objects/cattle.imports.page'

export class CattleImportsPageStepDefinitions {
  private readonly cattleImportsPage: CattleImportsPage
  private readonly homePage: HomePage
  private readonly dashboardPage: DashboardPage
  private download?: Download
  private downloadPath?: string

  constructor(
    cattleImportsPage: CattleImportsPage,
    homePage: HomePage,
    dashboardPage: DashboardPage
  ) {
    this.cattleImportsPage = cattleImportsPage
    this.homePage = homePage
    this.dashboardPage = dashboardPage
  }

  async INaviagteToCattleImportsPage() {
    await this.cattleImportsPage.goto('/')
    await this.homePage.startNowButton.click()
    await this.dashboardPage.getReport(REPORT_TITLES.GB_CATTLE_IMPORTS).click()
  }

  async IDownloadTheReport() {
    await this.cattleImportsPage.yearDropdown.selectOption('2025')
    await this.cattleImportsPage.monthDropdown.selectOption('January')
    const downloadPromise = this.cattleImportsPage.page.waitForEvent('download')
    await this.cattleImportsPage.downloadButton.click()
    this.download = await downloadPromise
    this.downloadPath = path.join(
      os.tmpdir(),
      `cads-download-${Date.now()}-${this.download?.suggestedFilename()}`
    )
    await this.download?.saveAs(this.downloadPath)
  }

  async TheReportDownloadedSuccessfully() {
    await expect(
      this.cattleImportsPage.reportDownloadSuccessBanner
    ).toBeVisible()
    if (!this.downloadPath) {
      throw new Error('Download should be saved in IDownloadTheReport')
    }
    expect(fs.existsSync(this.downloadPath)).toBe(true)
    expect(this.cattleImportsPage.downloadButton).toBeDisabled()
    await this.cattleImportsPage.requestAnotherReportLink.click()
    await expect(this.cattleImportsPage.downloadButton).toBeEnabled()
  }
}
