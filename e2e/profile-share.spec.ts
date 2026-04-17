import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'
import { SettingsPage } from './pages/settings.page'

test.describe('profile share URL', () => {
  test('share button copies a valid URL to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    const home = new HomePage(page)
    const settings = new SettingsPage(page)
    await home.goto()
    await settings.open()

    const shareButton = page.getByTestId('copy-share-link')
    await expect(shareButton).toBeVisible()
    await shareButton.click()

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toContain('?profile=')
    expect(clipboardText).toContain(page.url().replace(/\?.*$/, ''))
  })

  test('navigating to share URL shows import dialog with correct profile name', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    const home = new HomePage(page)
    const settings = new SettingsPage(page)

    // First get the share URL
    await home.goto()
    await settings.open()

    const shareButton = page.getByTestId('copy-share-link')
    await shareButton.click()

    const shareUrl = await page.evaluate(() => navigator.clipboard.readText())

    // Navigate to the share URL in a new page
    await page.goto(shareUrl)

    const dialog = page.getByTestId('import-profile-dialog')
    await expect(dialog).toBeVisible()

    // Dialog should mention "Default" (the default profile name)
    await expect(dialog).toContainText('Default')
  })

  test('confirming import adds profile to list and cleans URL', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    const home = new HomePage(page)
    const settings = new SettingsPage(page)

    // Get share URL
    await home.goto()
    await settings.open()

    const shareButton = page.getByTestId('copy-share-link')
    await shareButton.click()

    const shareUrl = await page.evaluate(() => navigator.clipboard.readText())

    // Navigate to share URL
    await page.goto(shareUrl)

    // Confirm import
    const dialog = page.getByTestId('import-profile-dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: /import/i }).click()

    // Dialog should be gone
    await expect(dialog).not.toBeVisible()

    // URL should be clean (no ?profile= param)
    expect(page.url()).not.toContain('?profile=')

    // Open settings and verify the imported profile appears in the list
    await settings.open()
    const profileButtons = page.locator('[aria-label="Profile list"] button[aria-pressed]')
    await expect(profileButtons).toHaveCount(2)
  })

  test('dismissing import dialog cleans URL without adding profile', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    const home = new HomePage(page)
    const settings = new SettingsPage(page)

    await home.goto()
    await settings.open()

    const shareButton = page.getByTestId('copy-share-link')
    await shareButton.click()

    const shareUrl = await page.evaluate(() => navigator.clipboard.readText())

    await page.goto(shareUrl)

    const dialog = page.getByTestId('import-profile-dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: /dismiss/i }).click()

    await expect(dialog).not.toBeVisible()
    expect(page.url()).not.toContain('?profile=')

    // Profile list should still have only 1 profile
    await settings.open()
    const profileButtons = page.locator('[aria-label="Profile list"] button[aria-pressed]')
    await expect(profileButtons).toHaveCount(1)
  })

  test('malformed ?profile= param shows error toast and no import dialog', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    const baseUrl = page.url().replace(/\?.*$/, '')
    await page.goto(`${baseUrl}?profile=this-is-not-valid-json%21%21%21`)

    // Import dialog should NOT appear
    await expect(page.getByTestId('import-profile-dialog')).not.toBeVisible()

    // Error toast must be visible
    await expect(page.getByText('Invalid share link')).toBeVisible()

    // URL should remain dirty
    expect(page.url()).toContain('?profile=')
  })

  test('truncated ?profile= param (last char removed) shows error toast', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)

    await home.goto()
    await settings.open()

    const shareButton = page.getByTestId('copy-share-link')
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
    await shareButton.click()

    const shareUrl = await page.evaluate(() => navigator.clipboard.readText())
    const truncatedUrl = shareUrl.slice(0, -1) // remove last character (the 'D' of %7D)

    await page.goto(truncatedUrl)

    // Import dialog should NOT appear
    await expect(page.getByTestId('import-profile-dialog')).not.toBeVisible()

    // Error toast must be visible
    await expect(page.getByText('Invalid share link')).toBeVisible()

    // URL should remain dirty (unchanged)
    expect(page.url()).toContain('?profile=')
  })
})
