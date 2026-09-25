import { expect, type Locator, type Page } from '@playwright/test';
import { City } from '../../../enums/city.enum';
import { escapeRegExp, normalizeWhitespace } from '@automation/common';

const OPEN_STATE = /\bis-open\b/;

export class CitySelect {
  readonly root: Locator;
  readonly toggle: Locator;
  readonly selectedValue: Locator;
  readonly options: Locator;
  readonly checkedOptions: Locator;

  constructor(page: Page) {
    this.root = page.locator('.inp-custom-select');
    this.toggle = this.root.locator('.inp-custom-select__select');
    this.selectedValue = this.root.locator('.inp-custom-select__select-wrap');
    this.options = this.root.locator('.inp-custom-select__item');
    this.checkedOptions = this.options.filter({ has: page.locator('input:checked') });
  }

  option(city: City): Locator {
    return this.options.filter({ hasText: new RegExp(`^\\s*${escapeRegExp(city)}\\s*$`) });
  }

  async select(city: City): Promise<void> {
    await this.toggle.click();
    await expect(this.root, 'City select should open on the first click').toHaveClass(OPEN_STATE);
    await this.option(city).click();
    await expect(this.root).not.toHaveClass(OPEN_STATE);
    await expect(this.selectedValue).toHaveText(city);
  }

  async getOptionLabels(): Promise<string[]> {
    const labels = await this.options.allTextContents();
    return labels.map(normalizeWhitespace);
  }
}
