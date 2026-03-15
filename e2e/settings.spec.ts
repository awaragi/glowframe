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

test('full mode brightness persists across reload', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Default mode is full — lower lightBrightness slider by 50
  const brightnessSlider = page.getByRole('slider', { name: 'Light brightness' })
  await brightnessSlider.focus()
  for (let i = 0; i < 50; i++) {
    await page.keyboard.press('ArrowLeft')
  }

  // Verify filter changed
  const filterBefore = await settings.lightSurface.evaluate((el) => (el as HTMLElement).style.filter)
  expect(filterBefore).toMatch(/brightness\(0\.5\)/)

  // Reload and verify persistence
  await page.reload()
  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'full')
  const filterAfter = await settings.lightSurface.evaluate((el) => (el as HTMLElement).style.filter)
  expect(filterAfter).toMatch(/brightness\(0\.5\)/)
})

test('ring-color mode innerRadius persists across reload', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  await settings.selectMode('ring-color')

  const innerSlider = page.getByRole('slider', { name: 'Inner radius' })
  await innerSlider.focus()
  // Increase innerRadius by 10 from default (20)
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowRight')
  }

  await expect(page.getByText(/Inner Radius \(30%\)/)).toBeVisible()

  await page.reload()
  await settings.open()
  await expect(page.getByText(/Inner Radius \(30%\)/)).toBeVisible()
})

test('mode selection persists across reload', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  await settings.selectMode('spot-color')
  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'spot-color')

  await page.reload()
  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'spot-color')
})

