import {
  careerPage,
  expect,
  Language,
  morosystemsHomePage,
  MorosystemsLanguageBaseUrls,
  page,
  test,
} from '@automation/ui';
import { enumKeyOf, escapeRegExp, Tag } from '@automation/common';

const languagesWithoutCareer = [Language.English, Language.German];

test.describe('LanguageVersionTests', { tag: [Tag.Regression, Tag.Career] }, () => {
  for (const language of languagesWithoutCareer) {
    const languageName = enumKeyOf(Language, language);

    test(`LanguageVersion_Open${languageName}Homepage_CareerLinkIsNotOffered`, async () => {
      // Act
      await morosystemsHomePage.open(language);

      // Assert
      await expect(morosystemsHomePage.documentLanguage).toHaveAttribute('lang', new RegExp(`^${language}`));
      await expect(morosystemsHomePage.careerLinks).toHaveCount(0);
    });

    test(`LanguageVersion_SwitchTo${languageName}OnCareerPage_${languageName}HomepageIsOpened`, async () => {
      // Arrange
      await careerPage.open();

      // Act
      await careerPage.header.switchLanguage(language);

      // Assert
      const languageBaseUrl = MorosystemsLanguageBaseUrls[language];
      await expect(page).toHaveURL(new RegExp(`^${escapeRegExp(languageBaseUrl)}`));
      await expect(morosystemsHomePage.documentLanguage).toHaveAttribute('lang', new RegExp(`^${language}`));
      await expect(morosystemsHomePage.careerLinks).toHaveCount(0);
    });
  }
});
