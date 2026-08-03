import { test } from '../../fixtures/test.fixture'

test.describe('Cattle Registrations Journey Tests @UI', () => {
  test(
    'Registrations - Download report',
    {
      tag: ['@smoke']
    },
    async ({ cattleRegistrationsPageStepDefinitions }) => {
      await cattleRegistrationsPageStepDefinitions.INaviagteToCattleRegistrationsPage()
      await cattleRegistrationsPageStepDefinitions.IDownloadTheReport()
      await cattleRegistrationsPageStepDefinitions.TheReportDownloadedSuccessfully()
    }
  )
})
