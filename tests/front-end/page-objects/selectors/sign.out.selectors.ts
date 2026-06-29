// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type SignOutSelectors = {
  logOutPage: string
  clickHereLink: string
  userTableRow: string
}

const signOutSelectorsByEnv: Record<TestEnv, SignOutSelectors> = {
  docker: {
    logOutPage: '.logged-out-page',
    clickHereLink: 'here',
    userTableRow: '.table-row'
  },
  local: {
    logOutPage: '.logged-out-page',
    clickHereLink: 'here',
    userTableRow: '.table-row'
  },
  dev: {
    logOutPage: '.logged-out-page',
    clickHereLink: 'here',
    userTableRow: '.table-row'
  },
  test: {
    logOutPage: '.logged-out-page',
    clickHereLink: 'here',
    userTableRow: '.table-row'
  },
  'ext-test': {
    logOutPage: '.logged-out-page',
    clickHereLink: 'here',
    userTableRow: '.table-row'
  }
}

export function getSignOutSelectors(env: TestEnv): SignOutSelectors {
  return signOutSelectorsByEnv[env]
}
