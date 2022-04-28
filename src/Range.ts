
namespace CoverSheets {
  export type rangeContructorParams = {
    sheetName?: string;
    row?: number;
    column?: number;
    numRows?: number;
    numColumns?: number;
    headerInfo?: {
      type?: "None" | "RowBased" | "ColumnBased",
      headerSize?: number;
    }
  }

  export class Range {
    sheetName: string;
    worksheet: Worksheet;
    row: number;
    column: number;
    numRows: number;
    numColumns: number;
    headerInfo: { 
      type?: "None" | "RowBased" | "ColumnBased"; 
      headerSize?: number; 
    };
    range: GoogleAppsScript.Spreadsheet.Range;
    
    constructor(params?: rangeContructorParams) {
      if (params?.sheetName) {
        this.sheetName = params.sheetName;
        this.worksheet = new Spreadsheet().getSheetByName(this.sheetName) as Worksheet;
      } else {
        this.worksheet = Spreadsheet.getActiveWorksheet();
        this.sheetName = this.worksheet.sheet.getName();
      }

      this.row = params?.row ?? 1;
      this.column = params?.column ?? 1;
      this.numRows = params?.numRows ?? 1;
      this.numColumns = params?.numColumns ?? 1;
      this.headerInfo = params?.headerInfo ?? {type: "None", headerSize: 1};

      this.range = this.worksheet.getRange(this.row, this.column, this.numRows, this.numColumns);
    }

    getHeaders() : string[][] {
      const values = this.range.getValues();

      switch(this.headerInfo.type) {
        case "RowBased":
          return values.slice(0, this.headerInfo.headerSize);
        case "ColumnBased":
          return values.map(v => v.slice(0, this.headerInfo.headerSize));
        default:
          return [];
      }
    }
  }
}