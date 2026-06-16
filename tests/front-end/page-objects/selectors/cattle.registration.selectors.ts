// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type CattleRegistrationSelectors = {
  yearDropdown: string
  monthDropdown: string
  downloadButton: string
  reportDownloadSuccessBanner: string
  requestAnotherReportLink: string
}

const cattleRegistrationSelectorsByEnv: Record<
  TestEnv,
  CattleRegistrationSelectors
> = {
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

export function getCattleRegistrationSelectors(
  env: TestEnv
): CattleRegistrationSelectors {
  return cattleRegistrationSelectorsByEnv[env]
}
