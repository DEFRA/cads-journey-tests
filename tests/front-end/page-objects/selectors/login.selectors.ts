import type { TestEnv } from '../../../../configs/env'

type LoginSelectors = {
  usernameInput: string
  passwordInput: string
  loginButton: string
  signInButton: string
  signedOutButton: string
  hereLink: string
  nextButton: string
}

const loginSelectorsByEnv: Record<TestEnv, LoginSelectors> = {
  docker: {
    usernameInput: '#Username',
    passwordInput: '#Password',
    loginButton: 'Login',
    signInButton: 'Sign in',
    signedOutButton: 'Sign out',
    hereLink: 'here',
    nextButton: ''
  },
  local: {
    usernameInput: '#Username',
    passwordInput: '#Password',
    loginButton: 'Login',
    signInButton: 'Sign in',
    signedOutButton: 'Sign out',
    hereLink: 'here',
    nextButton: ''
  },
  dev: {
    usernameInput: '[name="loginfmt"]',
    passwordInput: '[name="passwd"]',
    loginButton: 'Login',
    signInButton: 'Sign in',
    signedOutButton: 'Sign out',
    hereLink: 'here',
    nextButton: '[type="submit"]'
  },
  test: {
    usernameInput: '[name="loginfmt"]',
    passwordInput: '[name="passwd"]',
    loginButton: 'Login',
    signInButton: 'Sign in',
    signedOutButton: 'Sign out',
    hereLink: 'here',
    nextButton: '[type="submit"]'
  },
  'ext-test': {
    usernameInput: '[name="loginfmt"]',
    passwordInput: '[name="passwd"]',
    loginButton: 'Login',
    signInButton: 'Sign in',
    signedOutButton: 'Sign out',
    hereLink: 'here',
    nextButton: '[type="submit"]'
  }
}

export function getLoginSelectors(env: TestEnv): LoginSelectors {
  return loginSelectorsByEnv[env]
}
