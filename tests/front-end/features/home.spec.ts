import { test } from '../../fixtures/test.fixture'

test.describe('Home Journey Tests @UI', () => {
  test('Home page', async ({ homePageStepDefinitions }) => {
    await homePageStepDefinitions.INaviagteToHomePage()
    await homePageStepDefinitions.IHaveLandedOnTheHomePage()
  })
})
