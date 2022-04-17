
  export class Spreadsheet {
    static get spreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
      return SpreadsheetApp.getActiveSpreadsheet();
    }
    
    static getSheetByName(sheetName: string): GoogleAppsScript.Spreadsheet.Sheet{
      const sheet = Spreadsheet.spreadsheet.getSheetByName(sheetName);

      if (!sheet) {
        // TODO
        // CSUtils.showWarning(`Worksheet named "${sheetName}" does not exist. Returning active sheet.`)
        return Spreadsheet.spreadsheet.getActiveSheet();
      }

      return sheet;
    }
  }
