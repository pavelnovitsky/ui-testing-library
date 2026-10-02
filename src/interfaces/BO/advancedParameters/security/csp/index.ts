import {BOBasePagePageInterface} from '@interfaces/BO';
import type {Page} from '@playwright/test';

export interface BOCspPageInterface extends BOBasePagePageInterface {
  readonly pageTitle: string;

  getNumberOfElementInGrid(page: Page): Promise<number>;
  getNthRowBySource(page: Page, source: string): Promise<number|null>;
  getTextColumn(page: Page, columnName: string, row?: number): Promise<string>;
  getTextForEmptyTable(page: Page): Promise<string>;
}
