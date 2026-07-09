import { test, chromium } from '../../fixtures/test.fixture'
import { playAudit } from 'playwright-lighthouse'
import { AuthFile } from '../../utils/enums'
import { LoginPage } from '../page-objects/login.page'
import { LoginPageStepDefinitions } from '../step-definitions/login.page.step.definitions'
import { HomePageStepDefinitions } from '../step-definitions/home.page.step.definitions'
import { HomePage } from '../page-objects/home.page'
import { DashboardPage } from '../page-objects/dashboard.page'
import { DashboardPageStepDefinitions } from '../step-definitions/dashboard.page.step.definitions'
import { CattleRegistrationsPageStepDefinitions } from '../step-definitions/cattle.registrations.page.step.definitions'
import { CattleRegistrationsPage } from '../page-objects/cattle.registrations.page'
import { CattleDeathsPage } from '../page-objects/cattle.deaths.page'
import { CattleDeathsPageStepDefinitions } from '../step-definitions/cattle.deaths.page.step.definitions'
import { CattleImportsPage } from '../page-objects/cattle.imports.page'
import { CattleImportsPageStepDefinitions } from '../step-definitions/cattle.imports.page.step.definitions'
import { AdministrationPage } from '../page-objects/administration.page'
import { AdministrationPageStepDefinitions } from '../step-definitions/administration.page.step.definitions'

test.describe('Accessibility Tests', () => {
  test.setTimeout(5 * 60 * 1000)
  test('pages should not have automatically detectable accessibility issues', async () => {
    const thresholds = {
      accessibility: 90
    }
    const opts = {
      disableStorageReset: true,
      maxWaitForLoad: 60000
    }
    const port = 9222

    const context = await chromium.launchPersistentContext(
      './tmp/lighthouse-profile',
      {
        baseURL: process.env.CADS_MIP_FRONTEND_BASE_URL,
        args: ['--remote-debugging-port=9222']
      }
    )
    const page = await context.newPage()

    await test.step('Home Page', async () => {
      await new HomePageStepDefinitions(
        new HomePage(page)
      ).INaviagteToHomePage()
      await playAudit({
        page,
        port,
        thresholds,
        opts
      })
    })

    const loginPage = new LoginPage(page)
    await loginPage.navigateToLoginPage()
    const loginPageStepDefinitions = new LoginPageStepDefinitions(loginPage)
    await loginPageStepDefinitions.ILoginWithValidCredentials(
      process.env.CADS_MIP_FRONTEND_USERNAME!,
      process.env.CADS_MIP_FRONTEND_PASSWORD!
    )
    await page.context().storageState({ path: AuthFile.User })
    const homePage = new HomePage(page)
    const dashboardPage = new DashboardPage(page)

    await test.step('Dashboard Page', async () => {
      await new DashboardPageStepDefinitions(
        dashboardPage
      ).INaviagteToDashboardPage()
      await playAudit({
        page,
        port,
        thresholds,
        opts
      })
    })

    await test.step('Cattle Registration Page', async () => {
      await new CattleRegistrationsPageStepDefinitions(
        new CattleRegistrationsPage(page),
        homePage,
        dashboardPage
      ).INaviagteToCattleRegistrationsPage()
      await playAudit({
        page,
        port,
        thresholds,
        opts
      })
    })

    await test.step('Cattle Deaths Page', async () => {
      await new CattleDeathsPageStepDefinitions(
        new CattleDeathsPage(page),
        homePage,
        dashboardPage
      ).INaviagteToCattleDeathsPage()
      await playAudit({
        page,
        port,
        thresholds,
        opts
      })
    })

    await test.step('Cattle Imports Page', async () => {
      await new CattleImportsPageStepDefinitions(
        new CattleImportsPage(page),
        homePage,
        dashboardPage
      ).INaviagteToCattleImportsPage()
      await playAudit({
        page,
        port,
        thresholds,
        opts
      })
    })

    await test.step('Administration Page', async () => {
      await new AdministrationPageStepDefinitions(
        new AdministrationPage(page)
      ).INaviagteToAdministrationPage()
      await playAudit({
        page,
        port,
        thresholds,
        opts
      })
    })
    await context.close()
  })
})
