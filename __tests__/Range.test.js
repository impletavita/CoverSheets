const CoverSheets =  require('../dist/CoverSheets');

test('Range constructor with no parameters should default to active sheet', () => {
  const range = new CoverSheets.Range();
  expect(range).not.toBeNull();
  expect(range.worksheet.sheet.getName()).toBe("ActiveSheet");
  expect(range.range).toMatchObject({
    row: 1,
    column: 1,
    numRows: 1,
    numColumns: 1,
    sheet: range.worksheet.sheet
  });

  expect(range.getHeaders()).toEqual([]);
  expect(range.getValuesByHeader("something")).toEqual([]);
});

test('Range constructor with worksheet updates sheetName', () => {

  let range = new CoverSheets.Range({
    worksheet: Worksheet1,
  });
  expect(range.worksheet.sheet.getName()).toEqual("Worksheet1");

  // test that worksheet takes precedence over sheetName
  range = new CoverSheets.Range({
    worksheet: Worksheet1,
    sheetName: "SomethingElse"
  });
  expect(range.range.sheet.getName()).toEqual("Worksheet1");
})

test('Range with one row of headers', () => {
  const range = new CoverSheets.Range({
    sheetName: "Some Sheet 1",
    row: 1, column: 1, numRows: 4, numColumns: 4, 
    headerType:"RowBased", headerSize: 1
  });

  range.range.fillDefaultData();

  expect(range.getHeaders()).toEqual([ 'VALUE_1_1', 'VALUE_1_2', 'VALUE_1_3', 'VALUE_1_4' ]);
  expect(range.getValuesByHeader("VALUE_1_1")).toEqual(['VALUE_2_1', 'VALUE_3_1', 'VALUE_4_1']);
  expect(range.getValuesByHeader("VALUE_1_3")).toEqual(['VALUE_2_3', 'VALUE_3_3', 'VALUE_4_3']);
})

test('Range with one column of headers', () => {
  const range = new CoverSheets.Range({
    sheetName: "Some Sheet",
    row: 1, column: 1, numRows: 4, numColumns: 4, 
    headerType:"ColumnBased", headerSize: 1
  });
  
  range.range.fillDefaultData();

  expect(range.getHeaders()).toEqual([ 'VALUE_1_1', 'VALUE_2_1', 'VALUE_3_1', 'VALUE_4_1' ]);
  expect(range.getValuesByHeader("VALUE_1_1")).toEqual(['VALUE_1_2', 'VALUE_1_3', 'VALUE_1_4']);
  expect(range.getValuesByHeader("VALUE_3_1")).toEqual(['VALUE_3_2', 'VALUE_3_3', 'VALUE_3_4']);
})

test('Range with 3 rows of headers', () => {
  const range = new CoverSheets.Range({
    sheetName: 'Some Sheet',
    row: 1, column: 1, numRows: 5, numColumns: 3,
    headerType: "RowBased", headerSize: 3
  })

  range.range.fillDefaultData();

  expect(range.getHeaders()).toEqual(
    [
      'VALUE_1_1VALUE_2_1VALUE_3_1',
      'VALUE_1_2VALUE_2_2VALUE_3_2',
      'VALUE_1_3VALUE_2_3VALUE_3_3'
    ])
})

test('Range with 3 columns of headers', () => {
  const range = new CoverSheets.Range({
    sheetName: 'Some Sheet',
    row: 1, column: 1, numRows: 4, numColumns: 6,
    headerType: "ColumnBased", headerSize: 3
  })

  range.range.fillDefaultData();

  expect(range.getHeaders()).toEqual(
    [
      'VALUE_1_1VALUE_1_2VALUE_1_3',
      'VALUE_2_1VALUE_2_2VALUE_2_3',
      'VALUE_3_1VALUE_3_2VALUE_3_3',
      'VALUE_4_1VALUE_4_2VALUE_4_3'
    ])
})

test('TODO: Range with merged rows in header', () => {
  const range = new CoverSheets.Range({
    sheetName: 'Some Sheet',
    row: 1, column: 1, numRows: 4, numColumns: 6,
    headerType: "RowBased", headerSize: 3
  })
  range.range.fillDefaultData();
  // range.range.mergeRows(1, 1, 2);

  // TODO: Missing assertions
})

