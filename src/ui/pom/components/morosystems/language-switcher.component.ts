import type { Locator, Page } from '@playwright/test';
import { Language } from '../../../enums/language.enum';

export class LanguageSwitcher {
  readonly root: Locator;
  readonly toggle: Locator;

  constructor(page: Page) {
    this.root = page.locator('header .dropdown--langs');
    this.toggle = this.root.locator('.js-toggle-dropdown');
  }

  languageLink(language: Language): Locator {
    return this.root.getByRole('link', { name: language, exact: true });
  }

  async switchTo(language: Language): Promise<void> {
    await this.toggle.click();
    await this.languageLink(language).click();
  }
}
