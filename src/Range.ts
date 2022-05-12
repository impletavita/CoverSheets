
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
    getValuesByHeader(header:string) :undefined[] {
      let valuesByHeader:undefined[] = [];

      let values = this.getValues();

      const headers = this.getHeaders();
      const headerIndex = headers.indexOf(header);

      if (headerIndex > -1) {
        valuesByHeader = values.map(v => v[headerIndex]);
      }

      return valuesByHeader;
    }

    getValues(includeHeader = false) {
      let values = this.range.getValues();

      if (includeHeader) {
        return values;
      }

      const headers = this.getHeaders();
      if (this.headerType == "RowBased") {
        values = values.slice(this.headerSize);
      } else if (this.headerType == "ColumnBased") {
        values = Utils.transpose(values);
        values = values.slice(this.headerSize);
      }
    
      return values;
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

    /**
     * Add data to the range. 
     * If the range is RowBased, new rows will be added. If it is 
     * ColumnBased, new columns will be added.
     * @param data data to append to range
     */
    addData(data:undefined[][]) {
      let oldRange = this.range;


      let newStartRow = oldRange.getRow() + oldRange.getNumRows();
      let newStartColumn = oldRange.getColumn();
      let rowsToAdd = data.length;
      let columnsToAdd = 0;

      if (this.headerType === "ColumnBased") {
        newStartRow = oldRange.getRow();
        newStartColumn += oldRange.getNumColumns();
        rowsToAdd = 0;
        columnsToAdd = data[0].length;
      }

      const addedRange = oldRange.getSheet().getRange(newStartRow, newStartColumn,
        data.length, data[0].length);

      addedRange.setValues(data);

      this.range = oldRange.getSheet().getRange(oldRange.getRow(), oldRange.getColumn(),
        oldRange.getNumRows() + rowsToAdd, oldRange.getNumColumns() + columnsToAdd);      
    }

    getDataAsObjects() {
      let headers = this.getHeaders();
      let values = this.getValues();

      return values.map(v => this.getVectorAsObject(v, headers));
    }

    getVectorAsObject(vector, headers) {
      const obj = {}
      headers.forEach((h, i) => {
        obj[h] = vector[i];
      })

      return obj;
    }

    addObjects(objects) {
      // convert the objects into a 2D array
    }

    metadata(range = this.range) {
      return `row: ${range.getRow()}, col: ${range.getColumn()},` +
        `numRows: ${range.getNumRows()}, numColumns: ${range.getNumColumns()}`;
    }
  }
}
