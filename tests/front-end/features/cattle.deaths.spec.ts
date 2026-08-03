import { test } from '../../fixtures/test.fixture'

test.describe('Cattle Deaths Journey Tests @UI', () => {
  test('Deaths - Download report', async ({
    cattleDeathsPageStepDefinitions
  }) => {
    await cattleDeathsPageStepDefinitions.INaviagteToCattleDeathsPage()
    await cattleDeathsPageStepDefinitions.IDownloadTheReport()
    await cattleDeathsPageStepDefinitions.TheReportDownloadedSuccessfully()
  })
})
