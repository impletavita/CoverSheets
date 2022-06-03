namespace CoverSheets {
  
  export type SheetNameAndId = Pick<GoogleAppsScript.Sheets.Schema.SheetProperties,
    "title" | "sheetId">;
  export type SheetGroupData = Pick<GoogleAppsScript.Sheets.Schema.Sheet, 
    "rowGroups" | "columnGroups"> & SheetNameAndId;

  export class Spreadsheet {

    static getActiveWorksheet(): Worksheet {
      return new Worksheet(SpreadsheetApp.getActiveSheet());
    }
    
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
     * such worksheet is found, returns undefined
     */
    getSheetByName(sheetName: string): Worksheet | undefined {
      const sheet = this.spreadsheet.getSheetByName(sheetName);

      if (!sheet) {
        // TODO
        // CSUtils.showWarning(`Worksheet named "${sheetName}" does not exist. Returning active sheet.`)
        return undefined;
      }

      return new Worksheet(sheet);
    }

    /**
     * 
     * @returns All the Worksheets in this spreadsheet.
     */
    getSheets(): Worksheet[] {
      return this.spreadsheet.getSheets().map(s => new Worksheet(s));
    }

    /**
     * Adds a new worksheet of the specified name to the Spreadsheet. If a sheet of 
     * the same name already exists, returns that instead.
     * @param sheetName The name of the sheet to add
     * @returns The newly added worksheet. If the sheet already exists, return that instead.
     */
    addSheet(sheetName: string): Worksheet {
      const sheet = this.getSheetByName(sheetName);

      return sheet ?? new Worksheet(this.spreadsheet.insertSheet(sheetName));
    }

    cloneWorksheet(source: string, destination: string, activate:boolean = true): Worksheet | null {
      const activateSheet = (worksheet:Worksheet) => {
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
      destinationSheet = new Worksheet(clonedSheet);
      
      activateSheet(destinationSheet);

      return destinationSheet;
    }

    /**
     * 
     * @returns All row and column groups in the Spreadsheet
     */
    static getGroups():SheetGroupData[] {
      if (typeof Sheets === 'undefined') {
        Logger.log("Sheets service not enabled for this script. Please follow instructions at " + 
          "https://developers.google.com/apps-script/guides/services/advanced#enable_advanced_services to enble the Sheets service");
    
        return [];
      }

      // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/sheets
      // https://stackoverflow.com/a/52482730

      const allSheetsWithGroupData = Sheets.Spreadsheets?.get(SpreadsheetApp.getActive().getId(), {
        fields: "sheets(columnGroups,properties(sheetId,title),rowGroups)"
      }).sheets;

      const sheetGroupData : SheetGroupData[] = [];
      allSheetsWithGroupData?.forEach(s => {
        sheetGroupData.push({
          title: s.properties?.title,
          sheetId: s.properties?.sheetId,
          rowGroups: s.rowGroups,
          columnGroups: s.columnGroups
        })
      });
      return sheetGroupData;
    }

    static removeAllGroups() {
      if (typeof Sheets === 'undefined') {
        Logger.log("Sheets service not enabled for this script. Please follow instructions at " + 
          "https://developers.google.com/apps-script/guides/services/advanced#enable_advanced_services to enble the Sheets service");
    
        return;
      }

      const sheetsWithGroups: SheetGroupData[] = Spreadsheet.getGroups();
      const removeRequests:any[] = [];
      const getDeleteGroupRequest = (sheetId:number, dimension:string) => {
        return {
            deleteDimensionGroup: {
              range: { sheetId: sheetId,
                     dimension: dimension }
            }
        }
      }

      sheetsWithGroups.forEach(s => {
        let maxColGroupDepth = 
          Math.max(...s.columnGroups!.map(g => g.depth ?? 0));
        let maxRowGroupDepth = 
          Math.max(...s.rowGroups!.map(g => g.depth ?? 0));
        for(let i = 0; i < maxColGroupDepth; i++) {
          removeRequests.push(getDeleteGroupRequest(s.sheetId!, "COLUMNS"))
        }

        for(let i = 0; i < maxRowGroupDepth; i++) {
          removeRequests.push(getDeleteGroupRequest(s.sheetId!, "ROW"))
        }

      })

      if (removeRequests.length) {
        Sheets.Spreadsheets?.batchUpdate({requests: removeRequests}, 
          SpreadsheetApp.getActive().getId());
      }
    }
  }
}