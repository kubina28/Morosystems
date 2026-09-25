import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../../base/base.page';
import { step } from '@automation/common';

export class GoogleResultsPage extends BasePage {
  readonly searchBox: Locator;
  readonly resultsContainer: Locator;
  readonly organicResultLinks: Locator;

  constructor(page: Page) {
    super(page);
    // The results page also contains a hidden input named "q", the combobox role narrows it to the visible box.
    this.searchBox = page.getByRole('combobox').and(page.locator('[name="q"]'));
    this.resultsContainer = page.locator('#rso');
    this.organicResultLinks = this.resultsContainer.locator('a').filter({ has: page.locator('h3') });
  }

  resultLink(title: string): Locator {
    return this.organicResultLinks
      .filter({ has: this.page.getByRole('heading', { name: title, exact: true }) })
      .first();
  }

  @step((title: string) => `Open search result "${title}"`)
  async openResult(title: string): Promise<void> {
    await this.resultLink(title).click();
    await this.page.waitForURL((url) => !url.hostname.includes('google.'));
  }
}
