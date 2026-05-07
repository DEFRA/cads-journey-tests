// selectors/login.selectors.ts
import type { TestEnv } from '../../../../configs/env'

type LoginSelectors = {
  usernameInput: string
  passwordInput: string
  loginButton: string
  signInButton: string
  signedOutButton: string
  hereLink: string
}

const loginSelectorsByEnv: Record<TestEnv, LoginSelectors> = {
  local: {
    usernameInput: '#Username',
    passwordInput: '#Password',
    loginButton: 'Login',
    signInButton: 'Sign in',
    signedOutButton: 'Sign out',
    hereLink: 'here'
  },
  dev: {
    usernameInput: '',
    passwordInput: '',
    loginButton: '',
    signInButton: '',
    signedOutButton: '',
    hereLink: ''
  },
  test: {
    usernameInput: '',
    passwordInput: '',
    loginButton: '',
    signInButton: '',
    signedOutButton: '',
    hereLink: ''
  }
}

export function getLoginSelectors(env: TestEnv): LoginSelectors {
  return loginSelectorsByEnv[env]
}
