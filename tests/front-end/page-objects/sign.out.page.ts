import { BasePage } from './base.page'
import { Locator, Page } from '@playwright/test'
import { getEnv } from '../../../configs/env'
import { getSignOutSelectors } from './selectors/sign.out.selectors'

export class SignOutPage extends BasePage {
  public readonly logOutPage: Locator
  public readonly clickHereLink: Locator
  public readonly userTableRow: Locator
  constructor(page: Page) {
    super(page)
    const env = getEnv()
    const selectors = getSignOutSelectors(env)
    this.logOutPage = page.locator(selectors.logOutPage)
    this.clickHereLink = page.getByRole('link', {
      name: selectors.clickHereLink
    })
    this.userTableRow = page.locator(selectors.userTableRow)
  }
}
