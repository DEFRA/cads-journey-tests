import {
  FileImportBatchResponse,
  GraphQLEndpoint,
  GraphQLRequest,
  GraphQLResponse,
  QueryOptions
} from './graphql.types'
import { CadsDataService } from '../back-end/api/cads.data.service.client'
import { StatusCodes } from 'http-status-codes'

export enum fileImportBatchStatuses {
  ImportComplete = 'ImportComplete',
  ProcessingComplete = 'ProcessingComplete',
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Failed = 'Failed'
}

export class GraphQLClient extends CadsDataService {
  getEndpoint(endpoint: GraphQLEndpoint): string {
    const endpoints: Record<GraphQLEndpoint, string> = {
      cads: '/graphql/cads',
      cts: '/graphql/cts',
      'cts-audit': '/graphql/cts-audit',
      'cts-transactions': '/graphql/cts-transactions',
      'file-import-batch': '/graphql/file-import-batch'
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

  async getfileImportBatchStatus(
    batchId: string,
    fileName?: string
  ): Promise<fileImportBatchStatuses> {
    const startTime = Date.now()
    const timeoutMs = 120_000
    const intervalMs = 2_000
    let tries = 0
    while (Date.now() - startTime < timeoutMs) {
      const response = await this.execute<FileImportBatchResponse>(
        'file-import-batch',
        `
        query {
          fileImportBatch(id: ${batchId}, fileName: ${fileName}) {
            status
            fileName
          }
        }
      `,
        { batchId, fileName }
      )

      const status = response.data?.status as fileImportBatchStatuses

      console.log(`Batch: ${batchId} Status: ${status} (Tries: ${tries++})`)

      switch (status) {
        case fileImportBatchStatuses.ImportComplete:
        case fileImportBatchStatuses.ProcessingComplete:
          return status
        case fileImportBatchStatuses.Failed:
          throw new Error(`File import batch ${batchId} failed`)
        case fileImportBatchStatuses.Pending:
        case fileImportBatchStatuses.InProgress:
          break

        default:
          throw new Error(`Unexpected batch status: ${status}`)
      }

      const remainingMs = timeoutMs - (Date.now() - startTime)

      if (remainingMs <= 0) break

      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(intervalMs, remainingMs))
      )
    }

    throw new Error(
      `File import batch ${batchId} timed out after ${timeoutMs}ms`
    )
  }
}
