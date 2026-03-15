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

test('settings modal: brightness slider responds to mouse clicks at midpoint', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  const slider = settings.brightnessSlider
  const box = await slider.boundingBox()
  expect(box).not.toBeNull()

  // Click at the horizontal midpoint of the slider — should set brightness to ~50
  await page.mouse.click(box!.x + box!.width * 0.5, box!.y + box!.height / 2)

  // Label should now show a value around 50
  const labelText = await settings.brightnessLabel.textContent()
  const match = labelText?.match(/Brightness \((\d+)%\)/)
  expect(match).not.toBeNull()
  const value = Number(match![1])
  expect(value).toBeGreaterThanOrEqual(45)
  expect(value).toBeLessThanOrEqual(55)
})

test('settings modal: brightness slider click at left quarter sets low value', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  const slider = settings.brightnessSlider
  const box = await slider.boundingBox()
  expect(box).not.toBeNull()

  // Click at 25% from left — should set brightness to roughly 25
  await page.mouse.click(box!.x + box!.width * 0.25, box!.y + box!.height / 2)

  const labelText = await settings.brightnessLabel.textContent()
  const match = labelText?.match(/Brightness \((\d+)%\)/)
  expect(match).not.toBeNull()
  const value = Number(match![1])
  // Allow a reasonable range around 25
  expect(value).toBeGreaterThanOrEqual(15)
  expect(value).toBeLessThanOrEqual(35)
})

test('settings modal: brightness slider click at right quarter sets high value', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  const slider = settings.brightnessSlider
  const box = await slider.boundingBox()
  expect(box).not.toBeNull()

  // Click at 75% from left — should set brightness to roughly 75
  await page.mouse.click(box!.x + box!.width * 0.75, box!.y + box!.height / 2)

  const labelText = await settings.brightnessLabel.textContent()
  const match = labelText?.match(/Brightness \((\d+)%\)/)
  expect(match).not.toBeNull()
  const value = Number(match![1])
  expect(value).toBeGreaterThanOrEqual(65)
  expect(value).toBeLessThanOrEqual(85)
})

test('settings modal: brightness slider mouse click updates light surface filter', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  const slider = settings.brightnessSlider
  const box = await slider.boundingBox()
  expect(box).not.toBeNull()

  // Click at 50% to set brightness to ~50 and verify filter
  await page.mouse.click(box!.x + box!.width * 0.5, box!.y + box!.height / 2)

  const lightSurface = page.getByTestId('light-surface')
  const filter = await lightSurface.evaluate((el) => (el as HTMLElement).style.filter)
  // filter should be ~brightness(0.5) — not undefined or brightness(1)
  expect(filter).toMatch(/brightness\(0\.[3-7]/)
})

test('settings modal: color temperature slider responds to mouse clicks', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  const slider = settings.colorTemperatureSlider
  const box = await slider.boundingBox()
  expect(box).not.toBeNull()

  // Click at the leftmost 10% — should result in a low color temperature (close to 1000K)
  await page.mouse.click(box!.x + box!.width * 0.1, box!.y + box!.height / 2)

  const labelText = await settings.colorTemperatureLabel.textContent()
  const match = labelText?.match(/Color Temperature \((\d+)K\)/)
  expect(match).not.toBeNull()
  const value = Number(match![1])
  // Should be in the low range (1000–3000K for a 10% click)
  expect(value).toBeGreaterThanOrEqual(1000)
  expect(value).toBeLessThanOrEqual(3000)
})

test('settings modal: color temperature slider click at midpoint sets mid value', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  const slider = settings.colorTemperatureSlider
  const box = await slider.boundingBox()
  expect(box).not.toBeNull()

  // Click at 50% — should set colorTemperature to ~5500K (midpoint of 1000–10000)
  await page.mouse.click(box!.x + box!.width * 0.5, box!.y + box!.height / 2)

  const labelText = await settings.colorTemperatureLabel.textContent()
  const match = labelText?.match(/Color Temperature \((\d+)K\)/)
  expect(match).not.toBeNull()
  const value = Number(match![1])
  expect(value).toBeGreaterThanOrEqual(4500)
  expect(value).toBeLessThanOrEqual(6500)
})

test('settings modal: slider values persist to localStorage after mouse interaction', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Set brightness to ~50 via mouse click
  const brightnessSlider = settings.brightnessSlider
  const box = await brightnessSlider.boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.click(box!.x + box!.width * 0.5, box!.y + box!.height / 2)

  // Wait for label to update
  await expect(settings.brightnessLabel).toContainText('Brightness (')

  // Read localStorage and verify brightness is stored and not undefined
  const stored = await page.evaluate(() => {
    const raw = localStorage.getItem('glowframe-store')
    if (!raw) return null
    const data = JSON.parse(raw)
    const profile = data?.state?.profiles?.[0]
    return profile ? { brightness: profile.brightness } : null
  })
  expect(stored).not.toBeNull()
  expect(typeof stored!.brightness).toBe('number')
  expect(stored!.brightness).toBeGreaterThanOrEqual(45)
  expect(stored!.brightness).toBeLessThanOrEqual(55)
})

