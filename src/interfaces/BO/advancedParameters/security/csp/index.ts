import {BOBasePagePageInterface} from '@interfaces/BO';
import type {Page} from '@playwright/test';

export interface BOCspPageInterface extends BOBasePagePageInterface {
  readonly pageTitle: string;
  readonly violationsGridId: string;
  readonly allowedSourcesGridId: string;

  getNumberOfElementInGrid(page: Page, gridId?: string): Promise<number>;
  getNthRowBySource(page: Page, source: string, gridId?: string): Promise<number|null>;
  getTextColumn(page: Page, columnName: string, row?: number, gridId?: string): Promise<string>;
  getTextForEmptyTable(page: Page, gridId?: string): Promise<string>;
  getNumberOfBuiltInSources(page: Page): Promise<number>;
}
