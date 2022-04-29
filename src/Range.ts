
namespace CoverSheets {
  export type rangeContructorParams = {
    sheetName?: string;
    row?: number;
    column?: number;
    numRows?: number;
    numColumns?: number;
    headerInfo?: {
      type?: "None" | "RowBased" | "ColumnBased",
      headerSize: number;
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
      headerSize: number; 
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

    getHeaders() : string[] {
      const values = this.range.getValues();

      switch(this.headerInfo.type) {
        case "RowBased":
          let data = values.slice(0, this.headerInfo.headerSize + 1);
          data.forEach(d => d.slice(1).forEach((dd,i) => d[i+1] = (dd === '' ? d[i] : dd)));
          return data.reduce((r, a) => a.map((b, i) => (r[i] ?? '')+ b), []);
        case "ColumnBased":
          let headerData = values.map(v => v.slice(0, this.headerInfo.headerSize));
          headerData = Utils.transpose(headerData);
          Logger.log(headerData);
          headerData.forEach(d => d.slice(1).forEach((dd,i) => d[i+1] = (dd === '' ? d[i] : dd)));
          Logger.log(headerData);
          return headerData.reduce((r, a) => a.map((b, i) => (r[i] ?? '')+ b), []);
        default:
          return [];
      }
    }

    /**
     * For the specified header, return all the values as an array
     * @param header the name of the header
     */
    getValuesByHeader(header:string) :[] {
      return [];
    }
  }
}