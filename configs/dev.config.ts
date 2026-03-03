import { PlaywrightTestConfig } from '@playwright/test'
import defineConfig from '../playwright.config'

process.env.ENV = 'dev'
process.env.apiURL =
  'https://ephemeral-protected.api.dev.cdp-int.defra.cloud/cads-data-service'
const config: PlaywrightTestConfig = {
  ...defineConfig,
  use: {
    ...defineConfig.use,
    baseURL: 'https://cads-mis.dev.cdp-int.defra.cloud'
  }
}

export default config
