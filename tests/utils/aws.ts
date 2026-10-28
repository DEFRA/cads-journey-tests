import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { FileNames } from './enums'

const execAsync = promisify(exec)
const LOCAL_BUCKET = 'cads-external-bucket'
const BULK_PREFIX = 'cads/cts/bulk/'

async function executeAwsCommand(command: string) {
  const { stdout, stderr } = await execAsync(command)

  if (stderr) {
    console.error(stderr)
  }

  return stdout.trim()
}

function getEnvironment() {
  return process.env.ENVIRONMENT ?? 'local'
}

function isLocalOrDocker() {
  const env = getEnvironment()
  return env === 'local' || env === 'docker'
}

/** Empty auth for CDP/Docker; `--profile localstack` for local runs. */
function awsAuthFlags() {
  return getEnvironment() === 'local' ? '--profile localstack' : ''
}

/** LocalStack endpoint is only valid for local/docker — never send it on CDP. */
function localstackEndpointFlag() {
  if (!isLocalOrDocker()) {
    return ''
  }
  const endpoint = process.env.AWS_S3_BUCKET_ENDPOINT
  return endpoint ? `--endpoint-url=${endpoint}` : ''
}

/**
 * Always return a concrete object URI (s3://bucket/prefix/) so `aws s3 ls`
 * never falls back to ListAllMyBuckets (denied on the CDP journey-tests role).
 */
function resolveBucketUri(includeBulkPrefix = false) {
  const suffix = includeBulkPrefix ? BULK_PREFIX : ''

  if (isLocalOrDocker()) {
    return `s3://${LOCAL_BUCKET}/${suffix}`
  }

  const raw = process.env.AWS_S3_BUCKET_NAME?.trim()
  if (!raw) {
    throw new Error(
      'AWS_S3_BUCKET_NAME is required in CDP environments (must be the real bucket name, not a LocalStack bucket)'
    )
  }

  const withoutScheme = raw.replace(/^s3:\/\//, '').replace(/^s3:/, '')
  if (!withoutScheme) {
    throw new Error(`Invalid AWS_S3_BUCKET_NAME: ${raw}`)
  }

  const bucketAndOptionalPrefix = withoutScheme.replace(/\/?$/, '/')
  if (includeBulkPrefix && !bucketAndOptionalPrefix.includes(BULK_PREFIX)) {
    return `s3://${bucketAndOptionalPrefix}${BULK_PREFIX}`
  }

  return `s3://${bucketAndOptionalPrefix}`
}

function buildAwsCommand(parts: string[]) {
  return parts.filter((part) => part !== '').join(' ')
}

export async function uploadFile(fileName: string) {
  const destination = `${resolveBucketUri(true)}${fileName}`
  const result = await executeAwsCommand(
    buildAwsCommand([
      'aws',
      's3',
      'cp',
      `${FileNames.Path!}${fileName}`,
      destination,
      localstackEndpointFlag(),
      awsAuthFlags()
    ])
  )

  return result
}

type S3Object = {
  lastModified: string
  size: number
  key: string
}

export async function getCadsExternalBucket(): Promise<S3Object[]> {
  // List under the bulk upload prefix — matches where uploadFile writes objects.
  const uri = resolveBucketUri(true)
  const command = buildAwsCommand([
    'aws',
    's3',
    'ls',
    uri,
    localstackEndpointFlag(),
    awsAuthFlags(),
    '--recursive'
  ])

  console.info(`[aws] ${command}`)
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
