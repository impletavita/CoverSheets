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

  export type ValuesRange = {
    range?: GoogleAppsScript.Spreadsheet.Range;
    row: number;
    column: number;
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
        headerSize: 0
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
      return new RangeDataBuilder(this.range.getValues(), this.headerType, this.headerSize).getHeaders();
    }

    /**
     * For the specified header, return all the values as an array
     * @param header the name of the header
     */
    getValuesByHeader(header:string) :undefined[] {
      let valuesByHeader:undefined[] = [];

      let values = this.getValues();

      if (values.length == 0) {
        return [];
      }
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
      let values:undefined[][] = this.range.getValues();

      if (includeHeader) {
        return values;
      }

      return this.getValuesRange().range?.getValues() ?? [];
    }

    getValuesRange(defaultRows = 0, defaultColumns = 0): ValuesRange {
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
      
      const valuesRange:ValuesRange = {
        row: row,
        column: column,
        range: undefined,
      }

      numRows = Math.max(numRows, defaultRows);
      numColumns = Math.max(numColumns, defaultColumns);

      if (numRows > 0 && numColumns > 0) {
        valuesRange.range = this.range.getSheet().getRange(row, column, numRows, numColumns);
      }

      return valuesRange;
    }

    /**
     * Replace the data in this range. Range will be resized as necessary.
     * @param data new data to replace with
     * @param preserveHeaders if true, replace values only
     */
    replaceData(data:any[], preserveHeaders=false): GoogleAppsScript.Spreadsheet.Range {
      let oldRange = this.range;

      let row = this.range.getRow();
      let column = this.range.getColumn();

      if (preserveHeaders) {
        let valuesRange = this.getValuesRange();

        row = valuesRange.row;
        column = valuesRange.column;

        valuesRange.range?.clearContent()
      }

      let sheet = this.range.getSheet();
      
      let numRows = data.length;
      let numColumns = data[0].length;

      let newRange = sheet.getRange(row, column, 
        numRows, numColumns);

      newRange.setValues(data);
 
      if (preserveHeaders) {
        if (this.headerType === "RowBased") {
          numRows += this.headerSize;
        } else if (this.headerType === "ColumnBased") {
          numColumns += this.headerSize;
        }
      }
      
      newRange = sheet.getRange(oldRange.getRow(), oldRange.getColumn(),
        numRows, numColumns);

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

    getDataAsObjects<T extends {}>(): T[] {
      let headers = this.getHeaders();
      let values = this.getValues();

      if (this.headerType == "ColumnBased") {
        values = Utils.transpose(values);
      }
      
      return values.map(v => this.getVectorAsObject<T>(v, headers));
    }

    getVectorAsObject<T extends {}>(vector, headers): T {
      const obj = {}

      headers.forEach((h, i) => {
        obj[h] = vector[i];
      })

      return obj as T;
    }

    addObjects(objects) {
      this.addData(this.convertObjectsToData(objects));
    }

    convertObjectsToData(objects) {
      const headers = this.getHeaders();
      let data:undefined[][] = [];

      headers.forEach(h => {
        const values = objects.map(o => o[h] ?? '')
        data.push(values)
      });

      if (this.headerType == "RowBased") {
        data = Utils.transpose(data);
      }

      return data;
    }

    /**
     * Add the specified array of objects after the first object that matches
     * the specified matcher. If objects of the specfied keys already exist,
     * merge the data instead.
     */
     insertObjects<T>(matcher: (item:T) => boolean, objects:T[], after=true) {
       const rangeDataBuilder:RangeDataBuilder = new RangeDataBuilder(this.range.getValues(), this.headerType, this.headerSize)
        .insertObjects(matcher, objects, after);

      this.setValues(rangeDataBuilder.getValues());
     }

     /**
      * Sets the "values" portion of the range. If this is a headered range,
      * the header is not modified. 
      * @param values Values to be set in the range
      */
    setValues(values: undefined[][]) {
      let numRows = values.length;
        let numColumns = values[0].length;

      const range = this.getValuesRange(numRows, numColumns).range;
      if (range) {
        range.setValues(values);
        let row = this.range.getRow();
        let column = this.range.getColumn();

        if (this.headerType == "ColumnBased") {
          numColumns += this.headerSize;
        } else {
          numRows += this.headerSize;
        }

        this.range = this.range.getSheet().getRange(row, column, numRows, numColumns);
      }
    }

    getBuilder() {
      return new RangeDataBuilder(this.range.getValues(), this.headerType, this.headerSize);
    }

    metadata(range = this.range) {
      return `row: ${range.getRow()}, col: ${range.getColumn()},` +
        `numRows: ${range.getNumRows()}, numColumns: ${range.getNumColumns()}`;
    }
  }
}
