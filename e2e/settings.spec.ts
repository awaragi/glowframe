import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'
import { SettingsPage } from './pages/settings.page'

test('gear button opens settings modal', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await expect(settings.gearButton).toBeVisible()
  await settings.open()
  await expect(settings.title).toBeVisible()
})

test('settings modal: creating a new profile adds it to the list', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.newProfileButton.click()
  await expect(page.locator('[aria-label="Profile list"] button', { hasText: 'New Profile' })).toBeVisible()
})

test('settings modal: switching profiles updates the active profile indicator', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Create a second profile
  await settings.newProfileButton.click()
  const newProfileBtn = page.locator('[aria-label="Profile list"] button', { hasText: 'New Profile' })
  await expect(newProfileBtn).toBeVisible()

  // Switch to the new profile
  await newProfileBtn.click()
  await expect(newProfileBtn).toHaveAttribute('aria-pressed', 'true')

  // Switch back to Default
  const defaultBtn = page.locator('[aria-label="Profile list"] button', { hasText: 'Default' })
  await defaultBtn.click()
  await expect(defaultBtn).toHaveAttribute('aria-pressed', 'true')
  await expect(newProfileBtn).toHaveAttribute('aria-pressed', 'false')
})

test('settings modal: brightness slider changes the light surface filter', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Focus the brightness slider thumb and use keyboard to lower brightness
  const brightnessThumb = settings.brightnessSliderThumb
  await brightnessThumb.focus()

  // Each ArrowLeft press decreases by 1; press 50 times to go from 100 → 50
  for (let i = 0; i < 50; i++) {
    await page.keyboard.press('ArrowLeft')
  }

  // The light surface filter should reflect reduced brightness
  const lightSurface = page.getByTestId('light-surface')
  const filter = await lightSurface.evaluate((el) => (el as HTMLElement).style.filter)
  expect(filter).toBe('brightness(0.5)')
})
