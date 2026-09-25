import type { Page } from '@playwright/test';
import { GoogleResultsPage } from '../pom/pages/google/google-results.page';
import { GoogleSearchPage } from '../pom/pages/google/google-search.page';

export let googleSearchPage: GoogleSearchPage;
export let googleResultsPage: GoogleResultsPage;

export function initGooglePages(page: Page): void {
  googleSearchPage = new GoogleSearchPage(page);
  googleResultsPage = new GoogleResultsPage(page);
}
