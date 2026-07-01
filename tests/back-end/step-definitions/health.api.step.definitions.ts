import { expect, APIRequestContext } from '@playwright/test'
import { HealthResponse } from '../../types/responses/healthResponse.type'
import { StatusCodes } from 'http-status-codes'
import { CadsDataService } from '../api/cads.data.service.client'
import { EndPoints } from '../../utils/enums'
import { getEnv } from '../../../configs/env'

export class HealthApiStepDefinitions {
  private readonly cadsDataService: CadsDataService

  constructor(apiContext: APIRequestContext) {
    this.cadsDataService = new CadsDataService(apiContext)
  }

  async getRequestToHealthEndpointReturns200StatusCode() {
    const env = getEnv()
    if (env !== 'ext-test') {
      const response = await this.cadsDataService.get<HealthResponse>(
        EndPoints.Health,
        StatusCodes.OK
      )
      expect(response.status).toBe('Healthy')
    }
  }
}
