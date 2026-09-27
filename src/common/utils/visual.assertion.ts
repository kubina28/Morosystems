import path from 'node:path';
import { expect, type Page } from '@playwright/test';

export interface DynamicContent {
  hidden?: string[];
  removed?: string[];
}

// A stylesheet instead of `mask`: a mask also covers overlapping elements (a header over a photo) and misses
// elements that scripts show during the capture.
export async function expectVisualMatch(
  page: Page,
  snapshotName: string,
  { hidden = [], removed = [] }: DynamicContent = {},
): Promise<void> {
  await page.waitForLoadState('load');
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.addStyleTag({
    content: [
      ...hidden.map((selector) => `${selector} { visibility: hidden !important; }`),
      ...removed.map((selector) => `${selector} { display: none !important; }`),
    ].join('\n'),
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page).toHaveScreenshot(`${snapshotName}.png`, {
    animations: 'disabled',
    caret: 'hide',
    fullPage: true,
    maxDiffPixelRatio: 0.01,
    stylePath: path.join(__dirname, 'visual-screenshot.css'),
  });
}
