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
    headerType: HeaderType;
    headerSize: number;
    worksheet: Worksheet;

    range: GoogleAppsScript.Spreadsheet.Range;

    constructor(params?: Partial<RangeOptions>) {
      const paramsWithDefaults = this.initParams(params);
      
      this.headerType = paramsWithDefaults.headerType;
      this.headerSize = paramsWithDefaults.headerSize;
      this.worksheet = paramsWithDefaults.worksheet;

      this.range = paramsWithDefaults.worksheet.getRange(paramsWithDefaults.row, 
        paramsWithDefaults.column, paramsWithDefaults.numRows, paramsWithDefaults.numColumns);
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

      switch(this.headerType) {
        case "RowBased":
          return coaleseHeaders(values.slice(0, this.headerSize));
        case "ColumnBased":
          let headerData = values.map(v => v.slice(0, this.headerSize));
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
      let valuesByHeader:any[] = [];

      const headers = this.getHeaders();
      const headerIndex = headers.indexOf(header);

      let values = this.range.getValues();
      if (this.headerType == "RowBased") {
        values = values.slice(this.headerSize);
      } else if (this.headerType == "ColumnBased") {
        values = Utils.transpose(values);
        values = values.slice(this.headerSize);
      }
    
      if (headerIndex > -1) {
        valuesByHeader = values.map(v => v[headerIndex]);
      }

      return valuesByHeader;
    }

    /**
     * Replace all the data in this range. Range will be resized as necessary.
     * @param data new data to replace with
     */
    replaceData(data:any[]) {
      let oldRange = this.range;

      let newRange = this.range.getSheet().getRange(this.range.getRow(), this.range.getColumn(),
        data.length, data[0].length);
      
      oldRange.clearContent();
      this.range = newRange;
      newRange.setValues(data);
    }
  }
}
