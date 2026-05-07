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
  docker: {
    usernameInput: '#Username',
    passwordInput: '#Password',
    loginButton: 'Login',
    signInButton: 'Sign in',
    signedOutButton: 'Sign out',
    hereLink: 'here'
  },
  local: {
    usernameInput: '#Username',
    passwordInput: '#Password',
    loginButton: 'Login',
    signInButton: 'Sign in',
    signedOutButton: 'Sign out',
    hereLink: 'here'
  },
  dev: {
    usernameInput: '#Username',
    passwordInput: '#Password',
    loginButton: 'Login',
    signInButton: 'Sign in',
    signedOutButton: 'Sign out',
    hereLink: 'here'
  },
  test: {
    usernameInput: '#Username',
    passwordInput: '#Password',
    loginButton: 'Login',
    signInButton: 'Sign in',
    signedOutButton: 'Sign out',
    hereLink: 'here'
  }
}

export function getLoginSelectors(env: TestEnv): LoginSelectors {
  return loginSelectorsByEnv[env]
}
