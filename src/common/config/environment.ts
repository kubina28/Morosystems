import path from 'node:path';
import dotenv from 'dotenv';

const environmentName = process.env.TEST_ENV ?? 'prod';

dotenv.config({
  path: path.resolve(__dirname, '../../../setup/environments', `${environmentName}.env`),
  quiet: true,
});

const deviceName = process.env.DEVICE;

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required variable "${name}" for environment "${environmentName}".`);
  }
  return value;
}

function requiredNumber(name: string): number {
  const value = Number(required(name));
  if (Number.isNaN(value)) {
    throw new Error(`Variable "${name}" for environment "${environmentName}" must be a number.`);
  }
  return value;
}

export const environment = Object.freeze({
  environmentName,
  googleHomepageUrl: required('GOOGLE_HOMEPAGE_URL'),
  morosystemsBaseUrl: required('MOROSYSTEMS_BASE_URL'),
  morosystemsEnBaseUrl: required('MOROSYSTEMS_EN_BASE_URL'),
  morosystemsDeBaseUrl: required('MOROSYSTEMS_DE_BASE_URL'),
  todoApiBaseUrl: required('TODO_API_BASE_URL'),
  locale: process.env.LOCALE ?? 'cs-CZ',
  timezoneId: process.env.TIMEZONE_ID ?? 'Europe/Prague',
  deviceName,
  viewport: deviceName
    ? undefined
    : { width: requiredNumber('VIEWPORT_WIDTH'), height: requiredNumber('VIEWPORT_HEIGHT') },
  isCi: Boolean(process.env.CI),
  // Google blocks headless browsers with a CAPTCHA, therefore tests run headed unless HEADLESS=true.
  headless: process.env.HEADLESS === 'true',
  browserNames: (process.env.BROWSERS ?? 'chromium').split(',').map((browser) => browser.trim()),
  workerCount: process.env.WORKERS ? Number(process.env.WORKERS) : undefined,
});
