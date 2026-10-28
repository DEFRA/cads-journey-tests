import { expect, APIRequestContext } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { CadsDataService } from '../api/cads.data.service.client'
import { EndPoints, ScenarioTypes } from '../../utils/enums'
import { GenerationRequest } from '../../types/requests/generationRequest.type'
import { GenerationResponse } from '../../types/responses/generationResponse.type'
import { GenerationScenariosResponse } from '../../types/responses/generationScenariosResponse.type'
import fs from 'fs'
import path from 'path'
import { getCadsExternalBucket } from '../../utils/aws'

export class GenerationApiStepDefinitions {
  private readonly cadsDataService: CadsDataService
  private response?: GenerationResponse

  constructor(apiContext: APIRequestContext) {
    this.cadsDataService = new CadsDataService(apiContext)
  }

  async getRequestToGenerationScenariosEndpoint(
    tableName: string,
    scenarioType: ScenarioTypes
  ) {
    const response =
      await this.cadsDataService.get<GenerationScenariosResponse>(
        EndPoints.GenerationScenarios,
        StatusCodes.OK
      )
    return response.scenarios.find(
      (scenario) =>
        scenario.name.includes(scenarioType) && scenario.tableName === tableName
    )
  }

  async getRequestToGenerationEndpoint(
    request: GenerationRequest,
    statusCode: number = StatusCodes.OK
  ) {
    let filenameExists = true
    while (filenameExists) {
      this.response = await this.cadsDataService.post<GenerationResponse>(
        EndPoints.Generation,
        statusCode,
        request
      )
      const s3Bucket = await getCadsExternalBucket()
      const file = s3Bucket.find((file) =>
        file.key.includes(this.response!.filename)
      )
      if (!file) {
        filenameExists = false
      }
    }
    return this.response!
  }

  async verifyResponse() {
    expect(this.response?.filename).toBeDefined()
    expect(this.response?.content).toBeDefined()
    expect(this.response?.businessKeys).toBeDefined()
  }

  async generateCSVFile() {
    if (!this.response?.filename || !this.response?.content) {
      throw new Error('Generation response filename and content are required')
    }
    const outputPath = path.join(process.cwd(), this.response.filename)
    fs.writeFileSync(outputPath, this.response.content, {
      encoding: 'utf-8'
    })
    console.log(`CSV created: ${outputPath}`)
  }
}
