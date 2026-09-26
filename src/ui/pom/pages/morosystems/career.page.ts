import { expect, type Locator, type Page } from '@playwright/test';
import { MorosystemsRoutes } from '../../../constants/routes';
import { City } from '../../../enums/city.enum';
import type { JobPosition } from '../../../models/job-position.model';
import { CitySelect } from '../../components/morosystems/city-select.component';
import { type DynamicContent, normalizeWhitespace, splitList, step } from '@automation/common';
import { MoroBasePage } from './moro-base.page';

export class CareerPage extends MoroBasePage {
  private static readonly graduateFilterValue = 'student';

  readonly jobPositionsHeading: Locator;
  readonly citySelect: CitySelect;
  readonly graduateJobPositionsCheckbox: Locator;
  readonly graduateJobPositionsLabel: Locator;
  readonly jobPositionItems: Locator;
  readonly visibleJobPositionItems: Locator;
  readonly visibleJobPositionLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.jobPositionsHeading = page.getByRole('heading', { name: 'Koho hledáme' });
    this.citySelect = new CitySelect(page);
    this.graduateJobPositionsCheckbox = page.getByRole('checkbox', { name: 'Pozice vhodná pro absolventy' });
    this.graduateJobPositionsLabel = page.locator('label').filter({ has: this.graduateJobPositionsCheckbox });
    this.jobPositionItems = page.locator('.c-positions__item');
    this.visibleJobPositionItems = this.jobPositionItems.filter({ visible: true });
    this.visibleJobPositionLinks = this.visibleJobPositionItems.locator('.c-positions__link');
  }

  override get dynamicContent(): DynamicContent {
    const { hidden, removed = [] } = super.dynamicContent;
    return { hidden, removed: [...removed, this.jobPositionItems] };
  }

  @step('Open "Kariéra" page')
  async open(): Promise<void> {
    await this.openRoute(MorosystemsRoutes.careerPagePath);
  }

  @step((city: City) => `Filter open job positions by city "${city}"`)
  async filterByCity(city: City): Promise<void> {
    await this.citySelect.select(city);
  }

  @step(
    (enabled: boolean) => `${enabled ? 'Show' : 'Stop showing'} only job positions suitable for graduates`,
  )
  async showOnlyGraduateJobPositions(enabled: boolean): Promise<void> {
    // The native checkbox is moved off-screen by CSS, users click its label.
    if ((await this.graduateJobPositionsCheckbox.isChecked()) !== enabled) {
      await this.graduateJobPositionsLabel.click();
    }
    await expect(
      this.graduateJobPositionsCheckbox,
      'Graduate filter should toggle on the first click',
    ).toBeChecked({
      checked: enabled,
    });
  }

  async getAllJobPositions(): Promise<JobPosition[]> {
    return this.readJobPositions(this.jobPositionItems);
  }

  async getVisibleJobPositions(): Promise<JobPosition[]> {
    return this.readJobPositions(this.visibleJobPositionItems);
  }

  private async readJobPositions(items: Locator): Promise<JobPosition[]> {
    const jobPositions: JobPosition[] = [];
    for (const item of await items.all()) {
      const title = await item.locator('.c-positions__name').textContent();
      const locations = await item.locator('.c-positions__info').textContent();
      const filterValues = splitList((await item.getAttribute('data-filter')) ?? '');
      jobPositions.push({
        title: normalizeWhitespace(title ?? ''),
        locations: splitList(locations ?? ''),
        suitableForGraduates: filterValues.includes(CareerPage.graduateFilterValue),
      });
    }
    return jobPositions;
  }
}
