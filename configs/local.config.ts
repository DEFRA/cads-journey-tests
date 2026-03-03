import { PlaywrightTestConfig } from '@playwright/test'
import defineConfig from '../playwright.config'

process.env.ENV = 'local'
process.env.apiURL = 'http://localhost:5555'
const config: PlaywrightTestConfig = {
  ...defineConfig,
  use: {
    ...defineConfig.use,
    baseURL: 'http://localhost:3000'
  }
}

export default config
