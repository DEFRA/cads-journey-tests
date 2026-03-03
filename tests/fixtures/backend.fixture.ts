import { test as base, request } from '@playwright/test'
import { HealthApiStepDefinitions } from '../back-end/step-definitions/health.api.step.definitions'

// Declare the types of your fixtures.
type ApiStepDefinitions = {
  healthApiStepDefinitions: HealthApiStepDefinitions
}

// Extend base test by providing "healthApiStepDefinitions" fixture.
export const backendTests = base.extend<ApiStepDefinitions>({
  // eslint-disable-next-line no-empty-pattern
  healthApiStepDefinitions: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: process.env.apiURL
    })
    const healthApiStepDefinitions = new HealthApiStepDefinitions(apiContext)
    await use(healthApiStepDefinitions)
  }
})
