import { test as base } from '@playwright/test'
import { HomePageStepDefinitions } from '../front-end/step-definitions/home.page.step.definitions'
import { HomePage } from '../front-end/page-objects/home.page'
import { DashboardPage } from '../front-end/page-objects/dashboard.page'
import { DashboardPageStepDefinitions } from '../front-end/step-definitions/dashboard.page.step.definitions'
import { LoginPageStepDefinitions } from '../front-end/step-definitions/login.page.step.definitions'
import { LoginPage } from '../front-end/page-objects/login.page'
import { CattleRegistrationsPageStepDefinitions } from '../front-end/step-definitions/cattle.registrations.page.step.definitions'
import { CattleRegistrationsPage } from '../front-end/page-objects/cattle.registrations.page'
import { CattleDeathsPageStepDefinitions } from '../front-end/step-definitions/cattle.deaths.page.step.definitions'
import { CattleDeathsPage } from '../front-end/page-objects/cattle.deaths.page'
import { CattleImportsPageStepDefinitions } from '../front-end/step-definitions/cattle.imports.page.step.definitions'
import { CattleImportsPage } from '../front-end/page-objects/cattle.imports.page'
// Declare the types of your fixtures.
type FrontendStepDefinitions = {
  homePageStepDefinitions: HomePageStepDefinitions
  loginPageStepDefinitions: LoginPageStepDefinitions
  dashboardPageStepDefinitions: DashboardPageStepDefinitions
  cattleRegistrationsPageStepDefinitions: CattleRegistrationsPageStepDefinitions
  cattleDeathsPageStepDefinitions: CattleDeathsPageStepDefinitions
  cattleImportsPageStepDefinitions: CattleImportsPageStepDefinitions
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
  },
  cattleRegistrationsPageStepDefinitions: async ({ page }, use) => {
    const cattleRegistrationsPageStepDefinitions =
      new CattleRegistrationsPageStepDefinitions(
        new CattleRegistrationsPage(page),
        new HomePage(page),
        new DashboardPage(page)
      )
    await use(cattleRegistrationsPageStepDefinitions)
  },
  cattleDeathsPageStepDefinitions: async ({ page }, use) => {
    const cattleDeathsPageStepDefinitions = new CattleDeathsPageStepDefinitions(
      new CattleDeathsPage(page),
      new HomePage(page),
      new DashboardPage(page)
    )
    await use(cattleDeathsPageStepDefinitions)
  },
  cattleImportsPageStepDefinitions: async ({ page }, use) => {
    const cattleImportsPageStepDefinitions =
      new CattleImportsPageStepDefinitions(
        new CattleImportsPage(page),
        new HomePage(page),
        new DashboardPage(page)
      )
    await use(cattleImportsPageStepDefinitions)
  }
})
