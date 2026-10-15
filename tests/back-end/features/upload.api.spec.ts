import { StatusCodes } from 'http-status-codes'
import { expect, test } from '../../fixtures/test.fixture'
import { ScenarioTypes, TableNames } from '../../utils/enums'

test.describe('Upload API Journey Tests @API', () => {
  test('Upload endpoint returns 200 OK status code', async ({
    generationApiStepDefinitions,
    uploadApiStepDefinitions
  }) => {
    const scenario =
      await generationApiStepDefinitions.getRequestToGenerationScenariosEndpoint(
        TableNames.CTS.Locations,
        ScenarioTypes.BulkInsert
      )!
    const response =
      await generationApiStepDefinitions.getRequestToGenerationEndpoint({
        data: {
          Scenario: scenario?.name,
          RowCount: 10
        }
      })!
    await uploadApiStepDefinitions.getRequestToUploadEndpoint({
      data: {
        fileName: response.filename,
        content: response.content
      }
    })
    await uploadApiStepDefinitions.verifyUpload()
  })
  test('Invalid request - Upload endpoint returns 400 BAD REQUEST status code - incorrect file name format', async ({
    uploadApiStepDefinitions
  }) => {
    await uploadApiStepDefinitions.getRequestToUploadEndpoint(
      { data: { fileName: 'test.csv', content: 'test content' } },
      StatusCodes.BAD_REQUEST
    )
  })
})
