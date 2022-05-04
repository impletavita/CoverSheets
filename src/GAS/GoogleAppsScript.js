class Range {
  constructor(row, column, numRows, numColumns) {

  }

  getValues() {
    return [];
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
    getSheetByName: (name) => {return new Sheet(name)},
  }),
};
