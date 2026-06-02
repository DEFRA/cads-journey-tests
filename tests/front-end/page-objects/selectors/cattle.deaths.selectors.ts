// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type CattleDeathsSelectors = {
  yearDropdown: string
  monthDropdown: string
  downloadButton: string
  reportDownloadSuccessBanner: string
  requestAnotherReportLink: string
}

const cattleDeathsSelectorsByEnv: Record<TestEnv, CattleDeathsSelectors> = {
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
  }
}

export function getCattleDeathsSelectors(env: TestEnv): CattleDeathsSelectors {
  return cattleDeathsSelectorsByEnv[env]
}
