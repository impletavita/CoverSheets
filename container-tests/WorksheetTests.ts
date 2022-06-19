/// <reference path="../dist/CoverSheets.d.ts" />

function addGroups() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Groups");
  if (!sheet) {
    CoverSheets.Utils.toast(`Sheet named "Groups" not found`);
    return;
  }

  const tree:CoverSheets.TreeNode<{name:string}>[] = [
    {name:"Saga 2"},
    {name:"Saga 3"},    
    {
      name: "Saga 1",
      children: [
        {name: "Epic 1-4"},
        {
          name: "Epic 1-1",
          children: [
            {name: "Story-1-1-1"},
            {name: "Story-1-1-2"},
            {name: "Story-1-1-3"},
          ]
        },
        {
          name: "Epic 1-2"
        },
        {
          name: "Epic 1-3"
        }
      ]
    }
  ]
  
  const sheetId = sheet.getSheetId();
  const groupData:CoverSheets.AddGroupInfo[] = CoverSheets.RowGroup.getGroupData(tree, 9)
    .map(g => {
      const addGroup = g as CoverSheets.AddGroupInfo;
      addGroup.sheetId = sheetId;
      addGroup.dimension = "ROWS";
      return addGroup;
    })
  
  CoverSheets.Spreadsheet.addGroups(groupData);
}

function removeAllGroups() {
  CoverSheets.Spreadsheet.removeAllGroups();
}

function testRangeWithOneHeaderColumn() {
  const range = new CoverSheets.NamedRange("MySheet!RangeWithOneHeaderColumn", 
  "ColumnBased");
  const values = range.getValues(false);

  if (values?.length > 2) {
    values[2][2] += " Updated ";
    range.replaceData(values, true);
  } else {
    values.push([],[],[],[])
  }
  
  values[0].push("H1 Value 4", "H1 Value 5", "H1 Value 6");
  values[1].push("H2 Value 4", "H2 Value 5", "H2 Value 6");
  values[2].push("H3 Value 4", "H3 Value 5", "H3 Value 6");
  values[3].push("H4 Value 4", "H4 Value 5", "H4 Value 6");
  
  range.replaceData(values, true);
}

function testNamedRangeOneHeaderRow() {
  const range = new CoverSheets.NamedRange("MySheet!RangeWithOneHeaderRow", "RowBased");
  
  const values = range.getValues(false);

  if (values?.length > 2) {
    values[2][3] += " Updated ";

    range.replaceData(values, true);
  }

  values.push(
    ["H1 Value 4", "H2 Value 4", "H3 Value 4", "H4 Value 4"],
    ["H1 Value 5", "H2 Value 5", "H3 Value 5", "H4 Value 5"],
    ["H1 Value 6", "H2 Value 6", "H3 Value 6", "H4 Value 6"],
    )
    range.replaceData(values, true);

}

function rangeHeaders() {
    
  let range = new CoverSheets.Range({ 
    sheetName: "Test Sheet", 
    row: 1,
    numRows: 7, 
    numColumns: 4, 
    headerType: "RowBased",
    headerSize: 4
  });

  logData(range);
  
  range = new CoverSheets.Range({ 
    sheetName: "Test Sheet", 
    row: 10,
    numRows: 4, 
    numColumns: 4, 
    headerType: "RowBased"
  });
  
  logData(range);

  range = new CoverSheets.Range({
      sheetName: "Test Sheet",
      row: 17,
      numRows: 4,
      numColumns: 6,
      headerType: "ColumnBased", 
      headerSize: 3
  });
  
  logData(range);
}

function logData(range) {
  const headers = range.getHeaders();
  Logger.log(`Headers: ${headers}`);
  Logger.log(`Values: ${range.getValuesByHeader(headers[0])}`);
}

function constructorParameterCannotBeNull() {
  try {
    const newWorksheet = new CoverSheets.Worksheet("DoesNotExist");
  } catch(e) {
    CoverSheets.Utils.log(e as string, "Toast");
  }

  Logger.log(CoverSheets.Utils.getProperty("User", "Logdata"));
}

function newWorksheet() {
  const newWorksheet = new CoverSheets.Worksheet("Test Sheet");
  Logger.log(newWorksheet.sheet.getName());
}
