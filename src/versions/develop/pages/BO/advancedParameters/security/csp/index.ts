import {type BOCspPageInterface} from '@interfaces/BO/advancedParameters/security/csp';
import BOBasePage from '@pages/BO/BOBasePage';
import {type Page} from '@playwright/test';

/**
 * Content Security Policy page (Advanced parameters > Security > Content Security Policy),
 * contains the Content Security Policy log-driven curation grid.
 * @class
 * @extends BOBasePage
 */
class BOCspPage extends BOBasePage implements BOCspPageInterface {
  public readonly pageTitle: string;

  private readonly gridPanel: string;

  private readonly gridHeader: string;

  private readonly gridHeaderTitle: string;

  private readonly gridTable: string;

  private readonly gridTableBody: string;

  private readonly gridTableEmptyRow: string;

  private readonly gridTableRow: (row: number) => string;

  private readonly gridTableColumn: (row: number, column: string) => string;

  /**
   * @constructs
   * Setting up texts and selectors to use on the CSP page
   */
  constructor() {
    super();

    this.pageTitle = 'Content Security Policy •';

    // Grid selectors (grid id: csp_log)
    this.gridPanel = '#csp_log_grid_panel';
    this.gridHeader = `${this.gridPanel} .card-header`;
    this.gridHeaderTitle = `${this.gridHeader} h3`;
    this.gridTable = '#csp_log_grid_table';
    this.gridTableBody = `${this.gridTable} tbody`;
    this.gridTableEmptyRow = `${this.gridTableBody} tr.empty_row`;
    this.gridTableRow = (row: number) => `${this.gridTable} tbody tr:nth-child(${row})`;
    this.gridTableColumn = (row: number, column: string) => `${this.gridTableRow(row)} td.column-${column}`;
  }

  /*
  Methods
   */

  /**
   * Get the "no records" text shown by the grid when empty
   * @param page {Page} Browser tab
   * @returns {Promise<string>}
   */
  async getTextForEmptyTable(page: Page): Promise<string> {
    return this.getTextContent(page, this.gridTableEmptyRow);
  }

  /**
   * Get number of rows in the log grid
   * @param page {Page} Browser tab
   * @returns {Promise<number>}
   */
  async getNumberOfElementInGrid(page: Page): Promise<number> {
    return this.getNumberFromText(page, this.gridHeaderTitle);
  }

  /**
   * Get the text of a column for a given row
   * @param page {Page} Browser tab
   * @param columnName {string} Column name (directive, source, is_allowed, hits, document_uri)
   * @param row {number} Row index in the table
   * @returns {Promise<string>}
   */
  async getTextColumn(page: Page, columnName: string, row: number = 1): Promise<string> {
    return this.getTextContent(page, this.gridTableColumn(row, columnName));
  }

  /**
   * Returns the row of the first reported source matching the provided value, or null if not found
   * @param page {Page} Browser tab
   * @param source {string} The blocked source to look for
   * @returns {Promise<number|null>}
   */
  async getNthRowBySource(page: Page, source: string): Promise<number|null> {
    const rows = await this.getNumberOfElementInGrid(page);

    for (let row = 1; row <= rows; ++row) {
      const rowSource = await this.getTextColumn(page, 'source', row);

      if (rowSource.trim() === source.trim()) {
        return row;
      }
    }

    return null;
  }
}

module.exports = new BOCspPage();
