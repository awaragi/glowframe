import type { Page } from '@playwright/test'

const MODE_LABELS: Record<string, string> = {
  'full': 'Full',
  'full-color': 'Full Color',
  'ring': 'Ring',
  'ring-color': 'Ring Color',
  'spot': 'Spot',
  'spot-color': 'Spot Color',
}

export class SettingsPage {
  constructor(private readonly page: Page) {}

  get gearButton() {
    return this.page.getByRole('button', { name: 'Open settings' })
  }

  get modal() {
    return this.page.getByTestId('settings-modal')
  }

  get title() {
    return this.page.getByText('Settings')
  }

  get newProfileButton() {
    return this.page.getByRole('button', { name: 'New profile', exact: true })
  }

  get modeSelector() {
    return this.page.getByTestId('mode-selector')
  }

  get lightSurface() {
    return this.page.getByTestId('light-surface')
  }

  async lightSurfaceMode() {
    return this.page.getByTestId('light-surface').getAttribute('data-mode')
  }

  async selectMode(mode: string) {
    await this.modeSelector.click()
    const label = MODE_LABELS[mode] ?? mode
    await this.page.getByRole('option', { name: label, exact: true }).click()
  }

  profileButton(name: string) {
    return this.page.getByRole('button', { name, exact: true }).or(
      this.page.locator('button', { hasText: name }).filter({ has: this.page.locator('[aria-pressed]') })
    )
  }

  profileListItem(name: string) {
    return this.page.locator('[aria-label="Profile list"] button', { hasText: name })
  }

  async open() {
    await this.gearButton.click()
    await this.title.waitFor({ state: 'visible' })
  }
}
