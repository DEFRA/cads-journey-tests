import { StatusCodes } from 'http-status-codes'
import { test } from '../../fixtures/test.fixture'
import { ScenarioTypes, TableNames } from '../../utils/enums'

test.describe.skip('Generation API Journey Tests @API', () => {
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
        ScenarioTypes.BulkUpdate
      )!
    await generationApiStepDefinitions.getRequestToGenerationEndpoint({
      data: {
        Scenario: scenario?.name,
        BusinessKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
    })
    await generationApiStepDefinitions.verifyResponse()
    await generationApiStepDefinitions.generateCSVFile()
  })
  test('Invalid request - Generation endpoint returns 400 BAD REQUEST status code', async ({
    generationApiStepDefinitions
  }) => {
    await generationApiStepDefinitions.getRequestToGenerationEndpoint(
      { data: { Scenario: 'bulk_insert', RowCount: 1, BusinessKeys: [1] } },
      StatusCodes.BAD_REQUEST
    )
  })
})
