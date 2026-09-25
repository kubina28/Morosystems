import { defineConfig } from '@playwright/test';
import { environment, PlaywrightFactory, Timeouts } from '@automation/common';

export default defineConfig({
  testDir: './tests',
  outputDir: './reports/test-results',
  timeout: Timeouts.perTestMs,
  expect: { timeout: Timeouts.assertionMs },
  fullyParallel: true,
  forbidOnly: environment.isCi,
  retries: environment.isCi ? 1 : 0,
  workers: environment.workerCount,
  reporter: [
    ['list'],
    ['html', { outputFolder: './reports/html', open: 'never' }],
    ['junit', { outputFile: './reports/junit/results.xml' }],
  ],
  use: PlaywrightFactory.createDefaultUseOptions(),
  projects: PlaywrightFactory.createProjects(),
});
