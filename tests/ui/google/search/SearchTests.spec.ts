import { expect, googleResultsPage, GoogleSearchData, googleSearchPage, page, test } from '@automation/ui';
import { Tag } from '@automation/common';

test.describe('SearchTests', { tag: [Tag.Regression, Tag.Google] }, () => {
  test.beforeEach(async () => {
    // Arrange
    await googleSearchPage.open();
  });

  test('GoogleSearch_SearchMoroSystems_ShowsResultsPage', async () => {
    // Act
    await googleSearchPage.search(GoogleSearchData.morosystemsSearchText);

    // Assert
    await expect(page).toHaveURL(GoogleSearchData.searchResultsUrlPattern);
    await expect(page).toHaveTitle(new RegExp(GoogleSearchData.morosystemsSearchText));
    await expect(googleResultsPage.searchBox).toHaveValue(GoogleSearchData.morosystemsSearchText);
    await expect(googleResultsPage.resultsContainer).toBeVisible();
    await expect(googleResultsPage.organicResultLinks.first()).toBeVisible();
  });

  test('GoogleSearch_SearchMoroSystems_ListsMoroSystemsWebsite', async () => {
    // Act
    await googleSearchPage.search(GoogleSearchData.morosystemsSearchText);

    // Assert
    const moroSystemsResult = googleResultsPage.resultLink(GoogleSearchData.morosystemsHomepageTitle);
    await expect(moroSystemsResult).toBeVisible();
    await expect(moroSystemsResult).toContainText(GoogleSearchData.morosystemsDomain);
  });

  test('GoogleSearch_OpenMoroSystemsResult_OpensMoroSystemsWebsite', async () => {
    // Arrange
    await googleSearchPage.search(GoogleSearchData.morosystemsSearchText);

    // Act
    await googleResultsPage.openResult(GoogleSearchData.morosystemsHomepageTitle);

    // Assert
    await expect(page).toHaveURL(new RegExp(GoogleSearchData.morosystemsDomain));
    await expect(page).toHaveTitle(GoogleSearchData.morosystemsHomepageTitle);
  });
});
