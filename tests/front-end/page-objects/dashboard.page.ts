import { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'
import { getDashboardSelectors } from './selectors/dashboard.selectors'
import { getEnv } from '../../../configs/env'

export const REPORT_TITLES = {
  GB_CATTLE_REGISTRATIONS: 'GB cattle registrations',
  GB_CATTLE_DEATHS: 'GB cattle deaths',
  GB_CATTLE_IMPORTS: 'GB cattle imports'
} as const

export type ReportTitle = (typeof REPORT_TITLES)[keyof typeof REPORT_TITLES]

export class DashboardPage extends BasePage {
  public readonly breadcrumbs: Locator
  public readonly reports: Locator
  public readonly reportTitles: Locator
  constructor(page: Page) {
    super(page)
    const env = getEnv()
    const selectors = getDashboardSelectors(env)
    this.breadcrumbs = page.locator(selectors.breadcrumbs)
    this.reports = page.locator(selectors.reports)
    this.reportTitles = page.getByTestId(selectors.reportTitles)
  }

  public async navigateToDashboardPage() {
    await this.goto('/dashboard')
  }

  public async getReportsTextContents() {
    return await this.reports.allTextContents().then((texts) =>
      texts.map((text) =>
        text
          .replace(/\s*\(.*?\)/g, '')
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      )
    )
  }

  public getReport(reportTitle: ReportTitle): Locator {
    return this.reportTitles.filter({ hasText: reportTitle })
  }
}
