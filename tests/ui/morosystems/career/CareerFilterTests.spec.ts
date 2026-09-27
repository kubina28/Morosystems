import {
  careerPage,
  City,
  expect,
  findCityWithoutJobPositionsOrSkip,
  findSecondaryLocationOrSkip,
  MorosystemsColors,
  test,
} from '@automation/ui';
import { enumKeyOf, Tag } from '@automation/common';

const headquartersCity = City.Brno;
const alternativeCity = City.Prague;
const headquartersCityKey = enumKeyOf(City, headquartersCity);
const alternativeCityKey = enumKeyOf(City, alternativeCity);

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

  test(`CareerFilter_Select${headquartersCityKey}_OnlyJobPositionsIn${headquartersCityKey}AreDisplayed`, async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    const expectedJobPositions = allJobPositions.filter((jobPosition) =>
      jobPosition.locations.includes(headquartersCity),
    );

    // Act
    await careerPage.filterByCity(headquartersCity);

    // Assert
    const visibleJobPositions = await careerPage.getVisibleJobPositions();
    expect(visibleJobPositions.length, 'at least one open job position is expected').toBeGreaterThan(0);
    expect(visibleJobPositions).toEqual(expectedJobPositions);
  });

  test(
    `CareerFilter_HoverJobPositionIn${headquartersCityKey}_JobPositionIsHighlighted`,
    { tag: [Tag.DesktopOnly] },
    async () => {
      // Arrange
      await careerPage.filterByCity(headquartersCity);
      const jobPosition = careerPage.visibleJobPositionLinks.first();
      await expect(jobPosition).toHaveCSS('color', MorosystemsColors.navy);

      // Act
      await jobPosition.hover();

      // Assert
      await expect(jobPosition).toHaveCSS('color', MorosystemsColors.white);
    },
  );

  test('CareerFilter_SelectSecondaryLocation_JobPositionsWithThatLocationAreDisplayed', async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    const secondaryLocation = findSecondaryLocationOrSkip(allJobPositions);
    const expectedJobPositions = allJobPositions.filter((jobPosition) =>
      jobPosition.locations.includes(secondaryLocation),
    );

    // Act
    await careerPage.filterByCity(secondaryLocation);

    // Assert
    expect(await careerPage.getVisibleJobPositions()).toEqual(expectedJobPositions);
  });

  test('CareerFilter_SelectCityWithoutJobPositions_NoJobPositionIsDisplayed', async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    const cityWithoutJobPositions = findCityWithoutJobPositionsOrSkip(allJobPositions);

    // Act
    await careerPage.filterByCity(cityWithoutJobPositions);

    // Assert
    expect(await careerPage.getVisibleJobPositions()).toEqual([]);
  });

  test(`CareerFilter_Select${alternativeCityKey}After${headquartersCityKey}_Only${alternativeCityKey}IsSelected`, async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    const expectedJobPositions = allJobPositions.filter((jobPosition) =>
      jobPosition.locations.includes(alternativeCity),
    );
    await careerPage.filterByCity(headquartersCity);

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
    await careerPage.filterByCity(headquartersCity);

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

  test(`CareerFilter_CheckGraduatesWith${headquartersCityKey}Selected_OnlyGraduateJobPositionsIn${headquartersCityKey}AreDisplayed`, async () => {
    // Arrange
    const allJobPositions = await careerPage.getAllJobPositions();
    const expectedJobPositions = allJobPositions.filter(
      (jobPosition) => jobPosition.suitableForGraduates && jobPosition.locations.includes(headquartersCity),
    );
    await careerPage.filterByCity(headquartersCity);

    // Act
    await careerPage.showOnlyGraduateJobPositions(true);

    // Assert
    expect(await careerPage.getVisibleJobPositions()).toEqual(expectedJobPositions);
  });
});
