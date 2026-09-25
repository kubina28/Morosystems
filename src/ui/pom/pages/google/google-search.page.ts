import type { Locator, Page } from '@playwright/test';
import { environment, step } from '@automation/common';
import { BasePage } from '../../base/base.page';
import { skipIfBlockedByGoogleCaptcha } from '../../../utils/google-captcha.guard';

export class GoogleSearchPage extends BasePage {
  readonly searchBox: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.getByRole('combobox').and(page.locator('[name="q"]'));
  }

  @step('Open Google search page')
  async open(): Promise<void> {
    await this.navigateTo(environment.googleHomepageUrl);
  }

  @step((query: string) => `Search Google for "${query}"`)
  async search(query: string): Promise<void> {
    // Typing key by key (instead of fill) behaves like a real user and lowers the chance of a CAPTCHA.
    await this.searchBox.pressSequentially(query, { delay: 50 });
    await this.searchBox.press('Enter');
    await this.page.waitForURL(/\/(search|sorry)/);
    skipIfBlockedByGoogleCaptcha(this.page);
  }
}
