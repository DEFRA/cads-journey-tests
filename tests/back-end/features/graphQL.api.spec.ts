import { test } from '../../fixtures/test.fixture'

test.describe('GraphQL API Journey Tests @API', () => {
  test(
    'CADS endpoint returns Animal Sexes',
    {
      tag: ['@Smoke']
    },
    async ({ graphqlApiStepDefinitions }) => {
      await graphqlApiStepDefinitions.getRequestToCadSEndpointReturnsAnimalSexes(
        'male'
      )
    }
  )

  test('CADS endpoint returns 400 Bad Request - Invalid Request', async ({
    graphqlApiStepDefinitions
  }) => {
    await graphqlApiStepDefinitions.getRequestToCadSEndpointReturns400BadRequestInvalidRequest()
  })

  test('CADS endpoint returns 401 Unauthorized', async ({
    graphqlApiStepDefinitions
  }) => {
    await graphqlApiStepDefinitions.getRequestToCadSEndpointReturns401Unauthorized()
  })
})
