namespace CoverSheets {
  export type PropertiesType = "User" | "Script" | "Document";
  export type LogType = "Default" | "Toast" | PropertiesType;
}

namespace CoverSheets {
  export class Utils  {
    static showError(message: string) {
      SpreadsheetApp.getUi()
        .showModalDialog(HtmlService.createHtmlOutput(message), 'An error occurred');
    }

    static log(message: string, logType: LogType = "Default", key: string = "Logdata") {
  
      const addPropertyLog = () => {
        const properties = Utils.getProperties(logType as PropertiesType);
        const logs = properties.getProperty(key)?.split(",") ?? [];
        logs.unshift(message);
        properties.setProperty(key, logs.join());
      }

      const logger = {
        Default: () => Logger.log(message),
        Toast: () => Utils.toast(message, key),
        User: () => addPropertyLog(),
        Script: () => addPropertyLog(),
        Document: () => addPropertyLog()
      }
      logger[logType]();
    }

    static getProperties(propType: PropertiesType) {
      switch(propType) {
        case "User":
          return PropertiesService.getUserProperties();
        case "Document":
          return PropertiesService.getDocumentProperties();
        case "Script":
          return PropertiesService.getScriptProperties();
      }
    }

    /**
     * Displays a "Toast" message on the bottom left
     * @param message message to display.
     * @param title Optional title; default is empty
     * @param timeout Option timeout; default is 5 seconds
     */
    static toast(message: string, title: string = "", timeout:number = 5) {
      SpreadsheetApp.getActiveSpreadsheet().toast(message, title, timeout);
    }

    static getProperty(propType: PropertiesType, key: string) {
      const properties = Utils.getProperties(propType);
      return properties.getProperty(key);
    }

    static transpose(array:Array<any>): [] {
        return array[0].map((_:any, colIndex:number) => array.map(row => row[colIndex]));
    }
  }
}