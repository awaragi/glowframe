import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'

test.describe('Clock keyboard shortcuts', () => {
  test('T key cycles clock: bottom-left → bottom-right → off → top-left → bottom-left', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    // Clock is on by default at bottom-left
    await expect(page.getByLabel('Digital clock')).toBeVisible()

    // Press T → bottom-right (still visible)
    await page.keyboard.press('t')
    await expect(page.getByLabel('Digital clock')).toBeVisible()

    // Press T → off
    await page.keyboard.press('t')
    await expect(page.getByLabel('Digital clock')).not.toBeVisible()

    // Press T → top-left
    await page.keyboard.press('t')
    await expect(page.getByLabel('Digital clock')).toBeVisible()

    // Press T → bottom-left (back to start)
    await page.keyboard.press('t')
    await expect(page.getByLabel('Digital clock')).toBeVisible()
  })

  test('Shift+T cycles clock size', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    // Clock is on by default
    const clock = page.getByLabel('Digital clock')
    await expect(clock).toBeVisible()

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
