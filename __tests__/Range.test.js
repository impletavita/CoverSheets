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

test('Range constructor with worksheet updates sheetName', () => {

  let range = new CoverSheets.Range({
    worksheet: Worksheet1,
  });
  expect(range.rangeOptions.sheetName).toEqual("Worksheet1");

  // test that worksheet takes precedence over sheetName
  range = new CoverSheets.Range({
    worksheet: Worksheet1,
    sheetName: "SomethingElse"
  });
  expect(range.rangeOptions.sheetName).toEqual("Worksheet1");
})

test('Range with one row of headers', () => {
  range = new CoverSheets.Range({
    sheetName: "Some Sheet",
    row: 1, column: 1, numRows: 4, numColumns: 4, 
    headerType:"RowBased", headerSize: 1
  });

  expect(range.getHeaders()).toEqual([ 'VALUE_1_1', 'VALUE_1_2', 'VALUE_1_3', 'VALUE_1_4' ]);
  expect(range.getValuesByHeader("VALUE_1_1")).toEqual(['VALUE_2_1', 'VALUE_3_1', 'VALUE_4_1']);
  expect(range.getValuesByHeader("VALUE_1_3")).toEqual(['VALUE_2_3', 'VALUE_3_3', 'VALUE_4_3']);
})

test('Range with one column of headers', () => {
  range = new CoverSheets.Range({
    sheetName: "Some Sheet",
    row: 1, column: 1, numRows: 4, numColumns: 4, 
    headerType:"ColumnBased", headerSize: 1
  });
  
  expect(range.getHeaders()).toEqual([ 'VALUE_1_1', 'VALUE_2_1', 'VALUE_3_1', 'VALUE_4_1' ]);
  expect(range.getValuesByHeader("VALUE_1_1")).toEqual(['VALUE_1_2', 'VALUE_1_3', 'VALUE_1_4']);
  expect(range.getValuesByHeader("VALUE_3_1")).toEqual(['VALUE_3_2', 'VALUE_3_3', 'VALUE_3_4']);
})