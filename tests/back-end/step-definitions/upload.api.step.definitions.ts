import { expect, APIRequestContext } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { CadsDataService } from '../api/cads.data.service.client'
import { EndPoints, ScenarioTypes } from '../../utils/enums'
import { UploadResponse } from '../../types/responses/uploadResponse.type'
import { UploadRequest } from '../../types/requests/uploadRequest.type'
import { getCadsExternalBucket } from '../../utils/aws'
import {
  GraphQLClient,
  fileImportBatchStatuses
} from '../../utils/graphql.client'
import { GraphQLSchema } from '../../utils/graphql.types'
export class UploadApiStepDefinitions {
  private readonly cadsDataService: CadsDataService
  private readonly graphqlClient: GraphQLClient
  private response?: UploadResponse

  constructor(apiContext: APIRequestContext) {
    this.cadsDataService = new CadsDataService(apiContext)
    this.graphqlClient = new GraphQLClient(apiContext)
  }

  async getRequestToUploadEndpoint(
    request: UploadRequest,
    statusCode: number = StatusCodes.CREATED
  ) {
    this.response = await this.cadsDataService.post<UploadResponse>(
      EndPoints.Upload,
      statusCode,
      request
    )
  }

  async verifyUpload(scenarioType: ScenarioTypes) {
    if (this.cadsDataService.isCDPEnvironment) {
      expect(this.response?.fileName).toBeDefined()
    } else {
      const s3Bucket = await getCadsExternalBucket()
      const file = s3Bucket.find((file) =>
        file.key.includes(this.response!.fileName)
      )
      expect(file).toBeDefined()
    }
    switch (scenarioType) {
      case ScenarioTypes.BulkInsert:
      case ScenarioTypes.BulkUpdate:
        break
    }
  }

  async waitForFileImportBatchToComplete(groupKey: string) {
    const query = this.graphqlClient.buildQuery({
      table: GraphQLSchema.FileImportBatch.table,
      filters: [
        {
          column: GraphQLSchema.FileImportBatch.columns.GroupKey,
          variable: 'groupKey'
        }
      ],
      returnColumns: [
        GraphQLSchema.FileImportBatch.columns.GroupKey,
        GraphQLSchema.FileImportBatch.columns.ImportStatusId,
        GraphQLSchema.FileImportBatch.columns.FileName
      ]
    })
    const status = await this.graphqlClient.getfileImportBatchStatus(query, {
      groupKey
    })
    expect(status).toBe(fileImportBatchStatuses.Complete)
  }
}
