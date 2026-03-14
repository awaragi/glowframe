import { test, expect } from '@playwright/test'

test('home page loads and shows GlowFrame title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/GlowFrame|Vite/)
  await expect(page.getByText('GlowFrame')).toBeVisible()
  await expect(page.locator('#root')).toBeVisible()
})
