import { expect, type Locator, type Page } from '@playwright/test';
import { MorosystemsRoutes } from '../../../constants/routes';
import { Language } from '../../../enums/language.enum';
import { step } from '@automation/common';
import { LanguageSwitcher } from './language-switcher.component';

export class MoroHeader {
  readonly root: Locator;
  readonly careerLink: Locator;
  readonly aboutUsSubmenuToggle: Locator;
  readonly mobileMenuToggle: Locator;
  readonly languageSwitcher: LanguageSwitcher;

  constructor(private readonly page: Page) {
    this.root = page.locator('header');
    this.careerLink = this.root.getByRole('link', { name: 'Kariéra', exact: true });
    this.aboutUsSubmenuToggle = this.root.locator('.item-about .dropdown__toggle-btn');
    this.mobileMenuToggle = this.root.getByRole('link', { name: 'Menu', exact: true });
    this.languageSwitcher = new LanguageSwitcher(page);
  }

  @step((language: Language) => `Switch website language to "${language}"`)
  async switchLanguage(language: Language): Promise<void> {
    await this.languageSwitcher.switchTo(language);
  }

  // Responsive menu: "Kariéra" is top level from ~1920 px, in the "O nás" submenu below, behind the burger on mobile.
  @step('Navigate to "Kariéra" page via main menu')
  async goToCareer(): Promise<void> {
    await expect(
      this.careerLink
        .or(this.aboutUsSubmenuToggle)
        .or(this.mobileMenuToggle)
        .filter({ visible: true })
        .first(),
    ).toBeVisible();
    if (await this.mobileMenuToggle.isVisible()) {
      await this.mobileMenuToggle.click();
    } else if (!(await this.careerLink.isVisible())) {
      await this.aboutUsSubmenuToggle.click();
    }
    await this.careerLink.click();
    await this.page.waitForURL(`**${MorosystemsRoutes.careerPagePath}`);
  }
}
