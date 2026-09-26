import { careerPage, City, expect, MorosystemsColors, test } from '@automation/ui';
import { enumKeyOf, Tag } from '@automation/common';

const defaultCity = City.Brno;
const alternativeCity = City.Prague;
const defaultCityKey = enumKeyOf(City, defaultCity);
const alternativeCityKey = enumKeyOf(City, alternativeCity);
const representativeCities = [City.HradecKralove, alternativeCity];

// Open job positions change over time, so results are validated against the rendered ones, not a fixed list.
test.describe('CareerFilterTests', { tag: [Tag.Regression, Tag.Career] }, () => {
  test.beforeEach(async () => {
    // Arrange
    await careerPage.open();
    await expect(careerPage.jobPositionsHeading).toBeVisible();
  });

  test('CareerFilter_OpenCitySelect_AllCitiesAreOfferedWithAllCitiesSelected', async () => {
    // Act
    const optionLabels = await careerPage.citySelect.getOptionLabels();

    // Assert
    await expect(careerPage.citySelect.selectedValue).toHaveText(City.AllCities);
    expect(optionLabels).toEqual(Object.values(City));
  });

  test(`CareerFilter_Select${defaultCityKey}_OnlyJobPositionsIn${defaultCityKey}AreDisplayed`, async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    const expectedJobPositions = allJobPositions.filter((jobPosition) =>
      jobPosition.locations.includes(defaultCity),
    );

    // Act
    await careerPage.filterByCity(defaultCity);

    // Assert
    const visibleJobPositions = await careerPage.getVisibleJobPositions();
    expect(visibleJobPositions.length, 'at least one open job position is expected').toBeGreaterThan(0);
    expect(visibleJobPositions).toEqual(expectedJobPositions);
  });

  test(
    `CareerFilter_HoverJobPositionIn${defaultCityKey}_JobPositionIsHighlighted`,
    { tag: [Tag.DesktopOnly] },
    async () => {
      // Arrange
      await careerPage.filterByCity(defaultCity);
      const jobPosition = careerPage.visibleJobPositionLinks.first();
      await expect(jobPosition).toHaveCSS('color', MorosystemsColors.navy);

      // Act
      await jobPosition.hover();

      // Assert
      await expect(jobPosition).toHaveCSS('color', MorosystemsColors.white);
    },
  );

  for (const city of representativeCities) {
    const cityKey = enumKeyOf(City, city);

    test(`CareerFilter_Select${cityKey}_OnlyJobPositionsIn${cityKey}AreDisplayed`, async () => {
      // Arrange
      const allJobPositions = await careerPage.getAllJobPositions();
      const expectedJobPositions = allJobPositions.filter((jobPosition) =>
        jobPosition.locations.includes(city),
      );

      // Act
      await careerPage.filterByCity(city);

      // Assert
      expect(await careerPage.getVisibleJobPositions()).toEqual(expectedJobPositions);
    });
  }

  test(`CareerFilter_Select${alternativeCityKey}After${defaultCityKey}_Only${alternativeCityKey}IsSelected`, async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    const expectedJobPositions = allJobPositions.filter((jobPosition) =>
      jobPosition.locations.includes(alternativeCity),
    );
    await careerPage.filterByCity(defaultCity);

    // Act
    await careerPage.filterByCity(alternativeCity);

    // Assert
    await expect(careerPage.citySelect.checkedOptions).toHaveCount(1);
    await expect(careerPage.citySelect.checkedOptions).toHaveText(alternativeCity);
    expect(await careerPage.getVisibleJobPositions()).toEqual(expectedJobPositions);
  });

  test('CareerFilter_ResetToAllCities_AllJobPositionsAreDisplayed', async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    await careerPage.filterByCity(defaultCity);

    // Act
    await careerPage.filterByCity(City.AllCities);

    // Assert
    expect(await careerPage.getVisibleJobPositions()).toEqual(allJobPositions);
  });

  test('CareerFilter_CheckGraduates_OnlyGraduateJobPositionsAreDisplayed', async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    const expectedJobPositions = allJobPositions.filter((jobPosition) => jobPosition.suitableForGraduates);

    // Act
    await careerPage.showOnlyGraduateJobPositions(true);

    // Assert
    expect(await careerPage.getVisibleJobPositions()).toEqual(expectedJobPositions);
  });

  test('CareerFilter_UncheckGraduates_AllJobPositionsAreDisplayed', async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    await careerPage.showOnlyGraduateJobPositions(true);

    // Act
    await careerPage.showOnlyGraduateJobPositions(false);

    // Assert
    expect(await careerPage.getVisibleJobPositions()).toEqual(allJobPositions);
  });

  test(`CareerFilter_CheckGraduatesWith${defaultCityKey}Selected_OnlyGraduateJobPositionsIn${defaultCityKey}AreDisplayed`, async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    const expectedJobPositions = allJobPositions.filter(
      (jobPosition) => jobPosition.suitableForGraduates && jobPosition.locations.includes(defaultCity),
    );
    await careerPage.filterByCity(defaultCity);

    // Act
    await careerPage.showOnlyGraduateJobPositions(true);

    // Assert
    expect(await careerPage.getVisibleJobPositions()).toEqual(expectedJobPositions);
  });
});
