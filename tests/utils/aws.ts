import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { FileNames } from './enums'
import { CadsDataService } from '../back-end/api/cads.data.service.client'
import { APIRequestContext } from '@playwright/test'

const execAsync = promisify(exec)
const apiContext: APIRequestContext = {} as APIRequestContext
const cadsDataService = new CadsDataService(apiContext)

async function executeAwsCommand(command: string) {
  const { stdout, stderr } = await execAsync(command)

  if (stderr) {
    console.error(stderr)
  }

  return stdout.trim()
}

/** Use env credentials when present (Docker); otherwise the local `localstack` AWS profile. */
function awsAuthFlags() {
  return process.env.AWS_ACCESS_KEY_ID && !cadsDataService.isCDPEnvironment
    ? ''
    : '--profile localstack'
}

export async function uploadFile(fileName: string) {
  const result = await executeAwsCommand(
    `aws s3 cp ${FileNames.Path!}${fileName} s3://cads-external-bucket/cads/cts/bulk/${fileName} --endpoint-url=${process.env.AWS_S3_BUCKET_ENDPOINT!} ${awsAuthFlags()}`.trim()
  )

  return result
}

type S3Object = {
  lastModified: string
  size: number
  key: string
}

export async function getCadsExternalBucket(): Promise<S3Object[]> {
  const auth = awsAuthFlags()
  const command = !cadsDataService.isCDPEnvironment
    ? `aws s3 ls s3://cads-external-bucket/ --endpoint-url=${process.env.AWS_S3_BUCKET_ENDPOINT!} ${auth} --recursive`.trim()
    : `aws s3 ls s3:${process.env.AWS_S3_BUCKET_NAME!} ${auth} --recursive`.trim()
  const result = await executeAwsCommand(command)

  return result
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => {
      const [date, time, size, ...key] = line.trim().split(/\s+/)
      return {
        lastModified: `${date} ${time}`,
        size: Number(size),
        key: key.join(' ')
      }
    })
}
