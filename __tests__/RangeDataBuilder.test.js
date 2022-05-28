
test('getHeaders and getValues - RowBased', () => {
  const data = DataStubber.getData(4, 4, "RowBased",  1)
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

  const objectsToAdd = [
    {
      [headers[0]]: 'VALUE_5_1',
      [headers[1]]: 'VALUE_5_2',
      [headers[2]]: 'VALUE_5_3',
      [headers[3]]: 'VALUE_5_4',
    }
  ];
})

test('getHeaders and getValues - ColumnBased', () => {
  const data = DataStubber.getData(4, 4, "ColumnBased",  1)
  const builder = new CoverSheets.RangeDataBuilder(data, "ColumnBased",  1);
  
  const headers = builder.getHeaders(); 
  expect(headers).toEqual(['HEADER_1_1', 'HEADER_2_1', 'HEADER_3_1', 'HEADER_4_1']);
  let values = builder.getValues();

  expect(values).toEqual(
    [
      [ 'VALUE_1_2', 'VALUE_1_3', 'VALUE_1_4' ],
      [ 'VALUE_2_2', 'VALUE_2_3', 'VALUE_2_4' ],
      [ 'VALUE_3_2', 'VALUE_3_3', 'VALUE_3_4' ],
      [ 'VALUE_4_2', 'VALUE_4_3', 'VALUE_4_4' ],
    ]
  );

  // expect(range.getValuesByHeader("HEADER_1_1")).toEqual(['VALUE_2_1', 'VALUE_3_1', 'VALUE_4_1']);
  // expect(range.getValuesByHeader("HEADER_1_3")).toEqual(['VALUE_2_3', 'VALUE_3_3', 'VALUE_4_3']);

  const objectsToAdd = [
    {
      [headers[0]]: 'VALUE_1_5',
      [headers[1]]: 'VALUE_2_5',
      [headers[2]]: 'VALUE_3_5',
      [headers[3]]: 'VALUE_4_5',
    }
  ];
})
