import { BasePage } from './base.page'
import { Locator, Page } from '@playwright/test'
import { getCattleDeathsSelectors } from './selectors/cattle.deaths.selectors'
import { getEnv } from '../../../configs/env'

export class CattleDeathsPage extends BasePage {
  public readonly yearDropdown: Locator
  public readonly monthDropdown: Locator
  public readonly downloadButton: Locator
  public readonly reportDownloadSuccessBanner: Locator
  public readonly requestAnotherReportLink: Locator

  constructor(page: Page) {
    super(page)
    const env = getEnv()
    const selectors = getCattleDeathsSelectors(env)
    this.yearDropdown = page.locator(selectors.yearDropdown)
    this.monthDropdown = page.locator(selectors.monthDropdown)
    this.downloadButton = page.getByRole('button', {
      name: selectors.downloadButton
    })
    this.reportDownloadSuccessBanner = page.locator(
      selectors.reportDownloadSuccessBanner
    )
    this.requestAnotherReportLink = page.locator(
      selectors.requestAnotherReportLink
    )
  }
}