test('replaceData', () => {
  const range = new CoverSheets.Range({
    sheetName: 'Some Sheet',
    row: 4, column: 5, numRows: 3, numColumns: 2
  })
  range.range.fillDefaultData();
  expect(range.range.getValues()).toEqual(
    [
      [ 'VALUE_1_1', 'VALUE_1_2' ],
      [ 'VALUE_2_1', 'VALUE_2_2' ],
      [ 'VALUE_3_1', 'VALUE_3_2' ]
    ]
  )

  let newValues = [
    ['NEW_VALUE_1_1', 'NEW_VALUE_1_2', 'NEW_VALUE_1_3', 'NEW_VALUE_1_4'],
    ['NEW_VALUE_2_1', 'NEW_VALUE_2_2', 'NEW_VALUE_2_3', 'NEW_VALUE_2_4'],
    ['NEW_VALUE_3_1', 'NEW_VALUE_3_2', 'NEW_VALUE_3_3', 'NEW_VALUE_3_4'],
    ['NEW_VALUE_4_1', 'NEW_VALUE_4_2', 'NEW_VALUE_4_3', 'NEW_VALUE_4_4'],
    ['NEW_VALUE_5_1', 'NEW_VALUE_5_2', 'NEW_VALUE_5_3', 'NEW_VALUE_5_4'],
  ]
  range.replaceData(newValues);

  expect(range.range.getRow()).toEqual(4);
  expect(range.range.getColumn()).toEqual(5);
  expect(range.range.getNumRows()).toEqual(5);
  expect(range.range.getNumColumns()).toEqual(4);

  newValues = [
    ['MORE_VALUE_1_1', 'MORE_VALUE_1_2', 'MORE_VALUE_1_3'],
    ['MORE_VALUE_2_1', 'MORE_VALUE_2_2', 'MORE_VALUE_2_3'],
    ['MORE_VALUE_3_1', 'MORE_VALUE_3_2', 'MORE_VALUE_3_3'],
  ]

  range.replaceData(newValues);

  expect(range.range.getRow()).toEqual(4);
  expect(range.range.getColumn()).toEqual(5);
  expect(range.range.getNumRows()).toEqual(3);
  expect(range.range.getNumColumns()).toEqual(3);

})

test('getDataAsObjects', () => {
  let range = new CoverSheets.Range({
    sheetName: "Some Sheet",
    row: 1, column: 1, numRows: 4, numColumns: 4, 
    headerType:"RowBased", headerSize: 1
  })

  range.range.fillDefaultData();

  let objects = range.getDataAsObjects();
  expect(objects.length).toEqual(3);
  expect(objects[0]).toMatchObject(
    {
      "VALUE_1_1":"VALUE_2_1",
      "VALUE_1_2":"VALUE_2_2",
      "VALUE_1_3":"VALUE_2_3",
      "VALUE_1_4":"VALUE_2_4"
    }
  )
  expect(objects[1]).toMatchObject(
    {
      "VALUE_1_1":"VALUE_3_1",
      "VALUE_1_2":"VALUE_3_2",
      "VALUE_1_3":"VALUE_3_3",
      "VALUE_1_4":"VALUE_3_4"
    }
  )

  expect(objects[2]).toMatchObject(
    {
      "VALUE_1_1":"VALUE_4_1",
      "VALUE_1_2":"VALUE_4_2",
      "VALUE_1_3":"VALUE_4_3",
      "VALUE_1_4":"VALUE_4_4"
    }
  )

  // TODO: Test columnbased header range as well
})

test('Add data', () => {
  let range = new CoverSheets.Range({
    sheetName: "Some Sheet",
    row: 1, column: 1, numRows: 2, numColumns: 4, 
    headerType:"RowBased", headerSize: 1
  })

  range.range.fillDefaultData();

  let values = range.getValues(true);
  expect(values.length).toEqual(2);

  const dataToAdd = [
    ['NEW_VALUE_1_1', 'NEW_VALUE_1_2', 'NEW_VALUE_1_3', 'NEW_VALUE_1_4'],
    ['NEW_VALUE_2_1', 'NEW_VALUE_2_2', 'NEW_VALUE_2_3', 'NEW_VALUE_2_4'],
    ['NEW_VALUE_3_1', 'NEW_VALUE_3_2', 'NEW_VALUE_3_3', 'NEW_VALUE_3_4'],
    ['NEW_VALUE_4_1', 'NEW_VALUE_4_2', 'NEW_VALUE_4_3', 'NEW_VALUE_4_4'],
    ['NEW_VALUE_5_1', 'NEW_VALUE_5_2', 'NEW_VALUE_5_3', 'NEW_VALUE_5_4'],
  ];

  range.addData(dataToAdd)

  const rangeValues = range.getValues(true);
  expect(rangeValues.length).toEqual(7);
  expect(rangeValues[0].length).toEqual(4);

  expect(rangeValues).toEqual(values.concat(dataToAdd));
})

test('Add data as objects', () => {
  let range = new CoverSheets.Range({
    sheetName: "Some Sheet",
    row: 1, column: 1, numRows: 2, numColumns: 4, 
    headerType:"RowBased", headerSize: 1
  })

  range.range.fillDefaultData();

  let values = range.getValues();
  expect(values.length).toEqual(1);

  const objectsToAdd = [
    {
      "VALUE_1_1":"Addded_VALUE_3_1",
      "VALUE_1_2":"Addded_VALUE_3_2",
      "VALUE_1_3":"Addded_VALUE_3_3",
      "VALUE_1_4":"Addded_VALUE_3_4"
    },
    {
      "VALUE_1_1":"Addded_VALUE_4_1",
      "VALUE_1_2":"Addded_VALUE_4_2",
      "VALUE_1_3":"Addded_VALUE_4_3",
      "VALUE_1_4":"Addded_VALUE_4_4"
    },
    {
      "VALUE_1_1":"Addded_VALUE_5_1",
      "VALUE_1_2":"Addded_VALUE_5_2",
      "VALUE_1_3":"Addded_VALUE_5_3",
      "VALUE_1_4":"Addded_VALUE_5_4"
    },
  ]
  /*
  range.addObjects(objectsToAdd);

  values = range.getValues();
  expect(values.length).toEqual(4);
*/
})
