import { StatusCodes } from 'http-status-codes'
import { expect, test } from '../../fixtures/test.fixture'
import { ScenarioTypes, TableNames } from '../../utils/enums'

test.describe.skip('Upload API Journey Tests @API', () => {
  test('Upload endpoint Bulk Insert returns 200 OK status code', async ({
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
    await uploadApiStepDefinitions.verifyUpload(ScenarioTypes.BulkInsert)
  })
  test('Upload endpoint Bulk Update returns 200 OK status code', async ({
    generationApiStepDefinitions,
    uploadApiStepDefinitions
  }) => {
    const scenario =
      await generationApiStepDefinitions.getRequestToGenerationScenariosEndpoint(
        TableNames.CTS.Locations,
        ScenarioTypes.BulkUpdate
      )!
    const response =
      await generationApiStepDefinitions.getRequestToGenerationEndpoint({
        data: {
          Scenario: scenario?.name,
          BusinessKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
      })!
    await uploadApiStepDefinitions.getRequestToUploadEndpoint({
      data: {
        fileName: response.filename,
        content: response.content
      }
    })
    await uploadApiStepDefinitions.verifyUpload(ScenarioTypes.BulkUpdate)
  })
  test('Invalid request - Upload endpoint returns 400 BAD REQUEST status code - incorrect file name format', async ({
    uploadApiStepDefinitions
  }) => {
    await uploadApiStepDefinitions.getRequestToUploadEndpoint(
      { data: { fileName: 'test.csv', content: 'test content' } },
      StatusCodes.BAD_REQUEST
    )
  })
  test('Upload endpoint Bulk Insert with empty content returns 400 BAD REQUEST status code', async ({
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
    await uploadApiStepDefinitions.getRequestToUploadEndpoint(
      {
        data: {
          fileName: response.filename,
          content: ''
        }
      },
      StatusCodes.BAD_REQUEST
    )
  })
  test('Upload endpoint Bulk Update with empty content returns 400 BAD REQUEST status code', async ({
    generationApiStepDefinitions,
    uploadApiStepDefinitions
  }) => {
    const scenario =
      await generationApiStepDefinitions.getRequestToGenerationScenariosEndpoint(
        TableNames.CTS.Locations,
        ScenarioTypes.BulkUpdate
      )!
    const response =
      await generationApiStepDefinitions.getRequestToGenerationEndpoint({
        data: {
          Scenario: scenario?.name,
          BusinessKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
      })!
    await uploadApiStepDefinitions.getRequestToUploadEndpoint(
      {
        data: {
          fileName: response.filename,
          content: ''
        }
      },
      StatusCodes.BAD_REQUEST
    )
  })
  test('Upload endpoint duplicate Bulk Insert returns 400 BAD REQUEST status code', async ({
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
    await uploadApiStepDefinitions.verifyUpload(ScenarioTypes.BulkInsert)
    await uploadApiStepDefinitions.getRequestToUploadEndpoint(
      {
        data: {
          fileName: response.filename,
          content: response.content
        }
      },
      StatusCodes.BAD_REQUEST
    )
  })
  test('Upload endpoint duplicate Bulk Update returns 400 BAD REQUEST status code', async ({
    generationApiStepDefinitions,
    uploadApiStepDefinitions
  }) => {
    const scenario =
      await generationApiStepDefinitions.getRequestToGenerationScenariosEndpoint(
        TableNames.CTS.Locations,
        ScenarioTypes.BulkUpdate
      )!
    const response =
      await generationApiStepDefinitions.getRequestToGenerationEndpoint({
        data: {
          Scenario: scenario?.name,
          BusinessKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
      })!
    await uploadApiStepDefinitions.getRequestToUploadEndpoint({
      data: {
        fileName: response.filename,
        content: response.content
      }
    })
    await uploadApiStepDefinitions.verifyUpload(ScenarioTypes.BulkUpdate)
    await uploadApiStepDefinitions.getRequestToUploadEndpoint(
      {
        data: {
          fileName: response.filename,
          content: response.content
        }
      },
      StatusCodes.BAD_REQUEST
    )
  })
})
