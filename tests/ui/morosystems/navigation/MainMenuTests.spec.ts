import { careerPage, expect, morosystemsHomePage, MorosystemsRoutes, page, test } from '@automation/ui';
import { expectVisualMatch, Tag } from '@automation/common';

test.describe('MainMenuTests', { tag: [Tag.Regression, Tag.Career] }, () => {
  test('MainMenu_ClickCareer_CareerPageIsOpened', async () => {
    // Arrange
    await morosystemsHomePage.open();

    // Act
    await morosystemsHomePage.header.goToCareer();

    // Assert
    await expect(page).toHaveURL(new RegExp(`${MorosystemsRoutes.careerPagePath}$`));
    await expect(careerPage.jobPositionsHeading).toBeVisible();
    await careerPage.loadDelayedScripts();
    await expectVisualMatch(page, 'career-page', careerPage.dynamicContent);
  });
});
