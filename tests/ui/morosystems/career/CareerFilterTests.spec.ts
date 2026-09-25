import { careerPage, City, expect, test } from '@automation/ui';
import { enumKeyOf, Tag } from '@automation/common';

const defaultCity = City.Brno;
const alternativeCity = City.Prague;
const defaultCityKey = enumKeyOf(City, defaultCity);
const alternativeCityKey = enumKeyOf(City, alternativeCity);
const representativeCities = [City.HradecKralove, alternativeCity];

// Open positions change over time, so results are validated against the rendered positions, not a fixed list.
test.describe('CareerFilterTests', { tag: [Tag.Regression, Tag.Career] }, () => {
  test.beforeEach(async () => {
    // Arrange
    await careerPage.open();
    await expect(careerPage.positionsHeading).toBeVisible();
  });

  test('CareerFilter_OpenCitySelect_OffersAllCitiesWithAllCitiesSelected', async () => {
    // Act
    const optionLabels = await careerPage.citySelect.getOptionLabels();

    // Assert
    await expect(careerPage.citySelect.selectedValue).toHaveText(City.AllCities);
    expect(optionLabels).toEqual(Object.values(City));
  });

  test(`CareerFilter_Select${defaultCityKey}_ShowsExactlyPositionsIn${defaultCityKey}`, async () => {
    // Arrange
    const allPositions = await careerPage.getAllPositions();
    const expectedPositions = allPositions.filter((position) => position.locations.includes(defaultCity));

    // Act
    await careerPage.filterByCity(defaultCity);

    // Assert
    const visiblePositions = await careerPage.getVisiblePositions();
    expect(visiblePositions.length, 'at least one open position is expected').toBeGreaterThan(0);
    expect(visiblePositions).toEqual(expectedPositions);
  });

  for (const city of representativeCities) {
    const cityKey = enumKeyOf(City, city);

    test(`CareerFilter_Select${cityKey}_ShowsExactlyPositionsIn${cityKey}`, async () => {
      // Arrange
      const allPositions = await careerPage.getAllPositions();
      const expectedPositions = allPositions.filter((position) => position.locations.includes(city));

      // Act
      await careerPage.filterByCity(city);

      // Assert
      expect(await careerPage.getVisiblePositions()).toEqual(expectedPositions);
    });
  }

  test(`CareerFilter_Select${alternativeCityKey}After${defaultCityKey}_Only${alternativeCityKey}IsSelected`, async () => {
    // Arrange
    const allPositions = await careerPage.getAllPositions();
    const expectedPositions = allPositions.filter((position) => position.locations.includes(alternativeCity));
    await careerPage.filterByCity(defaultCity);

    // Act
    await careerPage.filterByCity(alternativeCity);

    // Assert
    await expect(careerPage.citySelect.checkedOptions).toHaveCount(1);
    await expect(careerPage.citySelect.checkedOptions).toHaveText(alternativeCity);
    expect(await careerPage.getVisiblePositions()).toEqual(expectedPositions);
  });

  test('CareerFilter_ResetToAllCities_ShowsAllPositions', async () => {
    // Arrange
    const allPositions = await careerPage.getAllPositions();
    await careerPage.filterByCity(defaultCity);

    // Act
    await careerPage.filterByCity(City.AllCities);

    // Assert
    expect(await careerPage.getVisiblePositions()).toEqual(allPositions);
  });

  test('CareerFilter_CheckGraduates_ShowsOnlyGraduatePositions', async () => {
    // Arrange
    const allPositions = await careerPage.getAllPositions();
    const expectedPositions = allPositions.filter((position) => position.suitableForGraduates);

    // Act
    await careerPage.showOnlyGraduatePositions(true);

    // Assert
    expect(await careerPage.getVisiblePositions()).toEqual(expectedPositions);
  });

  test('CareerFilter_UncheckGraduates_ShowsAllPositions', async () => {
    // Arrange
    const allPositions = await careerPage.getAllPositions();
    await careerPage.showOnlyGraduatePositions(true);

    // Act
    await careerPage.showOnlyGraduatePositions(false);

    // Assert
    expect(await careerPage.getVisiblePositions()).toEqual(allPositions);
  });

  test(`CareerFilter_CheckGraduatesWith${defaultCityKey}Selected_ShowsOnlyGraduatePositionsIn${defaultCityKey}`, async () => {
    // Arrange
    const allPositions = await careerPage.getAllPositions();
    const expectedPositions = allPositions.filter(
      (position) => position.suitableForGraduates && position.locations.includes(defaultCity),
    );
    await careerPage.filterByCity(defaultCity);

    // Act
    await careerPage.showOnlyGraduatePositions(true);

    // Assert
    expect(await careerPage.getVisiblePositions()).toEqual(expectedPositions);
  });
});
