import { expect, APIRequestContext, test } from '@playwright/test'
import { LocationsResponse } from '../../types/responses/locationsResponse.type'
import { StatusCodes } from 'http-status-codes'
import { CadsDataService } from '../api/cads.data.service.client'
import { EndPoints, Queries } from '../../utils/enums'
import { executeQuery } from '../../utils/database'
import { LocationsIndentifier } from '../../types/database/locationsIndentifier.type'
import { ErrorResponse } from '../../types/responses/errorResponse.type'
import fs from 'fs'
import { Locations } from '../../types/database/locations.type'

export class LocationspiStepDefinitions {
  private readonly cadsDataService: CadsDataService

  constructor(apiContext: APIRequestContext) {
    this.cadsDataService = new CadsDataService(apiContext)
  }

  async getLocationsIdentifiers() {
    return (await executeQuery(
      Queries.SelectAllLocationsIdentifiers
    )) as LocationsIndentifier[]
  }

  async getLocations() {
    return (await executeQuery(Queries.SelectAllLocations)) as Locations[]
  }

  async getLocationsIdentifiersFromJson() {
    const data = fs.readFileSync('data/locations.json', 'utf8')
    return JSON.parse(data).locations
  }

  async getExpectedCPH() {
    return process.env.ENVIRONMENT === 'docker' ||
      process.env.ENVIRONMENT === 'local'
      ? (await this.getLocationsIdentifiers())[0].lid_full_identifier
      : (await this.getLocationsIdentifiersFromJson())[0].lid_full_identifier
  }

  async getExpectedLastModifiedDate() {
    return process.env.ENVIRONMENT === 'docker' ||
      process.env.ENVIRONMENT === 'local'
      ? (await this.getLocations())[0].loc_current_modified_date
      : (await this.getLocationsIdentifiersFromJson())[0].loc_modified_date
  }

  async getLocationsWithCPHAndModifiedDate() {
    const cph = await this.getExpectedCPH()
    const lastModifiedDate = await this.getExpectedLastModifiedDate()
    await test.step('getLocationsWithCPHAndModifiedDate', async () => {
      console.info('CPH: ' + cph)
      console.info('Last Modified Date: ' + lastModifiedDate)
    })
    const response = await this.cadsDataService.get<LocationsResponse[]>(
      EndPoints.Locations,
      StatusCodes.OK,
      undefined,
      {
        cph,
        lastModifiedDate
      }
    )
    expect(response[0].lidFullIdentifier).toBe(cph)
    return response
  }

  async getLocationsWithCPH() {
    const cph = await this.getExpectedCPH()
    const response = await this.cadsDataService.get<LocationsResponse[]>(
      EndPoints.Locations,
      StatusCodes.OK,
      undefined,
      {
        cph,
        lastModifiedDate: ''
      }
    )
    expect(response[0].lidFullIdentifier).toBe(cph)
    return response
  }

  async getLocationsWithModifiedDate() {
    const modifiedDate = await this.getExpectedLastModifiedDate()
    const locationsIdentifiersCount =
      process.env.ENVIRONMENT === 'docker' ||
      process.env.ENVIRONMENT === 'local'
        ? (await this.getLocationsIdentifiers()).length
        : (await this.getLocationsIdentifiersFromJson()).length
    const response = await this.cadsDataService.get<LocationsResponse[]>(
      EndPoints.Locations,
      StatusCodes.OK,
      undefined,
      {
        lastModifiedDate: modifiedDate
      }
    )
    expect(response.length).toBe(locationsIdentifiersCount)
    return response
  }

  async getLocationsWithInvalidModifiedDate() {
    const modifiedDate = '14-06-2005'
    const response = await this.cadsDataService.get<ErrorResponse>(
      EndPoints.Locations,
      StatusCodes.BAD_REQUEST,
      undefined,
      {
        lastModifiedDate: modifiedDate
      }
    )
    expect(response.errors?.LastModifiedDate?.[0]).toBe(
      'Invalid date format. Use yyyy-MM-dd.'
    )
    return response
  }

  async getLocationsWithInvalidCPH() {
    const cph = '1234567890'
    const response = await this.cadsDataService.get<ErrorResponse>(
      EndPoints.Locations,
      StatusCodes.BAD_REQUEST,
      undefined,
      {
        cph
      }
    )
    expect(response.errors?.Cph?.[0]).toBe(
      "'Cph' is not in the correct format."
    )
    return response
  }

  async getLocationsWithCPHAndModifiedDateMissing() {
    const response = await this.cadsDataService.get<ErrorResponse>(
      EndPoints.Locations,
      StatusCodes.BAD_REQUEST
    )
    expect(response.errors?.LastModifiedDate?.[0]).toBe(
      "'Last Modified Date' must not be empty."
    )
    expect(response.errors?.Cph?.[0]).toBe("'Cph' must not be empty.")
    return response
  }
}
