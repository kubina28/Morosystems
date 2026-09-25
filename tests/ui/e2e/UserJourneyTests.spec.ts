import {
  careerPage,
  City,
  expect,
  googleResultsPage,
  GoogleSearchData,
  googleSearchPage,
  moroHomePage,
  MorosystemsRoutes,
  page,
  test,
} from '@automation/ui';
import { enumKeyOf, Tag } from '@automation/common';

const defaultCity = City.Brno;
const defaultCityKey = enumKeyOf(City, defaultCity);

test.describe('UserJourneyTests', { tag: [Tag.Smoke, Tag.E2E, Tag.Google] }, () => {
  test(`UserJourney_FindMoroSystemsOnGoogleAndFilterBy${defaultCityKey}_ShowsOnlyPositionsIn${defaultCityKey}`, async () => {
    // Arrange
    await googleSearchPage.open();
    await googleSearchPage.search(GoogleSearchData.morosystemsSearchText);
    await expect(googleResultsPage.resultsContainer).toBeVisible();
    await expect(googleResultsPage.resultLink(GoogleSearchData.morosystemsHomepageTitle)).toContainText(
      GoogleSearchData.morosystemsDomain,
    );

    await googleResultsPage.openResult(GoogleSearchData.morosystemsHomepageTitle);
    await expect(page).toHaveTitle(GoogleSearchData.morosystemsHomepageTitle);

    await moroHomePage.header.goToCareer();
    await expect(page).toHaveURL(new RegExp(`${MorosystemsRoutes.careerPagePath}$`));
    await expect(careerPage.positionsHeading).toBeVisible();

    // Act
    await careerPage.filterByCity(defaultCity);

    // Assert
    const visiblePositions = await careerPage.getVisiblePositions();
    expect(visiblePositions.length).toBeGreaterThan(0);
    for (const position of visiblePositions) {
      expect(position.locations, `location of "${position.title}"`).toContain(defaultCity);
    }
  });
});
