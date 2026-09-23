import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { FileNames } from './enums'

const execAsync = promisify(exec)

async function executeAwsCommand(command: string) {
  const { stdout, stderr } = await execAsync(command)

  if (stderr) {
    console.error(stderr)
  }

  return stdout.trim()
}

export async function uploadFile(fileName: string) {
  const result = await executeAwsCommand(
    `aws s3 cp ${FileNames.Path!}${fileName} s3://cads-external-bucket/cads/cts/bulk/${fileName} --endpoint-url=${process.env.AWS_S3_BUCKET_ENDPOINT!} --profile localstack`
  )

  return result
}
