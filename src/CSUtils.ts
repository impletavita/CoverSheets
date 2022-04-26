namespace CoverSheets {
  export type propertiesType = "User" | "Script" | "Document";
  export type logType = "Default" | "Toast" | propertiesType;
}

namespace CoverSheets {
  export class CSUtils  {
    static showError(message: string) {
      SpreadsheetApp.getUi()
        .showModalDialog(HtmlService.createHtmlOutput(message), 'An error occurred');
    }

    static log(message: string, logType: logType = "Default", key: string = "Logdata") {
  
      const addPropertyLog = () => {
        const properties = CSUtils.getProperties(logType as propertiesType);
        const logs = properties.getProperty(key)?.split(",") ?? [];
        logs.unshift(message);
        properties.setProperty(key, logs.join());
      }

      const logger = {
        Default: () => Logger.log(message),
        Toast: () => CSUtils.toast(message, key),
        User: () => addPropertyLog(),
        Script: () => addPropertyLog(),
        Document: () => addPropertyLog()
      }
      logger[logType]();
    }

    static getProperties(propType: propertiesType) {
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

    static getProperty(propType: propertiesType, key: string) {
      const properties = CSUtils.getProperties(propType);
      return properties.getProperty(key);
    }
  }
}