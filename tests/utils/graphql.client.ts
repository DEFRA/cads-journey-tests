import {
  GraphQLEndpoint,
  GraphQLRequest,
  GraphQLResponse,
  QueryOptions
} from './graphql.types'
import { CadsDataService } from '../back-end/api/cads.data.service.client'
import { StatusCodes } from 'http-status-codes'

export class GraphQLClient extends CadsDataService {
  getEndpoint(endpoint: GraphQLEndpoint): string {
    const endpoints: Record<GraphQLEndpoint, string> = {
      cads: '/graphql/cads',
      cts: '/graphql/cts',
      'cts-audit': '/graphql/cts-audit',
      'cts-transactions': '/graphql/cts-transactions'
    }

    return `${endpoints[endpoint]}`
  }

  buildQuery(options: QueryOptions): string {
    const where = options.filters
      .map((f) => `${f.column}: { eq: $${f.variable} }`)
      .join('\n')

    return `
      query(
        ${options.filters.map((f) => `$${f.variable}: String!`).join(', ')}
      ) {
        ${options.table}(where: {
          ${where}
        }) {
          nodes {
            ${options.returnColumns.join('\n')}
          }
        }
      }
    `
  }

  async execute<
    TData,
    TVariables extends Record<string, unknown> = Record<string, unknown>
  >(
    endpoint: GraphQLEndpoint,
    query: string,
    variables?: TVariables,
    expectedStatusCode: number = StatusCodes.OK
  ): Promise<GraphQLResponse<TData>> {
    const body: GraphQLRequest<TVariables> = {
      query,
      variables
    }

    const response = await this.post<GraphQLResponse<TData>>(
      this.getEndpoint(endpoint),
      expectedStatusCode,
      {
        data: body,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return response
  }
}
