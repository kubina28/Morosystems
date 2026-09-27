import type { Page } from '@playwright/test';
import { MorosystemsLanguageBaseUrls } from '../../../constants/routes';
import { Language } from '../../../enums/language.enum';
import { step } from '@automation/common';
import { MorosystemsBasePage } from './morosystems-base.page';

export class MorosystemsHomePage extends MorosystemsBasePage {
  constructor(page: Page) {
    super(page);
  }

  @step((language: Language = Language.Czech) => `Open MoroSystems home page ("${language}")`)
  async open(language: Language = Language.Czech): Promise<void> {
    await this.navigateTo(MorosystemsLanguageBaseUrls[language]);
  }
}
