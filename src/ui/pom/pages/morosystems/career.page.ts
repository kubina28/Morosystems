import { expect, type Locator, type Page } from '@playwright/test';
import { MorosystemsRoutes } from '../../../constants/routes';
import { City } from '../../../enums/city.enum';
import type { Position } from '../../../models/position.model';
import { CitySelect } from '../../components/morosystems/city-select.component';
import { normalizeWhitespace, splitList, step } from '@automation/common';
import { MoroBasePage } from './moro-base.page';

export class CareerPage extends MoroBasePage {
  private static readonly graduateFilterValue = 'student';

  readonly positionsHeading: Locator;
  readonly citySelect: CitySelect;
  readonly graduatePositionsCheckbox: Locator;
  readonly graduatePositionsLabel: Locator;
  readonly positionItems: Locator;
  readonly visiblePositionItems: Locator;

  constructor(page: Page) {
    super(page);
    this.positionsHeading = page.getByRole('heading', { name: 'Koho hledáme' });
    this.citySelect = new CitySelect(page);
    this.graduatePositionsCheckbox = page.getByRole('checkbox', { name: 'Pozice vhodná pro absolventy' });
    this.graduatePositionsLabel = page.locator('label').filter({ has: this.graduatePositionsCheckbox });
    this.positionItems = page.locator('.c-positions__item');
    this.visiblePositionItems = this.positionItems.filter({ visible: true });
  }

  @step('Open "Kariéra" page')
  async open(): Promise<void> {
    await this.openRoute(MorosystemsRoutes.careerPagePath);
  }

  @step((city: City) => `Filter open positions by city "${city}"`)
  async filterByCity(city: City): Promise<void> {
    await this.citySelect.select(city);
  }

  @step((enabled: boolean) => `${enabled ? 'Show' : 'Stop showing'} only positions suitable for graduates`)
  async showOnlyGraduatePositions(enabled: boolean): Promise<void> {
    // The native checkbox is moved off-screen by CSS, users click its label.
    if ((await this.graduatePositionsCheckbox.isChecked()) !== enabled) {
      await this.graduatePositionsLabel.click();
    }
    await expect(
      this.graduatePositionsCheckbox,
      'Graduate filter should toggle on the first click',
    ).toBeChecked({
      checked: enabled,
    });
  }

  async getAllPositions(): Promise<Position[]> {
    return this.readPositions(this.positionItems);
  }

  async getVisiblePositions(): Promise<Position[]> {
    return this.readPositions(this.visiblePositionItems);
  }

  private async readPositions(items: Locator): Promise<Position[]> {
    const positions: Position[] = [];
    for (const item of await items.all()) {
      const title = await item.locator('.c-positions__name').textContent();
      const locations = await item.locator('.c-positions__info').textContent();
      const filterValues = splitList((await item.getAttribute('data-filter')) ?? '');
      positions.push({
        title: normalizeWhitespace(title ?? ''),
        locations: splitList(locations ?? ''),
        suitableForGraduates: filterValues.includes(CareerPage.graduateFilterValue),
      });
    }
    return positions;
  }
}
