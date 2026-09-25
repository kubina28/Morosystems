import type { Page } from '@playwright/test';
import { environment } from '@automation/common';

// The dialog is loaded lazily and slides in at an unpredictable moment of the test,
// so the consent is stored in advance instead of clicking the dialog away.
export class MoroCookieDialog {
  private static readonly consentCookieName = 'CookieScriptConsent';

  constructor(private readonly page: Page) {}

  async storeRejectedConsent(): Promise<void> {
    const hostname = new URL(environment.morosystemsBaseUrl).hostname.replace(/^www\./, '');
    await this.page.context().addCookies([
      {
        name: MoroCookieDialog.consentCookieName,
        value: JSON.stringify({ bannershown: 1, action: 'reject', categories: '[]' }),
        domain: `.${hostname}`,
        path: '/',
        secure: true,
        sameSite: 'Lax',
      },
    ]);
  }
}
