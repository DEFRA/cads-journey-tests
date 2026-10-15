import { test as base, request } from '@playwright/test'
import { HealthApiStepDefinitions } from '../back-end/step-definitions/health.api.step.definitions'
import { LocationspiStepDefinitions } from '../back-end/step-definitions/locations.api.step.definitions'
import { GraphQlApiStepDefinitions } from '../back-end/step-definitions/graphQL.api.step.definitions'
import { GenerationApiStepDefinitions } from '../back-end/step-definitions/generation.api.step.definitions'
import { UploadApiStepDefinitions } from '../back-end/step-definitions/upload.api.step.definitions'

// Declare the types of your fixtures.
type ApiStepDefinitions = {
  healthApiStepDefinitions: HealthApiStepDefinitions
  locationsApiStepDefinitions: LocationspiStepDefinitions
  graphqlApiStepDefinitions: GraphQlApiStepDefinitions
  generationApiStepDefinitions: GenerationApiStepDefinitions
  uploadApiStepDefinitions: UploadApiStepDefinitions
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
  },
  // eslint-disable-next-line no-empty-pattern
  graphqlApiStepDefinitions: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: process.env.apiURL
    })
    const graphQlApiStepDefinitions = new GraphQlApiStepDefinitions(apiContext)
    await use(graphQlApiStepDefinitions)
  },
  // eslint-disable-next-line no-empty-pattern
  generationApiStepDefinitions: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: process.env.apiURL
    })
    const generationApiStepDefinitions = new GenerationApiStepDefinitions(
      apiContext
    )
    await use(generationApiStepDefinitions)
  },
  // eslint-disable-next-line no-empty-pattern
  uploadApiStepDefinitions: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: process.env.CADS_BRIDGE_BASE_URL
    })
    const uploadApiStepDefinitions = new UploadApiStepDefinitions(apiContext)
    await use(uploadApiStepDefinitions)
  }
})
