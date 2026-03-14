import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'

test('home page loads and shows GlowFrame title', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto()
  await expect(page).toHaveTitle(/GlowFrame|Vite/)
  await expect(home.heading).toBeVisible()
  await expect(home.root).toBeVisible()
})
