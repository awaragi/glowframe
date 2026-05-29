import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'

test.describe('Clock keyboard shortcuts', () => {
  test('T key cycles clock: off → top-left → bottom-left → bottom-right → off', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    // Initially clock is off by default
    await expect(page.getByLabel('Digital clock')).not.toBeVisible()

    // Press T → clock on at top-left
    await page.keyboard.press('t')
    await expect(page.getByLabel('Digital clock')).toBeVisible()

    // Press T → bottom-left
    await page.keyboard.press('t')
    await expect(page.getByLabel('Digital clock')).toBeVisible()

    // Press T → bottom-right
    await page.keyboard.press('t')
    await expect(page.getByLabel('Digital clock')).toBeVisible()

    // Press T → off
    await page.keyboard.press('t')
    await expect(page.getByLabel('Digital clock')).not.toBeVisible()
  })

  test('Shift+T cycles clock size', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    // Enable the clock first so we can observe size class changes
    await page.keyboard.press('t')
    await expect(page.getByLabel('Digital clock')).toBeVisible()

    const clock = page.getByLabel('Digital clock')

    // Default size is 'medium' (text-4xl) — cycle to large
    await page.keyboard.press('Shift+T')
    await expect(clock).toHaveClass(/text-6xl/)

    // Cycle to small
    await page.keyboard.press('Shift+T')
    await expect(clock).toHaveClass(/text-2xl/)

    // Cycle back to medium
    await page.keyboard.press('Shift+T')
    await expect(clock).toHaveClass(/text-4xl/)
  })

  test('help dialog shows Clock shortcuts group with T and Shift+T', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    await page.keyboard.press('?')
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('region', { name: 'Clock shortcuts' })).toBeVisible()

    const clockSection = page.getByRole('region', { name: 'Clock shortcuts' })
    await expect(clockSection.getByText('Cycle clock position / off')).toBeVisible()
    await expect(clockSection.getByText('Cycle clock size')).toBeVisible()
  })
})
