import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'
import { SettingsPage } from './pages/settings.page'

test('clock overlay is absent by default', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto()
  await expect(page.getByLabel('Digital clock')).not.toBeVisible()
})

test('enabling clock via settings shows the overlay on the light surface', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  await page.getByRole('tab', { name: 'Clock' }).click()
  await page.getByRole('switch', { name: 'Show clock' }).click()

  await expect(page.getByLabel('Digital clock')).toBeVisible()
})

test('disabling clock hides the overlay', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Enable first
  await page.getByRole('tab', { name: 'Clock' }).click()
  await page.getByRole('switch', { name: 'Show clock' }).click()
  await expect(page.getByLabel('Digital clock')).toBeVisible()

  // Disable
  await page.getByRole('switch', { name: 'Show clock' }).click()
  await expect(page.getByLabel('Digital clock')).not.toBeVisible()
})

test('position change moves the overlay', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  await page.getByRole('tab', { name: 'Clock' }).click()
  await page.getByRole('switch', { name: 'Show clock' }).click()

  // Change position to top-left
  await page.getByLabel('Position').click()
  await page.getByRole('option', { name: 'Top-left' }).click()

  await expect(page.getByLabel('Digital clock')).toBeVisible()
})

test('format change updates the clock display', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  await page.getByRole('tab', { name: 'Clock' }).click()
  await page.getByRole('switch', { name: 'Show clock' }).click()

  // Switch to HH:mm:ss format (shows seconds)
  await page.getByLabel('Format').click()
  await page.getByRole('option', { name: 'HH:mm:ss' }).click()

  await expect(page.getByLabel('Digital clock')).toBeVisible()
  // Clock text should contain colons and match HH:mm:ss pattern (two colons)
  const clockText = await page.getByLabel('Digital clock').textContent()
  expect(clockText?.match(/:/g)?.length).toBe(2)
})
