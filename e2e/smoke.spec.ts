import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'

test('home page loads and shows the light surface', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto()
  await expect(page).toHaveTitle(/GlowFrame|Vite/)
  await expect(home.lightSurface).toBeVisible()
  await expect(home.root).toBeVisible()

  const box = await home.lightSurface.boundingBox()
  const viewport = page.viewportSize()!
  expect(box!.width).toBe(viewport.width)
  expect(box!.height).toBe(viewport.height)
})

test('light surface remains visible after going offline', async ({ page, context }) => {
  const home = new HomePage(page)
  await home.goto()
  await expect(home.lightSurface).toBeVisible()

  await context.setOffline(true)
  await expect(home.lightSurface).toBeVisible()
})
