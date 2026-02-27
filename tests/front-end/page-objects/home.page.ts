import { BasePage } from './base.page'

export class HomePage extends BasePage {
  public async navigateToHomePage() {
    await this.goto('/')
  }
}
