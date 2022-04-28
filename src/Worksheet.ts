namespace CoverSheets {
  export class Worksheet {
    sheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet | string) {
      if (!sheet) {
        throw new Error('Parameter sheet cannot be null');
      }

      if (typeof sheet === 'string') {
        const worksheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet);
        if (worksheet) {
          sheet = worksheet;
        } else {
          throw new Error(`No worksheet named "${sheet}" found in current spreadsheet`);
        }
      }

      this.sheet = sheet;
    }

    getRange(row: number, column: number, numRows: number, numColumns: number): GoogleAppsScript.Spreadsheet.Range {
      return this.sheet.getRange(row, column, numRows, numColumns)
    }

  }
}