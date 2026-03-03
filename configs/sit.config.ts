import { PlaywrightTestConfig } from '@playwright/test'
import defineConfig from '../playwright.config'

process.env.ENV = 'sit'
process.env.apiURL = 'http://localhost:3000'
const config: PlaywrightTestConfig = {
  ...defineConfig,
  use: {
    ...defineConfig.use,
    baseURL: ''
  }
}

export default config
