import { expect, APIRequestContext } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { CadsDataService } from '../api/cads.data.service.client'
import { EndPoints, ScenarioTypes } from '../../utils/enums'
import { UploadResponse } from '../../types/responses/uploadResponse.type'
import { UploadRequest } from '../../types/requests/uploadRequest.type'
import { getCadsExternalBucket } from '../../utils/aws'
export class UploadApiStepDefinitions {
  private readonly cadsDataService: CadsDataService
  private response?: UploadResponse

  constructor(apiContext: APIRequestContext) {
    this.cadsDataService = new CadsDataService(apiContext)
  }

  async getRequestToUploadEndpoint(
    request: UploadRequest,
    statusCode: number = StatusCodes.ACCEPTED
  ) {
    this.response = await this.cadsDataService.post<UploadResponse>(
      EndPoints.Upload,
      statusCode,
      request
    )
  }

  async verifyUpload(scenarioType: ScenarioTypes) {
    switch (scenarioType) {
      case ScenarioTypes.BulkInsert: {
        if (!this.response?.fileName) {
          throw new Error('Upload response fileName is required')
        }
        const s3Bucket = await getCadsExternalBucket()
        const file = s3Bucket.find((file) =>
          file.key.includes(this.response!.fileName)
        )
        expect(file).toBeDefined()
        break
      }
      case ScenarioTypes.BulkUpdate:
        break
    }
  }
}
