import { test } from '@playwright/test';
import { City } from '../enums/city.enum';
import type { JobPosition } from '../models/job-position.model';

const selectableCities = Object.values(City).filter((city) => city !== City.AllCities);

export function findSecondaryLocationOrSkip(jobPositions: JobPosition[]): City {
  const secondaryLocation = selectableCities.find((city) =>
    jobPositions.some((jobPosition) => jobPosition.locations.indexOf(city) > 0),
  );
  test.skip(!secondaryLocation, 'No open job position has more than one location.');
  return secondaryLocation as City;
}

export function findCityWithoutJobPositionsOrSkip(jobPositions: JobPosition[]): City {
  const cityWithoutJobPositions = selectableCities.find((city) =>
    jobPositions.every((jobPosition) => !jobPosition.locations.includes(city)),
  );
  test.skip(!cityWithoutJobPositions, 'Every city has an open job position.');
  return cityWithoutJobPositions as City;
}
