export type UploadResponse = {
  fileName: string
  externalS3Bucket: string
  externalS3Key: number[]
  sizeBytes: number
  uploadedAt: string
}
