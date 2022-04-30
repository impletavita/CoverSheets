function rangeHeaders() {
    
  let range = new CoverSheets.Range({ 
    sheetName: "Test Sheet", 
    row: 1,
    numRows: 7, 
    numColumns: 4, 
    headerType: "RowBased",
    headerSize: 4
  });
  
  logData(range);
  
  range = new CoverSheets.Range({ 
    sheetName: "Test Sheet", 
    row: 10,
    numRows: 4, 
    numColumns: 4, 
    headerType: "RowBased"
  });
  
  logData(range);

  range = new CoverSheets.Range({
      sheetName: "Test Sheet",
      row: 17,
      numRows: 4,
      numColumns: 6,
      headerType: "ColumnBased", 
      headerSize: 3
  });
  
  logData(range);
}

function logData(range) {
  const headers = range.getHeaders();
  Logger.log(`Headers: ${headers}`);
  Logger.log(`Values: ${range.getValuesByHeader(headers[0])}`);
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
