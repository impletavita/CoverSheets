namespace CoverSheets {
  export type HeaderType = "None" | "RowBased" | "ColumnBased";

  export type RangeOptions = {
    range?: GoogleAppsScript.Spreadsheet.Range;
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

      if (paramsWithDefaults.range) {
        this.range = paramsWithDefaults.range;
      } else {
        this.range = paramsWithDefaults.worksheet.sheet.getRange(paramsWithDefaults.row, 
          paramsWithDefaults.column, paramsWithDefaults.numRows, paramsWithDefaults.numColumns);
      }
    }

    initParams(params?: Partial<RangeOptions> ): RangeOptions {
      const worksheet = Spreadsheet.getActiveWorksheet();

      const defaults: RangeOptions = {
        range: undefined,
        worksheet: worksheet,
        sheetName: worksheet.sheet.getName(),
        row: 1,
        column: 1,
        numRows: 1,
        numColumns: 1,
        headerType: "None",
        headerSize: 1
      }

      if (params?.range) {
        params.worksheet = new Worksheet(params.range.getSheet());
      } else if (params?.worksheet) {
        params.sheetName = params.worksheet.sheet.getName();
      } else if (params?.sheetName) {
        params.worksheet = new Spreadsheet().getSheetByName(params.sheetName);
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
        if (this.headerType == "ColumnBased") {
          valuesByHeader = values[headerIndex];
        } else {
          valuesByHeader = values.map(v => v[headerIndex]);
        }
      }

      return valuesByHeader;
    }

    getValues(includeHeader = false) {
      let values = this.range.getValues();

      if (includeHeader) {
        return values;
      }

      return this.getValuesRange().getValues();
    }

    getValuesRange(): GoogleAppsScript.Spreadsheet.Range {
      let row = this.range.getRow();
      let column = this.range.getColumn();
      let numRows = this.range.getNumRows();
      let numColumns = this.range.getNumColumns();
 
      if (this.headerType == "RowBased") {
        row += this.headerSize;
        numRows -= this.headerSize;
      } else if (this.headerType == "ColumnBased") {
        column += this.headerSize;
        numColumns -= this.headerSize;
      }

      return this.range.getSheet().getRange(row, column, numRows, numColumns);
    }

    /**
     * Replace the data in this range. Range will be resized as necessary.
     * @param data new data to replace with
     * @param preserveHeaders if true, replace values only
     */
    replaceData(data:any[], preserveHeaders=false): GoogleAppsScript.Spreadsheet.Range {
      let oldRange = this.range;
      let replaceRange = preserveHeaders ? this.getValuesRange() : oldRange;
      let sheet = this.range.getSheet();
      let newRange = sheet.getRange(replaceRange.getRow(), 
        replaceRange.getColumn(), data.length, data[0].length);

      replaceRange.clearContent();
      newRange.setValues(data);

      if (preserveHeaders) {
        let numRows = newRange.getNumRows();
        let numColumns = newRange.getNumColumns();
        if (this.headerType === "RowBased") {
          numRows += this.headerSize;
        } else if (this.headerType === "ColumnBased") {
          numColumns += this.headerSize;
        }
        newRange = sheet.getRange(oldRange.getRow(), oldRange.getColumn(),
          numRows, numColumns);
      }

      this.range = newRange;
      return newRange;
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

      if (this.headerType == "ColumnBased") {
        values = Utils.transpose(values);
      }
      
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
      const headers = this.getHeaders();
      let newData:undefined[][] = [];

      headers.forEach(h => {
        const values = objects.map(o => o[h] ?? '')
        newData.push(values)
      });

      if (this.headerType == "RowBased") {
        newData = Utils.transpose(newData);
      }

      this.addData(newData);
    }

    metadata(range = this.range) {
      return `row: ${range.getRow()}, col: ${range.getColumn()},` +
        `numRows: ${range.getNumRows()}, numColumns: ${range.getNumColumns()}`;
    }
  }
}
