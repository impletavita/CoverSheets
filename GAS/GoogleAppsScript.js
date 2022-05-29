const CoverSheets = require("../dist/CoverSheets");

class Range {
  set values(data) {
    this.updateSheetData(data);
  }

  get values() {
    return this.getSheet().getData(this.row, this.column, this.numRows, this.numColumns);
  }

  constructor(row, column, numRows, numColumns, sheet) {
    this.row = row;
    this.column = column;
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.sheet = sheet;
  }

  getSheet() {
    if (!this.sheet) {
      this.sheet = SpreadsheetApp.getActiveSheet();
    }
    
    return this.sheet;
  }

  getRow() {
    return this.row;
  }

  getColumn() {
    return this.column;
  }
  
  getValues() {
    return this.values;
  }

  getNumRows() {
    return this.numRows;
  }

  getNumColumns() {
    return this.numColumns;
  }

  setValues(data) {
    this.values = data;
  }

  clearContent() {
    this.values = Array(this.numRows).fill('').map(r => new Array(this.numColumns).fill(''));
  }

  updateSheetData(data) {
    this.getSheet().setData(this.row, this.column, data);
  }

  fillDefaultData() {
    const data = []
    for(let r = 1; r <= this.numRows; r++) {
      data.push(new Array(this.numColumns).fill('').map((v, c) => `VALUE_${r}_${c+1}`));
    }

    this.values = data;

    return data;
  }

  // TODO
  mergeRows(column, startRow, endRow) {

    if (startRow == endRow) {
      return;
    }

    if (startRow > endRow) {
      [startRow, endRow] = [endRow, startRow]
    }

    this.getValues();
    
    for(let row = startRow; row < endRow; row++) {
      this.values[row][column] = '';
    }
  }
}

class Sheet {
  constructor(name, data) {
    this.name = name;
    this.data = data ?? Array(100).fill('').map(r => new Array(100).fill(''));
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  getRange(row, column, numRows, numColumns) {
    return new Range(row, column, numRows, numColumns, this);
  }

  setData(startRow, startColumn, data) {
    const numRows = data.length;
    const numColumns = data[0].length;
    
    for(let row = 0; row < numRows; row++) {
      for(let col = 0; col < numColumns; col++) {
        this.data[startRow + row][startColumn + col] = data[row][col];
      }
    }
  }

  getData(row, column, numRows, numColumns) {
    const data = [];
    for(let r = 0; r < numRows; r++) {
      data[r] = this.data[row + r].slice(column, column + numColumns);
    }
    return data;
  }

  copyTo(destinationSpreadsheet) {
    return destinationSpreadsheet.insertSheet(`Copy of ${this.name}`);
  }

  activate() {
    activeSpreadsheet.setActiveWorksheet(this);
  }
}

const namedRangeMap = {
  "FirstNamedRange" : {
    row: 1,
    col: 1,
    numRows: 4,
    numColumns: 4
  },

  "'Work Sheet With Spaces'!SecondNamedRange" : {
    row: 10,
    col: 10,
    numRows: 3,
    numColumns: 5
  },

  "ThirdNamedRange" : {
    row: 15,
    col: 20,
    numRows: 5,
    numColumns: 5
  },
  
  "SomeSheet!FourthNamedRange" : {
    row: 12,
    col: 16,
    numRows: 4,
    numColumns: 3
  }
}

class NamedRange {
  getRange() {
    return this.range;
  }

  getName() {
    return this.name;
  }
  
  setRange(range) {
    this.range = range;
  }

  constructor(name, range) {
    this.range = range;
    this.name = name;
  }
}

class Spreadsheet {
  constructor() {
    this.namedRanges = [
      "FirstNamedRange",
      "'Work Sheet With Spaces'!SecondNamedRange",
      "SomeSheet!FourthNamedRange"
    ].map(n => new NamedRange(n, this.getRangeByName(n)));
  
  }

  sheets = [
    'Worksheet1', 
    'Some Sheet', 
    'Work Sheet With Spaces',
    'SomeSheet'
  ].map(s => new Sheet(s));

  getSheets() {
    return this.sheets;
  }

  getSheetByName(name) {
    return this.sheets.find(s => s.getName() === name);
  }

  getRangeByName(name) {
    const range = namedRangeMap[name];

      if (!range) {
        console.error(`Range named ${name} not found.`);
        console.log(`Available names are ${Object.keys(namedRangeMap).join()}`);
        return null;
      }

      let worksheet;
      const rangeNameParts = name.split('!');
      if (rangeNameParts.length == 2) {
        const worksheetName = rangeNameParts[0].replace(/["']/g, '');
        worksheet = this.getSheetByName(worksheetName);
      }

      return new Range(range.row, range.col, range.numRows, range.numColumns, worksheet);
  }

  insertSheet(sheetName) {
    const newSheet = new Sheet(sheetName);
    this.sheets.push(newSheet);
    return newSheet;
  }

  setActiveWorksheet(worksheet) {
    this.activeWorksheet = worksheet;
  }

  getNamedRanges() {
    return this.namedRanges;
  }
}

const activeSpreadsheet = new Spreadsheet();

global.SpreadsheetApp = {

  getActiveSheet: () => {
    return new Sheet('ActiveSheet');
  },

  getActiveSpreadsheet: () => activeSpreadsheet,
};

global.DataStubber = class {
  static getData(options) {
    const data = [];
    
    options = DataStubber.initOptions(options);

    if (options.headerType == "ColumnBased") {
      let numColumns = options.numColumns;
      
      // TODO: This logic may need rework. Revisit
      // TODO: when writing RangeDataBuilder.ColumnBased.test.js
      for (let r = 1; r <= options.numRows; r++) {
        let rowData = [];
        if (options.addHeaders) {
          rowData = new Array(options.headerSize)
            .fill('').map((v, c) => `HEADER_${r}_${c+1}`);
        }

        const columnOffset = options.headerSize + options.columnOffset + 1;

        rowData = rowData
          .concat(new Array(numColumns - options.headerSize).fill('')
          .map((v, c) => options.modifier(`VALUE_${r}_${c + columnOffset}`)));
        
          data.push(rowData);
      }
    } else {

      if (options.addHeaders) {
        for(let r = 1; r <= options.headerSize; r++) {
          data.push(new Array(options.numColumns).fill('').map((v, c) => `HEADER_${r}_${c+1}`));
        }
        options.numRows -= options.headerSize;
      }

      const rowOffset = data.length + options.rowOffset + 1;
      
      for (let r = 0; r < options.numRows; r++) {
        data.push(new Array(options.numColumns).fill('')
          .map((v, c) => options.modifier(`VALUE_${r + rowOffset}_${c+1}`)));
      }
    }

    return data;
  }

  static initOptions(options) {
    if (!options.headerSize) {
      options.headerSize = 0;
    }
    if (!options.rowOffset) {
      options.rowOffset = 0;
    }
    if (!options.columnOffset) {
      options.columnOffset = 0;
    }
    if (!options.modifier) {
      options.modifier = v => v;
    }
    if (!options.addHeaders) {
      options.addHeaders = true;
    }
    return options;
  }
}

global.Logger = {
  log: (msg) => {
    console.log(msg);
  }
}

CoverSheets.Range.prototype.setDefaultData = function() {

  const values = DataStubber.getData(this.range.getNumRows(), this.range.getNumColumns(),
    this.headerType, this.headerSize);
  
  this.range.setValues(values);
  
  return values;
}

global.CoverSheets = CoverSheets;