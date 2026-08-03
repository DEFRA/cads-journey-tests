import { test } from '../../fixtures/test.fixture'

test.describe('Locations API Journey Tests @API', () => {
  test(
    'Locations endpoint filter by CPH and modified date returns 200 OK status code',
    {
      tag: ['@Smoke']
    },
    async ({ locationsApiStepDefinitions }) => {
      await locationsApiStepDefinitions.getLocationsWithCPHAndModifiedDate()
    }
  )

  test('Locations endpoint filter by CPH returns 200 OK status code', async ({
    locationsApiStepDefinitions
  }) => {
    await locationsApiStepDefinitions.getLocationsWithCPH()
  })

  test('Locations endpoint filter by modified date returns 200 OK status code', async ({
    locationsApiStepDefinitions
  }) => {
    await locationsApiStepDefinitions.getLocationsWithModifiedDate()
  })

  test('Locations endpoint filter by invalid modified date returns 400 BAD REQUEST status code', async ({
    locationsApiStepDefinitions
  }) => {
    await locationsApiStepDefinitions.getLocationsWithInvalidModifiedDate()
  })
  test('Locations endpoint filter by invalid CPH returns 400 BAD REQUEST status code', async ({
    locationsApiStepDefinitions
  }) => {
    await locationsApiStepDefinitions.getLocationsWithInvalidCPH()
  })
  test('Locations endpoint filter by missing CPH and modified date returns 400 BAD REQUEST status code', async ({
    locationsApiStepDefinitions
  }) => {
    await locationsApiStepDefinitions.getLocationsWithCPHAndModifiedDateMissing()
  })
})
