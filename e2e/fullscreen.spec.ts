import { expect, test } from '@playwright/test'
import { HomePage } from './pages/home.page'

test('fullscreen button is visible on the light page', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto()
  await expect(
    page.getByRole('button', { name: 'Enter fullscreen' }),
  ).toBeVisible()
})

test('fullscreen button shows Exit fullscreen label after entering fullscreen', async ({
  page,
}) => {
  const home = new HomePage(page)
  await home.goto()

  // Simulate the browser entering fullscreen by setting fullscreenElement
  // and dispatching the fullscreenchange event (headless chromium may not
  // support the actual Fullscreen API, so we drive the UI via the event).
  await page.evaluate(() => {
    Object.defineProperty(document, 'fullscreenElement', {
      get: () => document.documentElement,
      configurable: true,
    })
    document.dispatchEvent(new Event('fullscreenchange'))
  })

  await expect(
    page.getByRole('button', { name: 'Exit fullscreen' }),
  ).toBeVisible()
})

test('fullscreen button reverts to Enter fullscreen label after exiting fullscreen', async ({
  page,
}) => {
  const home = new HomePage(page)
  await home.goto()

  // Enter
  await page.evaluate(() => {
    Object.defineProperty(document, 'fullscreenElement', {
      get: () => document.documentElement,
      configurable: true,
    })
    document.dispatchEvent(new Event('fullscreenchange'))
  })

  await expect(
    page.getByRole('button', { name: 'Exit fullscreen' }),
  ).toBeVisible()

  // Exit
  await page.evaluate(() => {
    Object.defineProperty(document, 'fullscreenElement', {
      get: () => null,
      configurable: true,
    })
    document.dispatchEvent(new Event('fullscreenchange'))
  })

  await expect(
    page.getByRole('button', { name: 'Enter fullscreen' }),
  ).toBeVisible()
})

test('pressing F key triggers fullscreen toggle', async ({ page }) => {
  const home = new HomePage(page)
  await home.goto()

  // Intercept requestFullscreen call to verify it was invoked
  const requestFullscreenCalled = await page.evaluate(() => {
    let called = false
    const original = HTMLElement.prototype.requestFullscreen
    HTMLElement.prototype.requestFullscreen = function (...args) {
      called = true
      HTMLElement.prototype.requestFullscreen = original
      return Promise.resolve()
    }
    ;(window as Window & { _testFullscreenCalled?: () => boolean })._testFullscreenCalled = () => called
    return typeof document.fullscreenEnabled !== 'undefined'
      ? true
      : false
  })

  if (!requestFullscreenCalled) {
    // API not available in this environment — skip keybind test
    test.skip()
    return
  }

  await page.keyboard.press('f')

  const wasCalled = await page.evaluate(
    () =>
      (
        window as Window & { _testFullscreenCalled?: () => boolean }
      )._testFullscreenCalled?.() ?? false,
  )
  expect(wasCalled).toBe(true)
})
