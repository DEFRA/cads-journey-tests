import { Locator, Page } from '@playwright/test'
import { BasePage } from './base.page'
import { getDashboardSelectors } from './selectors/dashboard.selectors'
import { getEnv } from '../../../configs/env'

export class DashboardPage extends BasePage {
  public readonly breadcrumbs: Locator
  public readonly reports: Locator
  constructor(page: Page) {
    super(page)
    const env = getEnv()
    const selectors = getDashboardSelectors(env)
    this.breadcrumbs = page.locator(selectors.breadcrumbs)
    this.reports = page.locator(selectors.reports)
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
}
