import { BasePage } from './base.page'
import { Locator, Page } from '@playwright/test'
import { getLoginSelectors } from './selectors/login.selectors'
import { getEnv } from '../../../configs/env'

export class LoginPage extends BasePage {
  public readonly usernameInput: Locator
  public readonly passwordInput: Locator
  public readonly loginButton: Locator
  public readonly signInButton: Locator
  public readonly signedOutButton: Locator
  public readonly hereLink: Locator

  constructor(page: Page) {
    super(page)
    const env = getEnv()
    console.log('env', env)
    const selectors = getLoginSelectors(env)
    this.usernameInput = page.locator(selectors.usernameInput)
    this.passwordInput = page.locator(selectors.passwordInput)
    this.loginButton = page.getByRole('button', { name: selectors.loginButton })
    this.signInButton = page.getByRole('link', { name: selectors.signInButton })
    this.signedOutButton = page.getByRole('link', {
      name: selectors.signedOutButton
    })
    this.hereLink = page.getByRole('link', { name: selectors.hereLink })
  }

  public async navigateToLoginPage() {
    await this.goto('/')
    await this.signInButton.click()
  }
}
