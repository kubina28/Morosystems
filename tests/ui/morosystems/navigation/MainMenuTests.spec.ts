import { careerPage, expect, moroHomePage, MorosystemsRoutes, page, test } from '@automation/ui';
import { Tag } from '@automation/common';

test.describe('MainMenuTests', { tag: [Tag.Regression, Tag.Career] }, () => {
  test('MainMenu_ClickCareer_OpensCareerPage', async () => {
    // Arrange
    await moroHomePage.open();

    // Act
    await moroHomePage.header.goToCareer();

    // Assert
    await expect(page).toHaveURL(new RegExp(`${MorosystemsRoutes.careerPagePath}$`));
    await expect(careerPage.positionsHeading).toBeVisible();
  });
});
