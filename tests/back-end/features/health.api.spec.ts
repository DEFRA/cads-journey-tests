import { test } from '../../fixtures/test.fixture'

test.describe('Health API Journey Tests @API', () => {
  test(
    'Health endpoint returns 200 OK status code',
    {
      tag: ['@Smoke']
    },
    async ({ healthApiStepDefinitions }) => {
      await healthApiStepDefinitions.getRequestToHealthEndpointReturns200StatusCode()
    }
  )
})
