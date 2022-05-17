const CoverSheets =  require('../dist/CoverSheets');

test('NamedRange with one row of headers', () => {
  const range = new CoverSheets.NamedRange('FirstNamedRange', "RowBased");
  
  range.range.fillDefaultData();
  
  expect(range.getHeaders()).toEqual([ 'VALUE_1_1', 'VALUE_1_2', 'VALUE_1_3', 'VALUE_1_4' ]);
  const values = range.getValues();
  expect(values.length).toEqual(3);
  expect(range.getValuesByHeader("VALUE_1_1")).toEqual(['VALUE_2_1', 'VALUE_3_1', 'VALUE_4_1']);
  expect(range.getValuesByHeader("VALUE_1_3")).toEqual(['VALUE_2_3', 'VALUE_3_3', 'VALUE_4_3']);
})

// TODO: Duplicate tests from Range.RowBased.test and Range.ColumnBased.test as well.