/// <reference path="./Range.ts" />

namespace CoverSheets {

  export class NamedRange extends Range {

    rangeName: string;

    constructor(rangeName: string, headerType:HeaderType = "None", headerSize:number = 1) {
      const range = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(rangeName) ?? undefined;
      
      super({range:range, headerType: headerType, headerSize: headerSize});
      
      this.rangeName = rangeName;
    }
  }
}