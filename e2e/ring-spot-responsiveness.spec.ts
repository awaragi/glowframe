/**
 * E2E tests verifying that ring and spot mode surfaces are truly responsive:
 * the foreground gradient tile is sized to min(100vw, 100vh), so that
 * the circle always fits within the screen and 100% corresponds to the
 * smaller viewport dimension.
 */
import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'
import { SettingsPage } from './pages/settings.page'

async function getFgBackgroundSize(page: SettingsPage['page']): Promise<string> {
  const fg = page.getByTestId('light-surface-fg')
  return fg.evaluate((el) => getComputedStyle(el).backgroundSize)
}

async function getFgBackgroundImage(page: SettingsPage['page']): Promise<string> {
  const fg = page.getByTestId('light-surface-fg')
  return fg.evaluate((el) => getComputedStyle(el).backgroundImage)
}

// On a landscape viewport (width > height), min(vw, vh) == vh.
// The computed backgroundSize must resolve to viewport-height px (not viewport-width px).
test.describe('ring/spot responsiveness — landscape viewport', () => {
  test.use({ viewport: { width: 1200, height: 600 } })

  test('ring mode: backgroundSize resolves to min dimension (height in landscape)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('ring')

    const size = await getFgBackgroundSize(page)
    // In landscape 1200×600, min(vw,vh) = 600px
    expect(size).toBe('600px 600px')
  })

  test('ring mode: backgroundSize is NOT max-dimension (1200px in landscape)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('ring')

    const size = await getFgBackgroundSize(page)
    expect(size).not.toBe('1200px 1200px')
  })

  test('ring mode: gradient uses closest-side shape', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('ring')

    const image = await getFgBackgroundImage(page)
    expect(image).toContain('closest-side')
  })

  test('ring-color mode: backgroundSize resolves to min dimension (height in landscape)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('ring-color')

    const size = await getFgBackgroundSize(page)
    expect(size).toBe('600px 600px')
  })

  test('ring-color mode: gradient uses closest-side shape', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('ring-color')

    const image = await getFgBackgroundImage(page)
    expect(image).toContain('closest-side')
  })

  test('spot mode: backgroundSize resolves to min dimension (height in landscape)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('spot')

    const size = await getFgBackgroundSize(page)
    expect(size).toBe('600px 600px')
  })

  test('spot mode: backgroundSize is NOT max-dimension (1200px in landscape)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('spot')

    const size = await getFgBackgroundSize(page)
    expect(size).not.toBe('1200px 1200px')
  })

  test('spot mode: gradient uses closest-side shape', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('spot')

    const image = await getFgBackgroundImage(page)
    expect(image).toContain('closest-side')
  })

  test('spot-color mode: backgroundSize resolves to min dimension (height in landscape)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('spot-color')

    const size = await getFgBackgroundSize(page)
    expect(size).toBe('600px 600px')
  })

  test('spot-color mode: gradient uses closest-side shape', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('spot-color')

    const image = await getFgBackgroundImage(page)
    expect(image).toContain('closest-side')
  })
})

// On a portrait viewport (height > width), min(vw, vh) == vw.
// The computed backgroundSize must resolve to viewport-width px.
test.describe('ring/spot responsiveness — portrait viewport', () => {
  test.use({ viewport: { width: 600, height: 1200 } })

  test('ring mode: backgroundSize resolves to min dimension (width in portrait)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('ring')

    const size = await getFgBackgroundSize(page)
    // In portrait 600×1200, min(vw,vh) = 600px
    expect(size).toBe('600px 600px')
  })

  test('ring mode: backgroundSize is NOT max-dimension (1200px in portrait)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('ring')

    const size = await getFgBackgroundSize(page)
    expect(size).not.toBe('1200px 1200px')
  })

  test('spot mode: backgroundSize resolves to min dimension (width in portrait)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('spot')

    const size = await getFgBackgroundSize(page)
    expect(size).toBe('600px 600px')
  })

  test('spot mode: backgroundSize is NOT max-dimension (1200px in portrait)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('spot')

    const size = await getFgBackgroundSize(page)
    expect(size).not.toBe('1200px 1200px')
  })
})

// On a square viewport, min == max so both match — but closest-side must be present.
test.describe('ring/spot responsiveness — square viewport', () => {
  test.use({ viewport: { width: 800, height: 800 } })

  test('ring mode: backgroundSize resolves to min dimension (width == height on square)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('ring')

    const size = await getFgBackgroundSize(page)
    expect(size).toBe('800px 800px')
  })

  test('spot mode: backgroundSize resolves to min dimension (width == height on square)', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()
    await settings.selectMode('spot')

    const size = await getFgBackgroundSize(page)
    expect(size).toBe('800px 800px')
  })
})
