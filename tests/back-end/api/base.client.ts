import { expect, APIRequestContext, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

export abstract class BaseClient {
  protected readonly apiContext: APIRequestContext
  readonly isCDPEnvironment: boolean

  constructor(apiContext: APIRequestContext) {
    this.apiContext = apiContext
    this.isCDPEnvironment = !(
      process.env.ENVIRONMENT === 'docker' ||
      process.env.ENVIRONMENT === 'local'
    )
  }

  private async getCognitoAccessToken(): Promise<string> {
    const response = await this.apiContext.post(
      `https://cads-data-service-${process.env.COGNITO_ENVIRONMENT}.auth.eu-west-2.amazoncognito.com/oauth2/token`,
      {
        headers: {
          Authorization: `Basic ${process.env.AUTH_BASIC_COGNITO_TOKEN}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          grant_type: 'client_credentials',
          client_id: process.env.COGNITO_CLIENT_ID!,
          client_secret: process.env.COGNITO_CLIENT_SECRET!
        }
      }
    )

    if (!response.ok()) {
      throw new Error(
        `Failed to retrieve token (${response.status()}): ${await response.text()}`
      )
    }

    const body = await response.json()

    return body.access_token
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private async prepareRemoteRequest(
    url: string,
    options?: any,
    cognitoAccessToken: boolean = false
  ) {
    if (options !== undefined && options !== null) {
      if (!options.headers) {
        options.headers = {}
      }
      options.headers['Content-Type'] = 'application/json'
    } else {
      options = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }
    if (cognitoAccessToken) {
      const cognitoAccessToken = await this.getCognitoAccessToken()
      options.headers.Authorization = `Bearer ${cognitoAccessToken}`
    } else {
      options.headers.Authorization = `Basic ${process.env.AUTH_BASIC_TOKEN}`
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
    params?: { [key: string]: string | number | boolean },
    cognitoAccessToken: boolean = false
  ) {
    const { apiKeyOptions, absoluteUrl } = await this.prepareRemoteRequest(
      url,
      options,
      cognitoAccessToken
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
    options?: object,
    cognitoAccessToken: boolean = false
  ) {
    const { apiKeyOptions, absoluteUrl } = await this.prepareRemoteRequest(
      url,
      options,
      cognitoAccessToken
    )
    options = apiKeyOptions
    url = absoluteUrl
    const response = await this.apiContext.post(url, options)
    expect(response.status()).toEqual(statusCode)
    return (await response.json()) as T
  }

  protected async postWithResponseReturn(url: string, options?: object) {
    const { apiKeyOptions, absoluteUrl } = await this.prepareRemoteRequest(
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
    options?: object,
    cognitoAccessToken: boolean = false
  ) {
    const { apiKeyOptions, absoluteUrl } = await this.prepareRemoteRequest(
      url,
      options,
      cognitoAccessToken
    )
    options = apiKeyOptions
    url = absoluteUrl
    const response = await this.apiContext.put(url, options)
    expect(response.status()).toEqual(statusCode)
    return (await response.json()) as T
  }
}
