import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'
import { SettingsPage } from './pages/settings.page'

test('full mode: light surface has data-mode="full" by default', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()

  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'full')
})

test('full mode: settings shows lightTemperature and lightBrightness sliders', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  await expect(page.getByRole('slider', { name: 'Light temperature' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Light brightness' })).toBeVisible()
})

test('full mode: adjusting lightBrightness changes the surface filter', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  const slider = page.getByRole('slider', { name: 'Light brightness' })
  await slider.focus()
  for (let i = 0; i < 50; i++) {
    await page.keyboard.press('ArrowLeft')
  }

  const filter = await settings.lightSurface.evaluate((el) => (el as HTMLElement).style.filter)
  expect(filter).toMatch(/brightness\(0\.5\)/)
})

test('full-color mode: surface has data-mode="full-color" after switch', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('full-color')

  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'full-color')
})

test('full-color mode: only lightColor picker visible; no brightness or temperature slider', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('full-color')

  await expect(page.getByRole('slider', { name: 'Light brightness' })).not.toBeVisible()
  await expect(page.getByRole('slider', { name: 'Light temperature' })).not.toBeVisible()
  await expect(page.getByLabel('Light color picker')).toBeVisible()
})

test('ring mode: surface has data-mode="ring" after switch', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('ring')

  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'ring')
})

test('ring mode: settings shows all ring sliders', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('ring')

  await expect(page.getByRole('slider', { name: 'Light temperature' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Light brightness' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Inner radius' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Outer radius' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Background light temperature' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Background light brightness' })).toBeVisible()
})

test('ring mode: adjusting innerRadius updates foreground gradient', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('ring')

  const fg = page.getByTestId('light-surface-fg')
  const before = await fg.evaluate((el) => (el as HTMLElement).style.backgroundImage)

  const innerSlider = page.getByRole('slider', { name: 'Inner radius' })
  await innerSlider.focus()
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowRight')
  }

  const after = await fg.evaluate((el) => (el as HTMLElement).style.backgroundImage)
  expect(after).not.toBe(before)
})

test('ring-color mode: surface has data-mode="ring-color" after switch', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('ring-color')

  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'ring-color')
})

test('ring-color mode: settings shows lightColor, innerRadius, outerRadius, backgroundColor; no temperature/brightness', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('ring-color')

  await expect(page.getByLabel('Light color picker')).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Inner radius' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Outer radius' })).toBeVisible()
  await expect(page.getByLabel('Background color picker')).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Light temperature' })).not.toBeVisible()
  await expect(page.getByRole('slider', { name: 'Light brightness' })).not.toBeVisible()
})

test('spot mode: surface has data-mode="spot" after switch', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('spot')

  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'spot')
})

test('spot mode: settings shows lightTemperature, lightBrightness, radius, backgroundLightTemperature, backgroundLightBrightness', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('spot')

  await expect(page.getByRole('slider', { name: 'Light temperature' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Light brightness' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Radius' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Background light temperature' })).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Background light brightness' })).toBeVisible()
})

test('spot mode: adjusting radius updates foreground gradient', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('spot')

  const fg = page.getByTestId('light-surface-fg')
  const before = await fg.evaluate((el) => (el as HTMLElement).style.backgroundImage)

  const radiusSlider = page.getByRole('slider', { name: 'Radius' })
  await radiusSlider.focus()
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowRight')
  }

  const after = await fg.evaluate((el) => (el as HTMLElement).style.backgroundImage)
  expect(after).not.toBe(before)
})

test('spot-color mode: surface has data-mode="spot-color" after switch', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('spot-color')

  await expect(settings.lightSurface).toHaveAttribute('data-mode', 'spot-color')
})

test('spot-color mode: settings shows lightColor, radius, backgroundColor; no temperature/brightness slider', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()
  await settings.selectMode('spot-color')

  await expect(page.getByLabel('Light color picker')).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Radius' })).toBeVisible()
  await expect(page.getByLabel('Background color picker')).toBeVisible()
  await expect(page.getByRole('slider', { name: 'Light temperature' })).not.toBeVisible()
  await expect(page.getByRole('slider', { name: 'Light brightness' })).not.toBeVisible()
})
