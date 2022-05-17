const exp = require('constants');
const CoverSheets =  require('../dist/CoverSheets');

test('getRangeByName', () => {
  const worksheetName = 'Work Sheet With Spaces';
  const rangeName = 'SecondNamedRange'
  const worksheet = new CoverSheets.Worksheet(worksheetName);
  const namedRange = worksheet.getRangeByName(rangeName);


  expect(namedRange.rangeName).toBe(`'${worksheetName}'!${rangeName}`);
});
