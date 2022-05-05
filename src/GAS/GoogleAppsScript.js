const { Worksheet } = require("../../dist/CoverSheets");

class Range {
  constructor(row, column, numRows, numColumns) {
    this.row = row;
    this.column = column;
    this.numRows = numRows;
    this.numColumns = numColumns;
  }

  getValues() {
    const data = []
    for(let r = 1; r <= this.numRows; r++) {
      data.push(new Array(this.numColumns).fill().map((v, c) => `VALUE_${r}_${c+1}`));
    }
    return data;
  }

  getRangeData() {
    
  }
}

class Sheet {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  getRange(row, column, numRows, numColumns) {
    return new Range(row, column, numRows, numColumns);
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
  }),
};

global.Worksheet1 = new Worksheet("Worksheet1");