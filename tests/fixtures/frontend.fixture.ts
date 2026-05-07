import { test as base } from '@playwright/test'
import { HomePageStepDefinitions } from '../front-end/step-definitions/home.page.step.definitions'
import { HomePage } from '../front-end/page-objects/home.page'
import { DashboardPage } from '../front-end/page-objects/dashboard.page'
import { DashboardPageStepDefinitions } from '../front-end/step-definitions/dashboard.page.step.definitions'
import { LoginPageStepDefinitions } from '../front-end/step-definitions/login.page.step.definitions'
import { LoginPage } from '../front-end/page-objects/login.page'

// Declare the types of your fixtures.
type FrontendStepDefinitions = {
  homePageStepDefinitions: HomePageStepDefinitions
  loginPageStepDefinitions: LoginPageStepDefinitions
  dashboardPageStepDefinitions: DashboardPageStepDefinitions
}
// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const frontendTests = base.extend<FrontendStepDefinitions>({
  homePageStepDefinitions: async ({ page }, use) => {
    const homePageStepDefinitions = new HomePageStepDefinitions(
      new HomePage(page)
    )
    await use(homePageStepDefinitions)
  },
  loginPageStepDefinitions: async ({ page }, use) => {
    const loginPageStepDefinitions = new LoginPageStepDefinitions(
      new LoginPage(page)
    )
    await use(loginPageStepDefinitions)
  },
  dashboardPageStepDefinitions: async ({ page }, use) => {
    const dashboardPageStepDefinitions = new DashboardPageStepDefinitions(
      new DashboardPage(page)
    )
    await use(dashboardPageStepDefinitions)
  }
})
