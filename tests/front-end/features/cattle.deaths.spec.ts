import { test } from '../../fixtures/test.fixture'

test.describe('UI', () => {
  test('Deaths - Download report', async ({
    cattleDeathsPageStepDefinitions
  }) => {
    await cattleDeathsPageStepDefinitions.INaviagteToCattleDeathsPage()
    await cattleDeathsPageStepDefinitions.IDownloadTheReport()
    await cattleDeathsPageStepDefinitions.TheReportDownloadedSuccessfully()
  })
})
