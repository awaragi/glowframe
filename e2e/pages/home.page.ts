import type { Page } from '@playwright/test'

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    // './' resolves correctly against both http://localhost:5173 (local)
    // and https://awaragi.github.io/glowframe/ (prod sub-path base URL).
    // Using '/' would strip the sub-path and navigate to origin root.
    await this.page.goto('./')
  }

  title() {
    return this.page.title()
  }

  get lightSurface() {
    return this.page.getByTestId('light-surface')
  }

  get root() {
    return this.page.locator('#root')
  }
}
