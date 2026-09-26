import { careerPage, expect, moroHomePage, MorosystemsRoutes, page, test } from '@automation/ui';
import { expectVisualMatch, Tag } from '@automation/common';

test.describe('MainMenuTests', { tag: [Tag.Regression, Tag.Career] }, () => {
  test('MainMenu_ClickCareer_CareerPageIsOpened', async () => {
    // Arrange
    await moroHomePage.open();

    // Act
    await moroHomePage.header.goToCareer();

    // Assert
    await expect(page).toHaveURL(new RegExp(`${MorosystemsRoutes.careerPagePath}$`));
    await expect(careerPage.jobPositionsHeading).toBeVisible();
    await expectVisualMatch(page, 'career-page', careerPage.dynamicContent);
  });
});
