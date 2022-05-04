const CoverSheets =  require('../dist/CoverSheets');

test('Range constructor with no parameters should default to active sheet', () => {
  let range = new CoverSheets.Range();
  expect(range).not.toBeNull();
  expect(range.rangeOptions.worksheet.sheet.getName()).toBe("ActiveSheet");
  expect(range.rangeOptions).toMatchObject({
    sheetName:'ActiveSheet',
    row: 1,
    column: 1,
    numRows: 1,
    numColumns: 1,
    headerType: "None",
    headerSize: 1
  });

  expect(range.getHeaders()).toEqual([]);
  expect(range.getValuesByHeader("something")).toEqual([]);
});

