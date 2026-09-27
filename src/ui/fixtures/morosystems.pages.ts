import type { Page } from '@playwright/test';
import { CareerPage } from '../pom/pages/morosystems/career.page';
import { MorosystemsHomePage } from '../pom/pages/morosystems/morosystems-home.page';

export let morosystemsHomePage: MorosystemsHomePage;
export let careerPage: CareerPage;

export function initMorosystemsPages(page: Page): void {
  morosystemsHomePage = new MorosystemsHomePage(page);
  careerPage = new CareerPage(page);
}
