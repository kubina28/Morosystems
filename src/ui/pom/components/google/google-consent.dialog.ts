import type { Locator, Page } from '@playwright/test';

export class GoogleConsentDialog {
  readonly root: Locator;
  readonly acceptAllButton: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByRole('dialog', { name: /Google/ });
    this.acceptAllButton = this.root.getByRole('button', { name: /^(Přijmout vše|Accept all)$/ });
  }

  async acceptWhenDisplayed(): Promise<void> {
    await this.page.addLocatorHandler(this.acceptAllButton, async (button) => {
      await button.click();
    });
  }
}
