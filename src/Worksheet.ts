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

    getRange(row: number, column: number, numRows: number, numColumns: number): Range {
      const range = this.sheet.getRange(row, column, numRows, numColumns);
      return new Range({range:range});
    }

    getRangeByName(rangeName:string, headerType:HeaderType = "None", headerSize:number = 1) : NamedRange {
      const rangeNameMatch = rangeName.match(/(?:["']?([^!'"]*)["']?!)?(.*)$/);
      let worksheetName = this.sheet.getName();

      if (rangeNameMatch) {
        if (rangeNameMatch[1]) {
          worksheetName = rangeNameMatch[1];
          // TODO: should we throw an exception if specified worksheet name 
          // TODO: does not match this worksheet's name?
        }
        rangeName = `'${worksheetName}'!${rangeNameMatch[2]}`;
      }

      return new NamedRange(rangeName, headerType, headerSize);
    }
  }
}