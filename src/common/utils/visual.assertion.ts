import path from 'node:path';
import { expect, type Locator, type Page } from '@playwright/test';

export interface DynamicContent {
  // Fixed-size media (photos, video): hidden, their space in the layout is kept and compared.
  hidden?: Locator[];
  // Content whose amount varies (lists, quotes): removed, so the page height does not depend on it.
  removed?: Locator[];
}

// Dynamic content is hidden instead of masked: a mask is drawn on top of the page and would also cover elements
// overlapping it (e.g. a header over a photo).
export async function expectVisualMatch(
  target: Page | Locator,
  snapshotName: string,
  { hidden = [], removed = [] }: DynamicContent = {},
): Promise<void> {
  const page = isPage(target) ? target : target.page();
  await page.waitForLoadState('load');
  // Text rendered with a fallback font before the web font is loaded has a different width.
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  for (const region of hidden) {
    await region.evaluateAll((elements) =>
      elements.forEach((element) => ((element as HTMLElement).style.visibility = 'hidden')),
    );
  }
  for (const region of removed) {
    await region.evaluateAll((elements) =>
      elements.forEach((element) => ((element as HTMLElement).style.display = 'none')),
    );
  }
  const options = {
    animations: 'disabled' as const,
    caret: 'hide' as const,
    maxDiffPixelRatio: 0.01,
    // Classic scrollbars (Windows) appear only in some full-page captures and change the image width.
    stylePath: path.join(__dirname, 'visual-screenshot.css'),
  };
  if (isPage(target)) {
    // A fixed header is painted at the scroll position, so a scrolled page would show it twice in a full-page capture.
    await target.evaluate(() => window.scrollTo(0, 0));
    await expect(target).toHaveScreenshot(`${snapshotName}.png`, { ...options, fullPage: true });
  } else {
    await expect(target).toHaveScreenshot(`${snapshotName}.png`, options);
  }
}

function isPage(target: Page | Locator): target is Page {
  return 'goto' in target;
}
