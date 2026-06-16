import { test as base, request } from '@playwright/test'
import { HealthApiStepDefinitions } from '../back-end/step-definitions/health.api.step.definitions'
import { LocationspiStepDefinitions } from '../back-end/step-definitions/locations.api.step.definitions'

// Declare the types of your fixtures.
type ApiStepDefinitions = {
  healthApiStepDefinitions: HealthApiStepDefinitions
  locationsApiStepDefinitions: LocationspiStepDefinitions
}

// Extend base test by providing "healthApiStepDefinitions" fixture.
export const backendTests = base.extend<ApiStepDefinitions>({
  // eslint-disable-next-line no-empty-pattern
  healthApiStepDefinitions: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL:
        process.env.CDP === undefined && process.env.ENVIRONMENT === 'dev'
          ? process.env.apiURLExt
          : process.env.apiURL
    })
    const healthApiStepDefinitions = new HealthApiStepDefinitions(apiContext)
    await use(healthApiStepDefinitions)
  },
  // eslint-disable-next-line no-empty-pattern
  locationsApiStepDefinitions: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL:
        process.env.CDP === undefined && process.env.ENVIRONMENT === 'dev'
          ? process.env.apiURLExt
          : process.env.apiURL
    })
    const locationsApiStepDefinitions = new LocationspiStepDefinitions(
      apiContext
    )
    await use(locationsApiStepDefinitions)
  }
})
