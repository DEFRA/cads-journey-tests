import { StatusCodes } from 'http-status-codes'
import { BaseClient } from './base.client'

export class CadsDataService extends BaseClient {
  async get<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object,
    params?: { [key: string]: string | number | boolean },
    cognitoAccessToken: boolean = false
  ): Promise<T> {
    return await super.get<T>(
      url,
      statusCode,
      options,
      params,
      cognitoAccessToken
    )
  }

  async post<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object,
    cognitoAccessToken: boolean = false
  ): Promise<T> {
    return await super.post<T>(url, statusCode, options, cognitoAccessToken)
  }
}
