class Worksheet {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;

  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet | string) {
    if (typeof sheet === 'string') {
      const worksheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet);
      if (worksheet) {
        sheet = worksheet;
      } else {
        throw new Error(`No worksheet named "${sheet}" found in current spreadsheet`);
      }
    }

    if (!sheet) {
      throw new Error('Parameter sheet cannot be null');
    }

    this.sheet = sheet;
  }
}

export {Worksheet}