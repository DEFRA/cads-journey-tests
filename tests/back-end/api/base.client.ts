import { expect, APIRequestContext } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

export abstract class BaseClient {
  protected readonly apiContext: APIRequestContext

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext
  }

  // eslint-disable-next-line
  private prepareRemoteRequest(options?: any) {
    if (options !== undefined && options !== null) {
      if (!options.headers) {
        options.headers = {}
      }
      options.headers['Content-Type'] = 'application/json'
      options.headers['x-api-key'] = process.env.apiKey
    } else {
      options = {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.apiKey
        }
      }
    }
    return options
  }

  protected async get<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object
  ) {
    const response = await this.apiContext.get(url, options)
    expect(response.status()).toEqual(statusCode)
    return (await response.json()) as T
  }

  protected async post<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object
  ) {
    if (process.env.apiKey !== 'undefined') {
      const apiKeyOptions = this.prepareRemoteRequest(options)
      options = apiKeyOptions
    }
    const response = await this.apiContext.post(url, options)
    expect(response.status()).toEqual(statusCode)
    return (await response.json()) as T
  }

  protected async postWithResponseReturn(url: string, options?: object) {
    if (process.env.apiKey !== 'undefined') {
      const apiKeyOptions = this.prepareRemoteRequest(options)
      options = apiKeyOptions
    }
    return await this.apiContext.post(url, options)
  }

  protected async put<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object
  ) {
    if (process.env.apiKey !== 'undefined') {
      const apiKeyOptions = this.prepareRemoteRequest(options)
      options = apiKeyOptions
    }
    const response = await this.apiContext.put(url, options)
    expect(response.status()).toEqual(statusCode)
    return (await response.json()) as T
  }
}
