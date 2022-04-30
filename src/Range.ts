
namespace CoverSheets {
  export type HeaderType = "None" | "RowBased" | "ColumnBased";

  export type RangeOptions = {
    worksheet: Worksheet;
    sheetName: string;
    row: number;
    column: number;
    numRows: number;
    numColumns: number;
    headerType: HeaderType
    headerSize: number;
  }

  export class Range {
    rangeOptions: RangeOptions;

    range: GoogleAppsScript.Spreadsheet.Range;
    
    constructor(params?: Partial<RangeOptions>) {
      this.rangeOptions = this.initParams(params);

      if (this.rangeOptions.sheetName) {
        this.rangeOptions.worksheet = new Spreadsheet().getSheetByName(this.rangeOptions.sheetName) as Worksheet;
      }

      this.range = this.rangeOptions.worksheet.getRange(this.rangeOptions.row, 
        this.rangeOptions.column, this.rangeOptions.numRows, this.rangeOptions.numColumns);
    }
    
    initParams(params?: Partial<RangeOptions> ): RangeOptions {
      const worksheet = Spreadsheet.getActiveWorksheet();
      
      const defaults: RangeOptions = {
        worksheet: worksheet,
        sheetName: worksheet.sheet.getName(),
        row: 1,
        column: 1,
        numRows: 1,
        numColumns: 1,
        headerType: "None",
        headerSize: 1
      }

      if (params?.worksheet) {
        params.sheetName = params.worksheet.sheet.getName();
      } else if (params?.sheetName) {
        params.worksheet = new Spreadsheet().getSheetByName(params.sheetName) as Worksheet;
      }

      const retVal = {
        ...defaults,
        ...params
      }

      return retVal;
    }

    getHeaders() : string[] {
      const values = this.range.getValues();
   
      const coaleseHeaders = (headers:string[][]):string[] =>  {
        headers.forEach(d => d.slice(1).forEach((dd,i) => d[i+1] = (dd === '' ? d[i] : dd)));
        return headers.reduce((r, a) => a.map((b, i) => (r[i] ?? '')+ b), []);
      }

      switch(this.rangeOptions.headerType) {
        case "RowBased":
          return coaleseHeaders(values.slice(0, this.rangeOptions.headerSize));
        case "ColumnBased":
          let headerData = values.map(v => v.slice(0, this.rangeOptions.headerSize));
          headerData = Utils.transpose(headerData);
          return coaleseHeaders(headerData);
        default:
          return [];
      }
    }

    /**
     * For the specified header, return all the values as an array
     * @param header the name of the header
     */
    getValuesByHeader(header:string) :any[] {
      let valuesByHeader = [];

      const headers = this.getHeaders();
      const headerIndex = headers.indexOf(header);
      const values = this.range.getValues().slice(this.rangeOptions.headerSize);

      if (headerIndex > -1) {
        valuesByHeader = values.map(v => v[headerIndex]);
      }

      return valuesByHeader;
    }
  }
}
