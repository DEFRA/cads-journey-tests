import { expect, APIRequestContext, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

export abstract class BaseClient {
  protected readonly apiContext: APIRequestContext

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext
  }

  // eslint-disable-next-line
  private prepareRemoteRequest(url: string, options?: any) {
    if (options !== undefined && options !== null) {
      if (!options.headers) {
        options.headers = {}
      }
      options.headers['Content-Type'] = 'application/json'
      options.headers.Authorization = `Basic ${process.env.AUTH_BASIC_TOKEN}`
    } else {
      options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${process.env.AUTH_BASIC_TOKEN}`
        }
      }
    }
    if (process.env.apiKey !== 'undefined' && process.env.CDP === undefined) {
      options.headers['x-api-key'] = process.env.apiKey
      // APIRequestContext removes /cads-data-service from the endpoint
      const absoluteUrl = '/cads-data-service' + url
      const apiKeyOptions = options
      return { apiKeyOptions, absoluteUrl }
    } else {
      return { apiKeyOptions: options, absoluteUrl: url }
    }
  }

  protected async get<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object,
    params?: { [key: string]: string | number | boolean }
  ) {
    const { apiKeyOptions, absoluteUrl } = this.prepareRemoteRequest(
      url,
      options
    )
    options = apiKeyOptions
    url = absoluteUrl
    await test.step('getLocationsWithCPHAndModifiedDate', async () => {
      console.info('Options: ' + JSON.stringify(options))
      console.info('Params: ' + JSON.stringify(params))
      console.info('Url: ' + url)
    })
    const response = await this.apiContext.get(url, {
      ...options,
      ...(params ? { params } : {})
    })
    await test.step('getLocationsWithCPHAndModifiedDate', async () => {
      console.info('Response: ' + JSON.stringify(response))
      console.info('Response body: ' + JSON.stringify(await response.json()))
    })
    expect(response.status()).toEqual(statusCode)
    return (await response.json()) as T
  }

  protected async post<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object
  ) {
    const { apiKeyOptions, absoluteUrl } = this.prepareRemoteRequest(
      url,
      options
    )
    options = apiKeyOptions
    url = absoluteUrl
    const response = await this.apiContext.post(url, options)
    expect(response.status()).toEqual(statusCode)
    return (await response.json()) as T
  }

  protected async postWithResponseReturn(url: string, options?: object) {
    const { apiKeyOptions, absoluteUrl } = this.prepareRemoteRequest(
      url,
      options
    )
    options = apiKeyOptions
    url = absoluteUrl
    return await this.apiContext.post(url, options)
  }

  protected async put<T>(
    url: string,
    statusCode: StatusCodes,
    options?: object
  ) {
    const { apiKeyOptions, absoluteUrl } = this.prepareRemoteRequest(
      url,
      options
    )
    options = apiKeyOptions
    url = absoluteUrl
    const response = await this.apiContext.put(url, options)
    expect(response.status()).toEqual(statusCode)
    return (await response.json()) as T
  }
}
