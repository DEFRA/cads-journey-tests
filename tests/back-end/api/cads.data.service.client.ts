import { StatusCodes } from 'http-status-codes'
import { BaseClient } from './base.client'

export class CadsDataService extends BaseClient {
  async get<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object,
    params?: { [key: string]: string | number | boolean }
  ): Promise<T> {
    return await super.get<T>(url, statusCode, options, params)
  }
}
