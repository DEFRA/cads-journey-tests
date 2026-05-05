// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type DashboardSelectors = {
  breadcrumbs: string
  reports: string
}

const dashboardSelectorsByEnv: Record<TestEnv, DashboardSelectors> = {
  local: {
    breadcrumbs: '.govuk-breadcrumbs__list-item',
    reports: '.govuk-summary-card__title'
  },
  dev: {
    breadcrumbs: '',
    reports: ''
  },
  test: {
    breadcrumbs: '',
    reports: ''
  }
}

export function getDashboardSelectors(env: TestEnv): DashboardSelectors {
  return dashboardSelectorsByEnv[env]
}
