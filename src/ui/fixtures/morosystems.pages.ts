import type { Page } from '@playwright/test';
import { CareerPage } from '../pom/pages/morosystems/career.page';
import { MoroHomePage } from '../pom/pages/morosystems/moro-home.page';

export let moroHomePage: MoroHomePage;
export let careerPage: CareerPage;

export function initMorosystemsPages(page: Page): void {
  moroHomePage = new MoroHomePage(page);
  careerPage = new CareerPage(page);
}
