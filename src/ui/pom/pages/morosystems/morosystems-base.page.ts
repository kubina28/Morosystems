import { expect, type Locator, type Page } from '@playwright/test';
import { type DynamicContent, environment, step } from '@automation/common';
import { BasePage } from '../../base/base.page';
import { MorosystemsHeader } from '../../components/morosystems/morosystems-header.component';

export abstract class MorosystemsBasePage extends BasePage {
  readonly header: MorosystemsHeader;
  readonly documentLanguage: Locator;
  readonly careerLinks: Locator;

  protected constructor(page: Page) {
    super(page);
    this.header = new MorosystemsHeader(page);
    this.documentLanguage = page.locator('html');
    this.careerLinks = page.getByRole('link', { name: /kariéra|career|karriere|jobs?\b/i });
  }

  get dynamicContent(): DynamicContent {
    return {
      hidden: ['img', 'video', 'iframe'],
      removed: ['.c-team', '.c-quotes', '.c-works', '#cookiescript_badge'],
    };
  }

  // WP Rocket loads the website scripts on the first user interaction and the page renders differently before
  // (see BUG-001), so a key press brings the page to the state a user sees.
  @step('Load website scripts delayed until the first user interaction')
  async loadDelayedScripts(): Promise<void> {
    await this.page.keyboard.press('Shift');
    await expect(this.page.locator('html')).not.toHaveClass(/\bno-js\b/);
  }

  protected async openRoute(route: string): Promise<void> {
    await this.navigateTo(new URL(route, environment.morosystemsBaseUrl).toString());
  }
}
