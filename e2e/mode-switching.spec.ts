import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'
import { SettingsPage } from './pages/settings.page'

test('destructive switch clears old mode fields: ring → full removes ring controls', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Start in ring mode and adjust innerRadius
  await settings.selectMode('ring')
  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'ring')
  const innerSlider = page.getByRole('slider', { name: 'Inner radius' })
  await innerSlider.focus()
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowRight')
  }

  // Switch to full
  await settings.selectMode('full')
  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'full')
  await expect(page.getByRole('slider', { name: 'Inner radius' })).not.toBeVisible()
  await expect(page.getByRole('slider', { name: 'Outer radius' })).not.toBeVisible()
})

test('cycle through all six modes in sequence', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  const sequence = ['full', 'full-color', 'ring', 'ring-color', 'spot', 'spot-color'] as const

  for (const mode of sequence) {
    await settings.selectMode(mode)
    await expect(settings.lightSurface).toHaveAttribute('data-mode', mode)
  }
})

test('default values applied on switch to spot: lightBrightness=100, radius=40', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  await settings.selectMode('spot')

  await expect(page.getByText(/Light Brightness \(100%\)/)).toBeVisible()
  await expect(page.getByText(/Radius \(40%\)/)).toBeVisible()
})

test('profile identity preserved on mode switch', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Create a profile named Studio
  await settings.newProfileButton.click()
  const studioBtn = page.locator('[aria-label="Profile list"] button', { hasText: 'New Profile' })
  await expect(studioBtn).toBeVisible()

  // Switch its mode to ring-color
  await settings.selectMode('ring-color')
  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'ring-color')

  // Profile is still listed and active
  await expect(studioBtn).toHaveAttribute('aria-pressed', 'true')
})

test('multiple profiles with different modes: switching profiles changes data-mode', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Default profile starts as full
  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'full')

  // Create a second profile
  await settings.newProfileButton.click()
  const newProfileBtn = page.locator('[aria-label="Profile list"] button', { hasText: 'New Profile' })
  await expect(newProfileBtn).toBeVisible()

  // Set second profile to spot-color
  await settings.selectMode('spot-color')
  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'spot-color')

  // Switch back to Default profile
  const defaultBtn = page.locator('[aria-label="Profile list"] button', { hasText: 'Default' })
  await defaultBtn.click()
  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'full')

  // Switch back to new profile
  await newProfileBtn.click()
  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'spot-color')
})
