import { test } from '../../fixtures/test.fixture'

test.describe('Administration Journey Tests @UI', () => {
  test('Administration page', async ({
    administrationPageStepDefinitions,
    homePageStepDefinitions
  }) => {
    await homePageStepDefinitions.INaviagteToHomePage()
    await administrationPageStepDefinitions.INaviagteToAdministrationPage()
    await administrationPageStepDefinitions.IHaveLandedOnTheAdministrationPage()
  })
})
