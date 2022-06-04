const CoverSheets =  require('../dist/CoverSheets');
const { Spreadsheet } = require("../dist/CoverSheets");

test("removeAllGroups", () => {
    const mockBatchUpdate = jest.fn((removeRequests, id) => {
        expect(removeRequests).toMatchObject( 
            {requests:[
                {deleteDimensionGroup: {
                    range:{sheetId:0,dimension:"ROWS"}}
                },
                {deleteDimensionGroup: {
                    range:{sheetId:0,dimension:"ROWS"}}
                },
                {deleteDimensionGroup: {
                    range:{sheetId:38888447,dimension:"ROWS"}}
                }
            ]}
        )
    })
    Sheets.Spreadsheets.batchUpdate = mockBatchUpdate;

    CoverSheets.Spreadsheet.removeAllGroups();
})