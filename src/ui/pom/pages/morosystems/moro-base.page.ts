import type { Locator, Page } from '@playwright/test';
import { type DynamicContent, environment } from '@automation/common';
import { BasePage } from '../../base/base.page';
import { MoroHeader } from '../../components/morosystems/moro-header.component';

export abstract class MoroBasePage extends BasePage {
  readonly header: MoroHeader;
  readonly documentLanguage: Locator;
  readonly careerLinks: Locator;

  protected constructor(page: Page) {
    super(page);
    this.header = new MoroHeader(page);
    this.documentLanguage = page.locator('html');
    this.careerLinks = page.getByRole('link', { name: /kariéra|career|karriere|jobs?\b/i });
  }

  get dynamicContent(): DynamicContent {
    return {
      hidden: [this.page.locator('img, video, iframe')],
      removed: [this.page.locator('.c-team, .c-quotes, .c-works')],
    };
  }

  protected async openRoute(route: string): Promise<void> {
    await this.navigateTo(new URL(route, environment.morosystemsBaseUrl).toString());
  }
}
