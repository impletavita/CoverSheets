/// <reference path="./Range.ts" />

namespace CoverSheets {

  export class NamedRange extends Range {

    rangeName: string;
    namedRange?: GoogleAppsScript.Spreadsheet.NamedRange;

    constructor(rangeName: string, headerType:HeaderType = "None", headerSize:number = 1) {
      const namedRange = NamedRange.getNamedRange(rangeName);

      super({range:namedRange?.getRange(), headerType: headerType, headerSize: headerSize});
      
      this.rangeName = rangeName;
      this.namedRange = namedRange;

    }

    static getNamedRange(rangeName: string): GoogleAppsScript.Spreadsheet.NamedRange | undefined {
      const namedRanges = SpreadsheetApp.getActiveSpreadsheet().getNamedRanges();

      // see if there's at least one range that matches the specified rangeName
      let namedRange = namedRanges.find(nr => nr.getName() === rangeName);
      if (namedRange) {
        return namedRange;
      }

      // Handle scenario where named range does not follow <worksheetname>!<rangename> format.
      const rangeNameParts = rangeName.split('!');
      if (rangeNameParts.length == 2) {
        const worksheetName = rangeNameParts[0].replace(/["']/, '');

        namedRange = namedRanges.find(nr => nr.getName() === rangeNameParts[1]);

        if (namedRange && namedRange.getRange().getSheet().getName() === worksheetName) {
          return namedRange;
        } else {
          namedRange = undefined;
        }
      }

      return namedRange;
    }

    replaceData(data:any[], preserveHeaders=false): GoogleAppsScript.Spreadsheet.Range {
      this.range = super.replaceData(data, preserveHeaders);
      this.namedRange?.setRange(this.range);
      return this.range;
    }
  }
}