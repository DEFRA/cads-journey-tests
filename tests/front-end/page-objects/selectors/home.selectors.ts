// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type HomeSelectors = {
  startNowButton: string
}

const homeSelectorsByEnv: Record<TestEnv, HomeSelectors> = {
  local: {
    startNowButton: '.govuk-button'
  },
  dev: {
    startNowButton: ''
  },
  test: {
    startNowButton: ''
  }
}

export function getHomeSelectors(env: TestEnv): HomeSelectors {
  return homeSelectorsByEnv[env]
}
