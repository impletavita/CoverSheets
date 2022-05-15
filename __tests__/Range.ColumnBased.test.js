const CoverSheets =  require('../dist/CoverSheets');

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

test('getDataAsObjects ColumnBased', () => {
  let range = new CoverSheets.Range({
    sheetName: "Some Sheet",
    row: 1, column: 1, numRows: 4, numColumns: 4, 
    headerType:"ColumnBased", headerSize: 1
  })

  range.range.fillDefaultData();

  let objects = range.getDataAsObjects();
  expect(objects.length).toEqual(3);
  
  expect(objects[0]).toMatchObject(
    {
      "VALUE_1_1":"VALUE_1_2",
      "VALUE_2_1":"VALUE_2_2",
      "VALUE_3_1":"VALUE_3_2",
      "VALUE_4_1":"VALUE_4_2"
    }
  )
  expect(objects[1]).toMatchObject(
    {
      "VALUE_1_1":"VALUE_1_3",
      "VALUE_2_1":"VALUE_2_3",
      "VALUE_3_1":"VALUE_3_3",
      "VALUE_4_1":"VALUE_4_3"
    }
  )

  expect(objects[2]).toMatchObject(
    {
      "VALUE_1_1":"VALUE_1_4",
      "VALUE_2_1":"VALUE_2_4",
      "VALUE_3_1":"VALUE_3_4",
      "VALUE_4_1":"VALUE_4_4"
    }
  )
})

test('replaceData ColumnBased', () => {
  const range = new CoverSheets.Range({
    sheetName: 'Some Sheet',
    row: 4, column: 5, numRows: 3, numColumns: 2,
    headerType: "ColumnBased"
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

test('Add data - ColumnBased', () => {
  let range = new CoverSheets.Range({
    sheetName: "Some Sheet",
    row: 1, column: 1, numRows: 2, numColumns: 4, 
    headerType:"ColumnBased", headerSize: 1
  })

  range.range.fillDefaultData();

  let values = range.getValues(true);
  expect(values.length).toEqual(2);
  expect(values[0].length)
  const dataToAdd = [
    ['NEW_VALUE_1_1', 'NEW_VALUE_1_2', 'NEW_VALUE_1_3', 'NEW_VALUE_1_4'],
    ['NEW_VALUE_2_1', 'NEW_VALUE_2_2', 'NEW_VALUE_2_3', 'NEW_VALUE_2_4'],
  ];

  range.addData(dataToAdd)

  const rangeValues = range.getValues(true);
  expect(rangeValues.length).toEqual(2);
  expect(rangeValues[0].length).toEqual(8);

  const expectedData = values.map((v,i) => v.concat(dataToAdd[i]));
  expect(rangeValues).toEqual(expectedData);
})

test('Add data as objects - ColumnBased', () => {
  let range = new CoverSheets.Range({
    sheetName: "Some Sheet",
    row: 1, column: 1, numRows: 2, numColumns: 4, 
    headerType:"ColumnBased", headerSize: 1
  })

  range.range.fillDefaultData();

  let values = range.getValues();
  expect(values.length).toEqual(2);

  const objectsToAdd = [
    {
      "VALUE_1_1":"Addded_VALUE_1_5",
      "VALUE_2_1":"Addded_VALUE_2_5",
    },
    {
      "VALUE_1_1":"Addded_VALUE_1_6",
      "VALUE_2_1":"Addded_VALUE_2_6",
    },
    {
      "VALUE_1_1":"Addded_VALUE_1_7",
      "VALUE_2_1":"Addded_VALUE_2_7",
    },
  ]

  range.addObjects(objectsToAdd);
  
  values = range.getValues();
  expect(values.length).toEqual(2);
  
  expect(values).toEqual([
    [
      'VALUE_1_2',
      'VALUE_1_3',
      'VALUE_1_4',
      'Addded_VALUE_1_5',
      'Addded_VALUE_1_6',
      'Addded_VALUE_1_7'
    ],
    [
      'VALUE_2_2',
      'VALUE_2_3',
      'VALUE_2_4',
      'Addded_VALUE_2_5',
      'Addded_VALUE_2_6',
      'Addded_VALUE_2_7'
    ]
  ]);

  const objectsAfterAdd = range.getDataAsObjects();
  expect(objectsAfterAdd.length).toEqual(6);

  expect(objectsAfterAdd[0]).toMatchObject(
    {
      "VALUE_1_1":"VALUE_1_2",
      "VALUE_2_1":"VALUE_2_2", 
    }
  )
  expect(objectsAfterAdd[1]).toMatchObject(
    {
      "VALUE_1_1":"VALUE_1_3",
      "VALUE_2_1":"VALUE_2_3", 
    }
  )
  expect(objectsAfterAdd[2]).toMatchObject(
    {
      "VALUE_1_1":"VALUE_1_4",
      "VALUE_2_1":"VALUE_2_4", 
    }
  )
  expect(objectsAfterAdd[3]).toMatchObject(
    {
      "VALUE_1_1":"Addded_VALUE_1_5",
      "VALUE_2_1":"Addded_VALUE_2_5", 
    }
  )
  expect(objectsAfterAdd[4]).toMatchObject(
    {
      "VALUE_1_1":"Addded_VALUE_1_6",
      "VALUE_2_1":"Addded_VALUE_2_6", 
    }
  )
  expect(objectsAfterAdd[5]).toMatchObject(
    {
      "VALUE_1_1":"Addded_VALUE_1_7",
      "VALUE_2_1":"Addded_VALUE_2_7", 
    }
  )
})