import { CSWorksheet } from "./CSWorksheet";
class CSSpreadsheet {
  spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
  
  constructor(spreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    if (!spreadsheet) {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }

    this.spreadsheet = spreadsheet;
  }

  /**
   * Retrieves a Worksheet of the specified name in this spreadheet.
   * @param sheetName The name of the worksheet
   * @returns Worksheet representing the worksheet of the specified name. If no 
   * such worksheet is found, returns null
   */
  getSheetByName(sheetName: string): CSWorksheet | null {
    const sheet = this.spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      // TODO
      // CSUtils.showWarning(`Worksheet named "${sheetName}" does not exist. Returning active sheet.`)
      return null;
    }

    return new CSWorksheet(sheet);
  }

  /**
   * 
   * @returns All the Worksheets in this spreadsheet.
   */
  getSheets(): CSWorksheet[] {
    return this.spreadsheet.getSheets().map(s => new CSWorksheet(s));
  }

  /**
   * Adds a new worksheet of the specified name to the Spreadsheet. If a sheet of 
   * the same name already exists, returns that instead.
   * @param sheetName The name of the sheet to add
   * @returns The newly added worksheet. If the sheet already exists, return that instead.
   */
  addSheet(sheetName: string): CSWorksheet {
    const sheet = this.getSheetByName(sheetName);

    return sheet ?? new CSWorksheet(this.spreadsheet.insertSheet(sheetName));
  }

  cloneWorksheet(source: string, destination: string, activate:boolean = true): CSWorksheet | null {
    const activateSheet = (worksheet:CSWorksheet) => {
      if (activate) {
        worksheet.sheet.activate();
      }
    }
    let destinationSheet = this.getSheetByName(destination);

    if (destinationSheet) {
      activateSheet(destinationSheet);

      return destinationSheet;
    }

    const sourceSheet = this.getSheetByName(source);
    if (!sourceSheet) {
      Utils.showError(`Missing worksheet named ${source}`);
      return null;
    }

    const clonedSheet = sourceSheet.sheet.copyTo(this.spreadsheet);
    clonedSheet.setName(destination);
    destinationSheet = new CSWorksheet(clonedSheet);
    
    activateSheet(destinationSheet);

    return destinationSheet;
  }
}

export {CSSpreadsheet as Spreadsheet}