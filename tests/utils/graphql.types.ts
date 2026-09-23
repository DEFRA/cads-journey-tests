export type GraphQLEndpoint = 'cads' | 'cts' | 'cts-audit' | 'cts-transactions'

export const GraphQLSchema = {
  AnimalSexes: {
    table: 'animalSexes',
    columns: {
      Sex: 'sex',
      Description: 'description'
    }
  }
} as const

export type AnimalSexs = 'male' | 'female'

export interface Filter {
  column: string
  variable: string
}

export interface QueryOptions {
  table: string
  filters: Filter[]
  returnColumns: string[]
}

export interface GraphQLRequest<TVariables = Record<string, unknown>> {
  query: string
  variables?: TVariables
}

export interface GraphQLError {
  message: string
  locations?: Array<string | number>
  extensions?: Record<string, unknown>
}

export interface GraphQLResponse<TData> {
  data?: TData
  errors?: GraphQLError[]
}

export interface AnimalSexesResponse {
  animalSexes: {
    nodes: {
      sex: string
    }[]
  }
}
