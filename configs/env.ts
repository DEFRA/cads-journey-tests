// config/env.ts
export type TestEnv = 'local' | 'dev' | 'test' | 'docker' | 'ext-test'

export function getEnv(): TestEnv {
  const env = process.env.ENVIRONMENT as TestEnv | undefined

  if (!env) return 'local'

  if (env === 'docker') return 'local'

  if (!['local', 'dev', 'test', 'ext-test'].includes(env)) {
    throw new Error(`Unsupported TEST_ENV: ${env}`)
  }

  return env
}
