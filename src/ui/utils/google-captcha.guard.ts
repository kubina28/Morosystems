import { test, type Page } from '@playwright/test';

const GOOGLE_CAPTCHA_URL = /google\.[a-z.]+\/sorry\//;

// A CAPTCHA is an environment limitation, not a product defect - skip instead of failing on a locator timeout.
export function skipIfBlockedByGoogleCaptcha(page: Page): void {
  test.skip(
    GOOGLE_CAPTCHA_URL.test(page.url()),
    'Google served a CAPTCHA ("unusual traffic" page). Run headed (default) from a regular network.',
  );
}
