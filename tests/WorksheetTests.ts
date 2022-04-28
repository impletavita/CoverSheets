function range() {
  var range = new CoverSheets.Range({ sheetName: "Test Sheet", numRows: 6, numColumns: 3, headerInfo: { type: "RowBased", headerSize: 3 } });
  Logger.log(range.getHeaders());

  range = new CoverSheets.Range({ 
    sheetName: "Test Sheet", 
    row: 13,
    numRows: 4, 
    numColumns: 6, 
    headerInfo: { type: "ColumnBased", headerSize: 3 } });
  Logger.log(range.getHeaders());
}


function constructorParameterCannotBeNull() {
  try {
    const newWorksheet = new CoverSheets.Worksheet("DoesNotExist");
  } catch(e) {
    CoverSheets.CSUtils.log(e as string, "Toast");
  }

  Logger.log(CoverSheets.CSUtils.getProperty("User", "Logdata"));
}

function newWorksheet() {
  const newWorksheet = new CoverSheets.Worksheet("Test Sheet");
  Logger.log(newWorksheet.sheet.getName());
}
