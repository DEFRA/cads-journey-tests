export interface UploadRequest {
  data: {
    fileName: string
    content: string
    overwriteExisting?: boolean
  }
}
