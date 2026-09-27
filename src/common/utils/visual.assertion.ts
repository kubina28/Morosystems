import path from 'node:path';
import { expect, type Page } from '@playwright/test';

// CSS selectors of content excluded from the comparison.
export interface DynamicContent {
  // Fixed-size media (photos, video): hidden, their space in the layout is kept and compared.
  hidden?: string[];
  // Content whose amount varies (lists, quotes) and floating widgets: removed, so the page does not depend on them.
  removed?: string[];
}

// Dynamic content is excluded by a stylesheet instead of a mask: a mask is drawn on top of the page and would also
// cover elements overlapping it (e.g. a header over a photo), and the stylesheet also applies to elements
// that scripts show or re-render during the capture.
export async function expectVisualMatch(
  page: Page,
  snapshotName: string,
  { hidden = [], removed = [] }: DynamicContent = {},
): Promise<void> {
  await page.waitForLoadState('load');
  // Text rendered with a fallback font before the web font is loaded has a different width.
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.addStyleTag({
    content: [
      ...hidden.map((selector) => `${selector} { visibility: hidden !important; }`),
      ...removed.map((selector) => `${selector} { display: none !important; }`),
    ].join('\n'),
  });
  // A fixed header is painted at the scroll position, so a scrolled page would show it twice in a full-page capture.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page).toHaveScreenshot(`${snapshotName}.png`, {
    animations: 'disabled',
    caret: 'hide',
    fullPage: true,
    maxDiffPixelRatio: 0.01,
    // Classic scrollbars (Windows) appear only in some full-page captures and change the image width.
    stylePath: path.join(__dirname, 'visual-screenshot.css'),
  });
}
