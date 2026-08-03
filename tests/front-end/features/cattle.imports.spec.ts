import { test } from '../../fixtures/test.fixture'

test.describe('Cattle Imports Journey Tests @UI', () => {
  test('Imports - Download report', async ({
    cattleImportsPageStepDefinitions
  }) => {
    await cattleImportsPageStepDefinitions.INaviagteToCattleImportsPage()
    await cattleImportsPageStepDefinitions.IDownloadTheReport()
    await cattleImportsPageStepDefinitions.TheReportDownloadedSuccessfully()
  })
})
