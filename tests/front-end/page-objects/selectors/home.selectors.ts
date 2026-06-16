// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type HomeSelectors = {
  signInButton: string
}

const homeSelectorsByEnv: Record<TestEnv, HomeSelectors> = {
  docker: {
    signInButton: '.govuk-button--start'
  },
  local: {
    signInButton: '.govuk-button--start'
  },
  dev: {
    signInButton: '.govuk-button--start'
  },
  test: {
    signInButton: '.govuk-button--start'
  },
  'ext-test': {
    signInButton: '.govuk-button--start'
  }
}

export function getHomeSelectors(env: TestEnv): HomeSelectors {
  return homeSelectorsByEnv[env]
}
