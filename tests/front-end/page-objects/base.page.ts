import { Locator, Page } from '@playwright/test'

export class BasePage {
  public page: Page
  public readonly heading: Locator
  public readonly dashboardTab: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByTestId('app-heading-title')
    this.dashboardTab = page.getByRole('link', { name: 'Dashboard' })
  }

  async goto(path: string) {
    await this.page.goto(path)
  }

  async getTitle() {
    return await this.page.title()
  }
}
