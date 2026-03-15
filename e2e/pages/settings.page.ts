import type { Page } from '@playwright/test'

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
    return this.page.getByRole('button', { name: 'New profile' })
  }

  get brightnessSliderThumb() {
    // The brightness slider section label contains "Brightness"
    return this.page.locator('section', { hasText: /Brightness \(/ }).getByRole('slider').first()
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
