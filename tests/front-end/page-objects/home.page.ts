import { BasePage } from './base.page'
import { Locator, Page } from '@playwright/test'
import { getHomeSelectors } from './selectors/home.selectors'
import { getEnv } from '../../../configs/env'

export class HomePage extends BasePage {
  public readonly startNowButton: Locator

  constructor(page: Page) {
    super(page)
    const env = getEnv()
    const selectors = getHomeSelectors(env)
    this.startNowButton = page.locator(selectors.startNowButton)
  }

  public async navigateToHomePage() {
    await this.goto('/')
  }
}
