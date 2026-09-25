import { devices, type PlaywrightTestConfig, type Project } from '@playwright/test';
import { environment } from '../config/environment';
import { Timeouts } from '../constants/timeouts';
import { BrowserName } from '../enums/browser-name.enum';
import { Tag } from '../enums/tag.enum';

type UseOptions = NonNullable<PlaywrightTestConfig['use']>;

const GOOGLE_TAG = new RegExp(Tag.Google);
const UI_TEST_DIR = './tests/ui';
const API_TEST_DIR = './tests/api';

export class PlaywrightFactory {
  private static readonly browserPresets: Record<BrowserName, UseOptions> = {
    [BrowserName.Chromium]: {
      ...devices['Desktop Chrome'],
      launchOptions: {
        // Hides the `navigator.webdriver` automation flag which makes Google serve a CAPTCHA.
        args: ['--disable-blink-features=AutomationControlled'],
      },
    },
  };

  static createDefaultUseOptions(): UseOptions {
    return {
      headless: environment.headless,
      locale: environment.locale,
      timezoneId: environment.timezoneId,
      extraHTTPHeaders: { 'Accept-Language': environment.locale },
      actionTimeout: Timeouts.actionMs,
      navigationTimeout: Timeouts.navigationMs,
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      trace: 'retain-on-failure',
    };
  }

  // Google tests run one at a time - parallel searches from one IP make Google degrade results or show a CAPTCHA.
  // The retry covers results pages occasionally missing the organic homepage result.
  static createProjects(): Project[] {
    const uiProjects = environment.browserNames.flatMap((name) => {
      // Project options override the global `use`, so the desktop preset viewport must be replaced here.
      const use = { ...PlaywrightFactory.getBrowserPreset(name), ...PlaywrightFactory.getScreenOptions() };
      const websiteProject: Project = { name, testDir: UI_TEST_DIR, use, grepInvert: GOOGLE_TAG };
      if (environment.deviceName) {
        return [websiteProject];
      }
      return [
        websiteProject,
        { name: `${name}-google`, testDir: UI_TEST_DIR, use, grep: GOOGLE_TAG, workers: 1, retries: 1 },
      ];
    });
    return environment.deviceName ? uiProjects : [...uiProjects, PlaywrightFactory.createApiProject()];
  }

  private static createApiProject(): Project {
    return { name: 'api', testDir: API_TEST_DIR, use: { baseURL: environment.todoApiBaseUrl } };
  }

  private static getScreenOptions(): UseOptions {
    if (!environment.deviceName) {
      return { viewport: environment.viewport };
    }
    const device = devices[environment.deviceName];
    if (!device) {
      throw new Error(
        `Unknown device "${environment.deviceName}". Use a name from Playwright devices, e.g. "Pixel 7".`,
      );
    }
    return device;
  }

  private static getBrowserPreset(name: string): UseOptions {
    if (!PlaywrightFactory.isSupportedBrowser(name)) {
      const supported = Object.values(BrowserName).join(', ');
      throw new Error(`Unsupported browser "${name}". Supported browsers: ${supported}.`);
    }
    return PlaywrightFactory.browserPresets[name];
  }

  private static isSupportedBrowser(name: string): name is BrowserName {
    return (Object.values(BrowserName) as string[]).includes(name);
  }
}
