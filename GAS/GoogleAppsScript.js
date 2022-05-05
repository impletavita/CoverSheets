const { Worksheet } = require("../dist/CoverSheets");

class Range {
  constructor(row, column, numRows, numColumns) {
    this.row = row;
    this.column = column;
    this.numRows = numRows;
    this.numColumns = numColumns;
  }

  getValues() {
    return this.values ?? (this.values = this.getData());
  }

  getData() {
    const data = []
    for(let r = 1; r <= this.numRows; r++) {
      data.push(new Array(this.numColumns).fill().map((v, c) => `VALUE_${r}_${c+1}`));
    }
    return data;
  }

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