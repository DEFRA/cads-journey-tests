import { test } from '../../fixtures/test.fixture'

test.describe('UI', () => {
  test('Registrations - Download report', async ({
    cattleRegistrationsPageStepDefinitions
  }) => {
    await cattleRegistrationsPageStepDefinitions.INaviagteToCattleRegistrationsPage()
    await cattleRegistrationsPageStepDefinitions.IDownloadTheReport()
    await cattleRegistrationsPageStepDefinitions.TheReportDownloadedSuccessfully()
  })
})
