
test('getHeaders and getValues', () => {
  const options = {
    numRows: 4,
    numColumns: 4,
    headerType: "RowBased",
    headerSize: 1
  }

  const data = DataStubber.getData(options)
  const builder = new CoverSheets.RangeDataBuilder(data, "RowBased",  1);
  
  const headers = builder.getHeaders(); 
  expect(headers).toEqual(['HEADER_1_1', 'HEADER_1_2', 'HEADER_1_3', 'HEADER_1_4']);
  let values = builder.getValues();

  expect(values).toEqual(
    [
      [ 'VALUE_2_1', 'VALUE_2_2', 'VALUE_2_3', 'VALUE_2_4' ],
      [ 'VALUE_3_1', 'VALUE_3_2', 'VALUE_3_3', 'VALUE_3_4' ],
      [ 'VALUE_4_1', 'VALUE_4_2', 'VALUE_4_3', 'VALUE_4_4' ]
    ]
  );
})

test('getDataAsObjects', () => {
  const options = {
    numRows: 4,
    numColumns: 4,
    headerType: "RowBased",
    headerSize: 1
  }
  const data = DataStubber.getData(options)
  const builder = new CoverSheets.RangeDataBuilder(data, "RowBased",  1);

  const objects = builder.getDataAsObjects();
  expect(objects.length).toEqual(3)
  objects.forEach((o, i) => {
    expect(o).toMatchObject(
      {
        "HEADER_1_1":`VALUE_${i+2}_1`,
        "HEADER_1_2":`VALUE_${i+2}_2`,
        "HEADER_1_3":`VALUE_${i+2}_3`,
        "HEADER_1_4":`VALUE_${i+2}_4`
      }
    )
  })
});

test('addData', () => {
  const originalRows = 4;
  const headerSize = 1;

  let options = {
    numRows: originalRows,
    numColumns: 4,
    headerType: "RowBased",
    headerSize: headerSize
  }
  const data = DataStubber.getData(options)
  const builder = new CoverSheets.RangeDataBuilder(data, "RowBased",  1);

  options = {
    numRows: 3,
    numColumns: 4,
    rowOffset: 4,
    modifier: v => `ADDED_${v}`
  }
  const newData = DataStubber.getData(options);
  
  builder.addData(newData);

  const objects = builder.getDataAsObjects();
  expect(objects.length).toEqual(6)

  objects.slice(0, originalRows - 1).forEach((o, i) => {
    expect(o).toMatchObject(
      {
        "HEADER_1_1":`VALUE_${i+2}_1`,
        "HEADER_1_2":`VALUE_${i+2}_2`,
        "HEADER_1_3":`VALUE_${i+2}_3`,
        "HEADER_1_4":`VALUE_${i+2}_4`
      }
    )
  })

  objects.slice(originalRows).forEach((o, i) => {
    expect(o).toMatchObject(
      {
        "HEADER_1_1":`ADDED_VALUE_${i+originalRows+2}_1`,
        "HEADER_1_2":`ADDED_VALUE_${i+originalRows+2}_2`,
        "HEADER_1_3":`ADDED_VALUE_${i+originalRows+2}_3`,
        "HEADER_1_4":`ADDED_VALUE_${i+originalRows+2}_4`
      }
    )
  })

})

