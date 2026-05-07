// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type HomeSelectors = {
  startNowButton: string
}

const homeSelectorsByEnv: Record<TestEnv, HomeSelectors> = {
  docker: {
    startNowButton: '.govuk-button'
  },
  local: {
    startNowButton: '.govuk-button'
  },
  dev: {
    startNowButton: '.govuk-button'
  },
  test: {
    startNowButton: '.govuk-button'
  }
}

export function getHomeSelectors(env: TestEnv): HomeSelectors {
  return homeSelectorsByEnv[env]
}
