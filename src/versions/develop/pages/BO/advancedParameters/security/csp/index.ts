import {type BOCspPageInterface} from '@interfaces/BO/advancedParameters/security/csp';
import BOBasePage from '@pages/BO/BOBasePage';
import {type Page} from '@playwright/test';

/**
 * Content Security Policy page (Advanced parameters > Security > Content Security Policy).
 * The page shows two grids per surface: the reported violations (grid id `csp_log`) and the curated
 * allow-list (grid id `csp_rule`), plus a read-only list of the back-office built-in sources.
 * @class
 * @extends BOBasePage
 */
class BOCspPage extends BOBasePage implements BOCspPageInterface {
  public readonly pageTitle: string;

  public readonly violationsGridId: string;

  public readonly allowedSourcesGridId: string;

  private readonly gridPanel: (gridId: string) => string;

  private readonly gridHeaderTitle: (gridId: string) => string;

  private readonly gridTable: (gridId: string) => string;

  private readonly gridTableEmptyRow: (gridId: string) => string;

  private readonly gridTableRow: (gridId: string, row: number) => string;

  private readonly gridTableColumn: (gridId: string, row: number, column: string) => string;

  private readonly builtInSourcesPanel: string;

  private readonly builtInSourcesRow: string;

  /**
   * @constructs
   * Setting up texts and selectors to use on the CSP page
   */
  constructor() {
    super();

    this.pageTitle = 'Content Security Policy •';

    this.violationsGridId = 'csp_log';
    this.allowedSourcesGridId = 'csp_rule';

    // Grid selectors, parameterized by grid id (csp_log = violations, csp_rule = allowed sources)
    this.gridPanel = (gridId: string) => `#${gridId}_grid_panel`;
    this.gridHeaderTitle = (gridId: string) => `${this.gridPanel(gridId)} .card-header h3`;
    this.gridTable = (gridId: string) => `#${gridId}_grid_table`;
    this.gridTableEmptyRow = (gridId: string) => `${this.gridTable(gridId)} tbody tr.empty_row`;
    this.gridTableRow = (gridId: string, row: number) => `${this.gridTable(gridId)} tbody tr:nth-child(${row})`;
    this.gridTableColumn = (gridId: string, row: number, column: string): string => (
      `${this.gridTableRow(gridId, row)} td.column-${column}`
    );

    // Read-only "Built-in back-office sources" panel (admin surface only)
    this.builtInSourcesPanel = '#csp_built_in_sources';
    this.builtInSourcesRow = `${this.builtInSourcesPanel} table tbody tr`;
  }

  /*
  Methods
   */

  /**
   * Get the "no records" text shown by a grid when empty
   * @param page {Page} Browser tab
   * @param gridId {string} Grid id (csp_log = violations, csp_rule = allowed sources)
   * @returns {Promise<string>}
   */
  async getTextForEmptyTable(page: Page, gridId: string = this.violationsGridId): Promise<string> {
    return this.getTextContent(page, this.gridTableEmptyRow(gridId));
  }

  /**
   * Get the number of rows in a grid (read from its header count)
   * @param page {Page} Browser tab
   * @param gridId {string} Grid id (csp_log = violations, csp_rule = allowed sources)
   * @returns {Promise<number>}
   */
  async getNumberOfElementInGrid(page: Page, gridId: string = this.violationsGridId): Promise<number> {
    return this.getNumberFromText(page, this.gridHeaderTitle(gridId));
  }

  /**
   * Get the text of a column for a given row.
   * Violations columns: directive, source, shop_name, is_weakening, document_uri, sample, source_location,
   * hits, date_add. Allowed-sources columns: directive, source, shop_name, is_weakening, date_add.
   * @param page {Page} Browser tab
   * @param columnName {string} Column name
   * @param row {number} Row index in the table
   * @param gridId {string} Grid id (csp_log = violations, csp_rule = allowed sources)
   * @returns {Promise<string>}
   */
  async getTextColumn(page: Page, columnName: string, row: number = 1, gridId: string = this.violationsGridId): Promise<string> {
    return this.getTextContent(page, this.gridTableColumn(gridId, row, columnName));
  }

  /**
   * Returns the row of the first source matching the provided value in a grid, or null if not found
   * @param page {Page} Browser tab
   * @param source {string} The source to look for
   * @param gridId {string} Grid id (csp_log = violations, csp_rule = allowed sources)
   * @returns {Promise<number|null>}
   */
  async getNthRowBySource(page: Page, source: string, gridId: string = this.violationsGridId): Promise<number|null> {
    const rows = await this.getNumberOfElementInGrid(page, gridId);

    for (let row = 1; row <= rows; ++row) {
      const rowSource = await this.getTextColumn(page, 'source', row, gridId);

      if (rowSource.trim() === source.trim()) {
        return row;
      }
    }

    return null;
  }

  /**
   * Get the number of built-in back-office sources listed read-only on the page (admin surface only)
   * @param page {Page} Browser tab
   * @returns {Promise<number>}
   */
  async getNumberOfBuiltInSources(page: Page): Promise<number> {
    if (await this.elementNotVisible(page, this.builtInSourcesPanel, 1000)) {
      return 0;
    }

    return page.locator(this.builtInSourcesRow).count();
  }
}

module.exports = new BOCspPage();
