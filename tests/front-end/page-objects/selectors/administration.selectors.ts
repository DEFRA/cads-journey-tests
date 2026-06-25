import type { TestEnv } from '../../../../configs/env'

type AdministrationSelectors = Record<string, never>

const administrationSelectorsByEnv: Record<TestEnv, AdministrationSelectors> = {
  docker: {},
  local: {},
  dev: {},
  test: {},
  'ext-test': {}
}

export function getAdministrationSelectors(
  env: TestEnv
): AdministrationSelectors {
  return administrationSelectorsByEnv[env]
}
