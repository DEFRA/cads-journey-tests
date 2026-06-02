// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type DashboardSelectors = {
  breadcrumbs: string
  reports: string
  reportTitles: string
}

const dashboardSelectorsByEnv: Record<TestEnv, DashboardSelectors> = {
  docker: {
    breadcrumbs: '.govuk-breadcrumbs__list-item',
    reports: '.govuk-summary-card__title',
    reportTitles: 'report-item-title'
  },
  local: {
    breadcrumbs: '.govuk-breadcrumbs__list-item',
    reports: '.govuk-summary-card__title',
    reportTitles: 'report-item-title'
  },
  dev: {
    breadcrumbs: '.govuk-breadcrumbs__list-item',
    reports: '.govuk-summary-card__title',
    reportTitles: 'report-item-title'
  },
  test: {
    breadcrumbs: '.govuk-breadcrumbs__list-item',
    reports: '.govuk-summary-card__title',
    reportTitles: 'report-item-title'
  }
}

export function getDashboardSelectors(env: TestEnv): DashboardSelectors {
  return dashboardSelectorsByEnv[env]
}
