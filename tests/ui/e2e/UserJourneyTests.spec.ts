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
  test(`UserJourney_FindMoroSystemsOnGoogleAndFilterBy${defaultCityKey}_OnlyJobPositionsIn${defaultCityKey}AreDisplayed`, async () => {
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
    await expect(careerPage.jobPositionsHeading).toBeVisible();

    // Act
    await careerPage.filterByCity(defaultCity);

    // Assert
    const visibleJobPositions = await careerPage.getVisibleJobPositions();
    expect(visibleJobPositions.length).toBeGreaterThan(0);
    for (const jobPosition of visibleJobPositions) {
      expect(jobPosition.locations, `location of "${jobPosition.title}"`).toContain(defaultCity);
    }
  });
});