test('insertObjects', () => {
  const options = {
    numRows: 4,
    numColumns: 4,
    headerType: "RowBased",
    headerSize: 1
  }

  const data = DataStubber.getData(options)
  const builder = new CoverSheets.RangeDataBuilder(data, "RowBased",  1);
  
  const headers = builder.getHeaders(); 
  expect(headers).toEqual(['HEADER_1_1', 'HEADER_1_2', 'HEADER_1_3', 'HEADER_1_4']);
  
  let values = builder.getValues();

  expect(values).toEqual(
    [
      [ 'VALUE_2_1', 'VALUE_2_2', 'VALUE_2_3', 'VALUE_2_4' ],
      [ 'VALUE_3_1', 'VALUE_3_2', 'VALUE_3_3', 'VALUE_3_4' ],
      [ 'VALUE_4_1', 'VALUE_4_2', 'VALUE_4_3', 'VALUE_4_4' ]
    ]
  );

  // expect(range.getValuesByHeader("HEADER_1_1")).toEqual(['VALUE_2_1', 'VALUE_3_1', 'VALUE_4_1']);
  // expect(range.getValuesByHeader("HEADER_1_3")).toEqual(['VALUE_2_3', 'VALUE_3_3', 'VALUE_4_3']);

  let objectsToAdd = [
    {
      [headers[0]]: 'VALUE_5_1',
      [headers[1]]: 'VALUE_5_2',
      [headers[2]]: 'VALUE_5_3',
      [headers[3]]: 'VALUE_5_4',
    }
  ];

  builder.insertObjects(item => item[headers[0]] === 'VALUE_3_1',
    objectsToAdd);

  expect(builder.getValues()).toEqual(
    [
      [ 'VALUE_2_1', 'VALUE_2_2', 'VALUE_2_3', 'VALUE_2_4' ],
      [ 'VALUE_3_1', 'VALUE_3_2', 'VALUE_3_3', 'VALUE_3_4' ],
      [ 'VALUE_5_1', 'VALUE_5_2', 'VALUE_5_3', 'VALUE_5_4' ],
      [ 'VALUE_4_1', 'VALUE_4_2', 'VALUE_4_3', 'VALUE_4_4' ]
    ]
  );

  objectsToAdd = [
    {
      [headers[0]]: 'VALUE_6_1',
      [headers[1]]: 'VALUE_6_2',
      [headers[2]]: 'VALUE_6_3',
      [headers[3]]: 'VALUE_6_4',
    }
  ];

  builder.insertObjects(item => item[headers[0]] === 'VALUE_5_1',
    objectsToAdd, false);

  expect(builder.getValues()).toEqual(
    [
      [ 'VALUE_2_1', 'VALUE_2_2', 'VALUE_2_3', 'VALUE_2_4' ],
      [ 'VALUE_3_1', 'VALUE_3_2', 'VALUE_3_3', 'VALUE_3_4' ],
      [ 'VALUE_6_1', 'VALUE_6_2', 'VALUE_6_3', 'VALUE_6_4' ],
      [ 'VALUE_5_1', 'VALUE_5_2', 'VALUE_5_3', 'VALUE_5_4' ],
      [ 'VALUE_4_1', 'VALUE_4_2', 'VALUE_4_3', 'VALUE_4_4' ]
    ]
  );
})

test("updateObjects", () => {
  const options = {
    numRows: 4,
    numColumns: 4,
    headerType: "RowBased",
    headerSize: 1
  }

  const data = DataStubber.getData(options)
  const builder = new CoverSheets.RangeDataBuilder(data, "RowBased",  1);
  
  const headers = builder.getHeaders(); 
  expect(headers).toEqual(['HEADER_1_1', 'HEADER_1_2', 'HEADER_1_3', 'HEADER_1_4']);
  
  let values = builder.getValues();

  expect(values).toEqual(
    [
      [ 'VALUE_2_1', 'VALUE_2_2', 'VALUE_2_3', 'VALUE_2_4' ],
      [ 'VALUE_3_1', 'VALUE_3_2', 'VALUE_3_3', 'VALUE_3_4' ],
      [ 'VALUE_4_1', 'VALUE_4_2', 'VALUE_4_3', 'VALUE_4_4' ]
    ]
  );
  
  objectsToAddOrUpdate = [
    {
      [headers[0]]: 'VALUE_3_1',
      [headers[1]]: 'VALUE_3_2',
      [headers[2]]: 'VALUE_3_3_UPDATED',
      [headers[3]]: 'VALUE_3_4_UPDATED',
    },
    {
      [headers[0]]: 'VALUE_4_1',
      [headers[1]]: 'VALUE_4_2',
      [headers[2]]: 'VALUE_4_3_UPDATED',
      [headers[3]]: 'VALUE_4_4_UPDATED',
    },
    {
      [headers[0]]: 'VALUE_5_1',
      [headers[1]]: 'VALUE_5_2',
      [headers[2]]: 'VALUE_5_3',
      [headers[3]]: 'VALUE_5_4',
    }
  ];

  const matcher = (existingItem, newItem) => {
    return existingItem[headers[0]] === newItem[headers[0]] &&
    existingItem[headers[1]] === newItem[headers[1]]
  }

  builder.updateObjects(matcher, objectsToAddOrUpdate);
  values = builder.getValues(); 
  expect(values.length).toBe(4);

  expect(values).toEqual(
    [
      [ 'VALUE_2_1', 'VALUE_2_2', 'VALUE_2_3', 'VALUE_2_4' ],
      [ 'VALUE_3_1', 'VALUE_3_2', 'VALUE_3_3_UPDATED', 'VALUE_3_4_UPDATED' ],
      [ 'VALUE_4_1', 'VALUE_4_2', 'VALUE_4_3_UPDATED', 'VALUE_4_4_UPDATED' ],
      [ 'VALUE_5_1', 'VALUE_5_2', 'VALUE_5_3', 'VALUE_5_4' ],
    ]
  );
})
