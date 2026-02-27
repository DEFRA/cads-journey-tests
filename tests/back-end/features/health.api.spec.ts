import { test } from '../../fixtures/test.fixture'

test.describe('API', () => {
  test('Health endpoint returns 200 OK status code', async ({
    healthApiStepDefinitions
  }) => {
    await healthApiStepDefinitions.getRequestToHealthEndpointReturns200StatusCode()
  })
})
