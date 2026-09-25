import { test as base, type Page } from '@playwright/test';
import { GoogleConsentDialog } from '../pom/components/google/google-consent.dialog';
import { MoroCookieDialog } from '../pom/components/morosystems/moro-cookie.dialog';
import { initGooglePages } from './google.pages';
import { initMorosystemsPages } from './morosystems.pages';

export * from './google.pages';
export * from './morosystems.pages';

export let page: Page;

type AutoFixtures = {
  pageObjects: void;
  consentDialogs: void;
  browserConsoleLog: void;
};

export const test = base.extend<AutoFixtures>({
  pageObjects: [
    async ({ page: currentPage }, use) => {
      page = currentPage;
      initGooglePages(currentPage);
      initMorosystemsPages(currentPage);
      await use();
    },
    { auto: true },
  ],

  consentDialogs: [
    async ({ page }, use) => {
      await new GoogleConsentDialog(page).acceptWhenDisplayed();
      await new MoroCookieDialog(page).storeRejectedConsent();
      await use();
    },
    { auto: true },
  ],

  browserConsoleLog: [
    async ({ page }, use, testInfo) => {
      const messages: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error' || message.type() === 'warning') {
          messages.push(`[${message.type().toUpperCase()}] [${page.url()}] ${message.text()}`);
        }
      });

      await use();

      if (testInfo.status !== testInfo.expectedStatus && messages.length > 0) {
        await testInfo.attach('browser-console.log', {
          body: messages.join('\n'),
          contentType: 'text/plain',
        });
      }
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
