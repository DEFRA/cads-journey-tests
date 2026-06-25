// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type SignOutSelectors = {
  logOutPage: string
  clickHereLink: string
}

const signOutSelectorsByEnv: Record<TestEnv, SignOutSelectors> = {
  docker: {
    logOutPage: '.logged-out-page',
    clickHereLink: 'here'
  },
  local: {
    logOutPage: '.logged-out-page',
    clickHereLink: 'here'
  },
  dev: {
    logOutPage: '.logged-out-page',
    clickHereLink: 'here'
  },
  test: {
    logOutPage: '.logged-out-page',
    clickHereLink: 'here'
  },
  'ext-test': {
    logOutPage: '.logged-out-page',
    clickHereLink: 'here'
  }
}

export function getSignOutSelectors(env: TestEnv): SignOutSelectors {
  return signOutSelectorsByEnv[env]
}
