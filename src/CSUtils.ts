namespace CoverSheets {
  export class CSUtils  {
    static showError(message: string) {
      SpreadsheetApp.getUi()
        .showModalDialog(HtmlService.createHtmlOutput(message), 'An error occurred');
    }
  }
}