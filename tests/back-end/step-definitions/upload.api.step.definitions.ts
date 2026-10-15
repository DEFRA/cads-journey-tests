import { expect, APIRequestContext } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { CadsDataService } from '../api/cads.data.service.client'
import { EndPoints } from '../../utils/enums'
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
    statusCode: number = StatusCodes.OK
  ) {
    this.response = await this.cadsDataService.post<UploadResponse>(
      EndPoints.Upload,
      statusCode,
      request
    )
  }

  async verifyUpload() {
    const s3Bucket = await getCadsExternalBucket()
    expect(s3Bucket.length).toBe(1)
    expect(s3Bucket[0].key).toContain(this.response?.fileName)
  }
}
