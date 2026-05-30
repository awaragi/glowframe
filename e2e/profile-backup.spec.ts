import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'
import { SettingsPage } from './pages/settings.page'

const validBackupJson = JSON.stringify({
  version: 1,
  profiles: [
    {
      name: 'Backup Alpha',
      light: { mode: 'full', lightTemperature: 6500, lightBrightness: 80 },
      clock: { enabled: true, position: 'bottom-left', size: 'medium', format: 'HH:mm' },
    },
    {
      name: 'Backup Beta',
      light: { mode: 'full-color', lightColor: '#ff8800' },
      clock: { enabled: false, position: 'top-left', size: 'small', format: 'hh:mm a' },
    },
  ],
}, null, 2)

test.describe('profile backup', () => {
  test('clicking Export presets triggers a file download', async ({ page }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)

    await home.goto()
    await settings.open()

    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('export-presets-button').click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toBe('glowframe-backup.json')
  })

  test('injecting a valid backup file shows restore dialog and replaces presets on confirm', async ({
    page,
  }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)

    await home.goto()
    await settings.open()

    // Inject valid backup via file input
    await page.getByTestId('restore-file-input').setInputFiles({
      name: 'glowframe-backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(validBackupJson),
    })

    // Restore dialog should appear
    const dialog = page.getByTestId('restore-backup-dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('2 presets')

    // Confirm restore
    await page.getByTestId('confirm-restore-button').click()
    await expect(dialog).not.toBeVisible()

    // Preset list should be replaced with backup profiles
    const profileButtons = page.locator('[aria-label="Profile list"] button[aria-pressed]')
    await expect(profileButtons).toHaveCount(2)
    await expect(page.locator('[aria-label="Profile list"]')).toContainText('Backup Alpha')
    await expect(page.locator('[aria-label="Profile list"]')).toContainText('Backup Beta')

    // First preset should be active (aria-pressed="true")
    const firstButton = profileButtons.first()
    await expect(firstButton).toHaveAttribute('aria-pressed', 'true')
    await expect(firstButton).toContainText('Backup Alpha')
  })

  test('injecting an invalid JSON file shows error toast and no restore dialog', async ({
    page,
  }) => {
    const home = new HomePage(page)
    const settings = new SettingsPage(page)

    await home.goto()
    await settings.open()

    // Inject invalid JSON
    await page.getByTestId('restore-file-input').setInputFiles({
      name: 'bad.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{ this is not valid json'),
    })

    // Restore dialog must NOT appear
    await expect(page.getByTestId('restore-backup-dialog')).not.toBeVisible()

    // Error toast should appear
    await expect(page.getByText('Invalid backup file')).toBeVisible()
  })
})
