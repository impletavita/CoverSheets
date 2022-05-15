const { Worksheet } = require("../dist/CoverSheets");

class Range {
  set values(data) {
    this.updateSheetData(data);
  }

  get values() {

    return this.sheet.getData(this.row, this.column, this.numRows, this.numColumns);
  }

  constructor(row, column, numRows, numColumns, sheet) {
    this.row = row;
    this.column = column;
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.sheet = sheet;
  }

  getSheet() {
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
    this.sheet.setData(this.row, this.column, data);
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
}

const namedRangeMap = {
  "FirstNamedRange" : {
    row: 1,
    col: 1,
    numRows: 4,
    numColumns: 4
  },

  "SecondNamedRange" : {
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
  }
}
global.SpreadsheetApp = {

  getActiveSheet: () => {
    return new Sheet('ActiveSheet');
  },

  getActiveSpreadsheet: () => ({
    getSheetByName: (name) => {
      return new Sheet(name)
    },
    getRangeByName: (name) => {
      const range = namedRangeMap[name];

      if (!range) {
        console.error(`Range named ${name} not found.`);
        console.log(`Available names are ${Object.keys(namedRangeMap).join()}`);
        return null;
      }

      return new Range(range.row, range.col, range.numRows, range.numColumns,SpreadsheetApp.getActiveSheet());
    }
  }),
};

global.Worksheet1 = new Worksheet("Worksheet1");