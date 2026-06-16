// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type CattleImportsSelectors = {
  yearDropdown: string
  monthDropdown: string
  downloadButton: string
  reportDownloadSuccessBanner: string
  requestAnotherReportLink: string
}

const cattleImportsSelectorsByEnv: Record<TestEnv, CattleImportsSelectors> = {
  docker: {
    yearDropdown: '#year',
    monthDropdown: '#month',
    downloadButton: 'Download',
    reportDownloadSuccessBanner: '.govuk-notification-banner--success',
    requestAnotherReportLink: '.govuk-notification-banner__link'
  },
  local: {
    yearDropdown: '#year',
    monthDropdown: '#month',
    downloadButton: 'Download',
    reportDownloadSuccessBanner: '.govuk-notification-banner--success',
    requestAnotherReportLink: '.govuk-notification-banner__link'
  },
  dev: {
    yearDropdown: '#year',
    monthDropdown: '#month',
    downloadButton: 'Download',
    reportDownloadSuccessBanner: '.govuk-notification-banner--success',
    requestAnotherReportLink: '.govuk-notification-banner__link'
  },
  test: {
    yearDropdown: '#year',
    monthDropdown: '#month',
    downloadButton: 'Download',
    reportDownloadSuccessBanner: '.govuk-notification-banner--success',
    requestAnotherReportLink: '.govuk-notification-banner__link'
  },
  'ext-test': {
    yearDropdown: '#year',
    monthDropdown: '#month',
    downloadButton: 'Download',
    reportDownloadSuccessBanner: '.govuk-notification-banner--success',
    requestAnotherReportLink: '.govuk-notification-banner__link'
  }
}

export function getCattleImportsSelectors(
  env: TestEnv
): CattleImportsSelectors {
  return cattleImportsSelectorsByEnv[env]
}
