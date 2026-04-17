import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'
import { SettingsPage } from './pages/settings.page'

test.describe('Ring radius cross-validation', () => {
  test('error message appears when innerRadius equals outerRadius', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)

    // Seed localStorage with a ring-mode profile where innerRadius is one step below outerRadius
    await page.goto('./')
    await page.evaluate(() => {
      const store = {
        state: {
          _version: 4,
          profiles: [
            {
              id: 'ring-test',
              name: 'Ring Test',
              mode: 'ring',
              lightTemperature: 6500,
              lightBrightness: 100,
              innerRadius: 79,
              outerRadius: 80,
              backgroundLightTemperature: 0,
              backgroundLightBrightness: 0,
            },
          ],
          activeProfileId: 'ring-test',
        },
        version: 4,
      }
      localStorage.setItem('glowframe-store', JSON.stringify(store))
    })
    await home.goto()

    // Open settings and verify ring mode radius sliders are visible
    await settings.open()
    const innerSlider = page.getByRole('slider', { name: 'Inner radius' })
    const outerSlider = page.getByRole('slider', { name: 'Outer radius' })
    await expect(innerSlider).toBeVisible()
    await expect(outerSlider).toBeVisible()

    // Verify no validation error initially
    await expect(page.getByText('Inner radius must be less than outer radius.')).not.toBeVisible()

    // Press ArrowRight on innerRadius once: 79 → 80 (now equal to outerRadius — invalid)
    await innerSlider.focus()
    await page.keyboard.press('ArrowRight')

    // Error message should appear
    await expect(page.getByText('Inner radius must be less than outer radius.')).toBeVisible()
  })

  test('settings are not corrupted when equal radii are set', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)

    await page.goto('./')
    await page.evaluate(() => {
      const store = {
        state: {
          _version: 4,
          profiles: [
            {
              id: 'ring-test',
              name: 'Ring Test',
              mode: 'ring',
              lightTemperature: 6500,
              lightBrightness: 100,
              innerRadius: 79,
              outerRadius: 80,
              backgroundLightTemperature: 0,
              backgroundLightBrightness: 0,
            },
          ],
          activeProfileId: 'ring-test',
        },
        version: 4,
      }
      localStorage.setItem('glowframe-store', JSON.stringify(store))
    })
    await home.goto()

    await settings.open()
    const innerSlider = page.getByRole('slider', { name: 'Inner radius' })
    await innerSlider.focus()

    // Attempt to set innerRadius equal to outerRadius
    await page.keyboard.press('ArrowRight')

    // Verify validation error is shown
    await expect(page.getByText('Inner radius must be less than outer radius.')).toBeVisible()

    // Verify the persisted store still holds the last valid values (innerRadius=79, outerRadius=80)
    const stored = await page.evaluate(() => {
      const raw = localStorage.getItem('glowframe-store')
      if (!raw) return null
      const parsed = JSON.parse(raw)
      const profiles = parsed?.state?.profiles ?? []
      return profiles.find((p: { id: string }) => p.id === 'ring-test') ?? null
    })
    expect(stored).not.toBeNull()
    expect(stored.innerRadius).toBe(79)
    expect(stored.outerRadius).toBe(80)
  })
})
