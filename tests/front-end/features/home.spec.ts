import { test } from '../../fixtures/test.fixture'

test.describe('UI', () => {
  test('Home page', async ({ homePageStepDefinitions }) => {
    await homePageStepDefinitions.INaviagteToHomePage()
    await homePageStepDefinitions.IHaveLandedOnTheHomePage()
  })
})
