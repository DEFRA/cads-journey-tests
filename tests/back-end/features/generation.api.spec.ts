import { StatusCodes } from 'http-status-codes'
import { expect, test } from '../../fixtures/test.fixture'
import { ScenarioTypes, TableNames } from '../../utils/enums'

test.describe('Generation API Journey Tests @API', () => {
  test('INSERT - Generation endpoint returns 200 OK status code', async ({
    generationApiStepDefinitions
  }) => {
    const scenario =
      await generationApiStepDefinitions.getRequestToGenerationScenariosEndpoint(
        TableNames.CTS.Locations,
        ScenarioTypes.BulkInsert
      )!
    await generationApiStepDefinitions.getRequestToGenerationEndpoint({
      data: {
        Scenario: scenario?.name,
        RowCount: 10
      }
    })
    await generationApiStepDefinitions.verifyResponse()
    await generationApiStepDefinitions.generateCSVFile()
  })
  test('UPDATE - Generation endpoint returns 200 OK status code', async ({
    generationApiStepDefinitions
  }) => {
    const scenario =
      await generationApiStepDefinitions.getRequestToGenerationScenariosEndpoint(
        TableNames.CTS.Locations,
        ScenarioTypes.Update
      )!
    await generationApiStepDefinitions.getRequestToGenerationEndpoint({
      data: {
        Scenario: scenario?.name,
        BusinessKey: [1, 2, 3]
      }
    })
    await generationApiStepDefinitions.verifyResponse()
    await generationApiStepDefinitions.generateCSVFile()
  })
  test('Invalid request - Generation endpoint returns 400 BAD REQUEST status code', async ({
    generationApiStepDefinitions
  }) => {
    await generationApiStepDefinitions.getRequestToGenerationEndpoint(
      { data: { Scenario: 'bulk_insert', RowCount: 1, BusinessKey: [1] } },
      StatusCodes.BAD_REQUEST
    )
  })
})
