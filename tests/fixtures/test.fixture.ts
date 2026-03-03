import { mergeTests } from '@playwright/test'
import { backendTests } from '../fixtures/backend.fixture'
import { frontendTests } from '../fixtures/frontend.fixture'

export const test = mergeTests(backendTests, frontendTests)

test.afterEach(async ({ page }) => {
  await page.close()
})

export { expect } from '@playwright/test'
