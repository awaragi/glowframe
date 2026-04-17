import { test, expect } from '@playwright/test'
import { HomePage } from './pages/home.page'
import { SettingsPage } from './pages/settings.page'

test('preset reordering: sequence numbers are visible', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Create two extra profiles so we have three total
  await settings.newProfileButton.click()
  await settings.newProfileButton.click()

  const profileList = page.locator('[aria-label="Profile list"]')
  const rows = profileList.locator('li')
  await expect(rows).toHaveCount(3)

  // Each row should have a visible sequence badge
  const badges = profileList.locator('li span.tabular-nums')
  await expect(badges.nth(0)).toHaveText('1')
  await expect(badges.nth(1)).toHaveText('2')
  await expect(badges.nth(2)).toHaveText('3')
})

test('preset reordering: drag handles are rendered on every row', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Create a second profile
  await settings.newProfileButton.click()

  const handles = page.getByRole('button', { name: 'Drag to reorder' })
  await expect(handles).toHaveCount(2)
})

test('preset reordering: pressing 1 activates the first profile in display order', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Create a second profile — it becomes active ("New Profile")
  await settings.newProfileButton.click()
  const profileList = page.locator('[aria-label="Profile list"]')
  await expect(profileList.locator('li')).toHaveCount(2)

  // Close settings with Escape, then press '1' — should activate the first profile (Default)
  await page.keyboard.press('Escape')
  await expect(settings.title).not.toBeVisible()
  await page.keyboard.press('1')

  // Reopen to verify active state — Default should now be active
  await settings.open()
  const defaultBtn = profileList.locator('button[aria-pressed]', { hasText: 'Default' })
  await expect(defaultBtn).toHaveAttribute('aria-pressed', 'true')
})

test('preset reordering: keyboard drag moves profile from position 2 to position 1', async ({ page }) => {
  const home = new HomePage(page)
  const settings = new SettingsPage(page)
  await home.goto()
  await settings.open()

  // Create one extra profile so we have Default (row 1) and "New Profile" (row 2)
  await settings.newProfileButton.click()

  const profileList = page.locator('[aria-label="Profile list"]')
  const rows = profileList.locator('li')
  await expect(rows).toHaveCount(2)

  // Capture initial profile names in order
  const profileButtons = profileList.locator('button[aria-pressed]')
  const nameBefore1 = await profileButtons.nth(1).textContent()

  // Focus the drag handle of row 2 (index 1, "New Profile")
  const handles = page.getByRole('button', { name: 'Drag to reorder' })
  await handles.nth(1).focus()
  await expect(handles.nth(1)).toBeFocused()

  // Press ArrowUp — direct keyboard reorder (no Space activation needed)
  await page.keyboard.press('ArrowUp')

  // Row 0 should now be "New Profile" (moved up from row 1)
  await expect(profileButtons.nth(0)).toHaveText(nameBefore1!)
})

