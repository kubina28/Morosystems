import type { Page } from '@playwright/test';
import { MorosystemsLanguageBaseUrls } from '../../../constants/routes';

export class MorosystemsCookieDialog {
  private static readonly consentCookieName = 'CookieScriptConsent';

  constructor(private readonly page: Page) {}

  async storeRejectedConsent(): Promise<void> {
    const hostnames = Object.values(MorosystemsLanguageBaseUrls).map((url) =>
      new URL(url).hostname.replace(/^www\./, ''),
    );
    await this.page.context().addCookies(
      hostnames.map((hostname) => ({
        name: MorosystemsCookieDialog.consentCookieName,
        value: JSON.stringify({ bannershown: 1, action: 'reject', categories: '[]' }),
        domain: `.${hostname}`,
        path: '/',
        secure: true,
        sameSite: 'Lax' as const,
      })),
    );
  }
}
