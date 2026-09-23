import { expect, APIRequestContext } from '@playwright/test'
import {
  AnimalSexesResponse,
  AnimalSexs,
  GraphQLSchema
} from '../../utils/graphql.types'
import { GraphQLClient } from '../../utils/graphql.client'
import { StatusCodes } from 'http-status-codes'

export class GraphQlApiStepDefinitions {
  private readonly graphqlClient: GraphQLClient
  private requestContext: APIRequestContext

  constructor(apiContext: APIRequestContext) {
    this.graphqlClient = new GraphQLClient(apiContext)
    this.requestContext = apiContext
  }

  async getRequestToCadSEndpointReturnsAnimalSexes(sex: AnimalSexs) {
    const query = this.graphqlClient.buildQuery({
      table: GraphQLSchema.AnimalSexes.table,
      filters: [
        { column: GraphQLSchema.AnimalSexes.columns.Sex, variable: 'sex' }
      ],
      returnColumns: [GraphQLSchema.AnimalSexes.columns.Sex]
    })
    const response = await this.graphqlClient.execute<AnimalSexesResponse>(
      'cads',
      query,
      { sex }
    )
    expect(response.data).toBeDefined()
    expect(response.data?.animalSexes.nodes.length).toBeGreaterThan(0)
    expect(response.data?.animalSexes.nodes[0].sex).toBe(sex.toLowerCase())
  }

  async getRequestToCadSEndpointReturns400BadRequestInvalidRequest() {
    const query = this.graphqlClient.buildQuery({
      table: GraphQLSchema.AnimalSexes.table,
      filters: [{ column: 'InvalidColumn', variable: 'sex' }],
      returnColumns: ['InvalidColumn']
    })
    const response = await this.graphqlClient.execute<AnimalSexesResponse>(
      'cads',
      query,
      { sex: 'male' },
      StatusCodes.BAD_REQUEST
    )
    expect(response.errors).toBeDefined()
    expect(response.errors?.[0].message).toContain(
      'The field `InvalidColumn` does not exist on the type `AnimalSex`.'
    )
  }

  async getRequestToCadSEndpointReturns401Unauthorized() {
    const response = await this.requestContext.post(
      this.graphqlClient.getEndpoint('cads'),
      {
        data: 'query { animalSexes { nodes { sex } } }',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
  }
}
