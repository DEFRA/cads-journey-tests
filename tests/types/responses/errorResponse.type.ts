export type ValidationErrors = {
  LastModifiedDate?: string[]
  Cph?: string[]
}

export type ErrorResponse = {
  type: string
  title: string
  status: number
  errors: ValidationErrors
  traceId: string
}
