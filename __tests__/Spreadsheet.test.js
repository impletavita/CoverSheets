const CoverSheets =  require('../dist/CoverSheets');

test('cloneWorksheet', () => {
  const sourceSheetName = "Worksheet1";
  const destinationSheetName = "Copy of Worksheet1";

  const spreadsheet = new CoverSheets.Spreadsheet(SpreadsheetApp.getActiveSpreadsheet());
  const currentWorksheets = spreadsheet.getSheets();

  const destinationSheet = spreadsheet.cloneWorksheet(sourceSheetName, destinationSheetName);
  
  expect(spreadsheet.getSheets().length).toBe(currentWorksheets.length + 1);
  expect(destinationSheet.sheet.getName()).toEqual(destinationSheetName);
  expect(spreadsheet.spreadsheet.activeWorksheet).toBe(destinationSheet.sheet);
})