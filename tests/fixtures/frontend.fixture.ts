import { test as base } from '@playwright/test'
import { HomePageStepDefinitions } from '../front-end/step-definitions/home.page.step.definitions'
import { HomePage } from '../front-end/page-objects/home.page'

// Declare the types of your fixtures.
type FrontendStepDefinitions = {
  homePageStepDefinitions: HomePageStepDefinitions
}
// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const frontendTests = base.extend<FrontendStepDefinitions>({
  homePageStepDefinitions: async ({ page }, use) => {
    const homePageStepDefinitions = new HomePageStepDefinitions(
      new HomePage(page)
    )
    await use(homePageStepDefinitions)
  }
})
