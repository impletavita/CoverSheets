"use strict";
var CoverSheets;
(function (CoverSheets) {
    class CSUtils {
        static showError(message) {
            SpreadsheetApp.getUi()
                .showModalDialog(HtmlService.createHtmlOutput(message), 'An error occurred');
        }
        static log(message, logType = "Default", key = "Logdata") {
            const addPropertyLog = () => {
                var _a, _b;
                const properties = CSUtils.getProperties(logType);
                const logs = (_b = (_a = properties.getProperty(key)) === null || _a === void 0 ? void 0 : _a.split(",")) !== null && _b !== void 0 ? _b : [];
                logs.unshift(message);
                properties.setProperty(key, logs.join());
            };
            const logger = {
                Default: () => Logger.log(message),
                Toast: () => CSUtils.toast(message, key),
                User: () => addPropertyLog(),
                Script: () => addPropertyLog(),
                Document: () => addPropertyLog()
            };
            logger[logType]();
        }
        static getProperties(propType) {
            switch (propType) {
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
        static toast(message, title = "", timeout = 5) {
            SpreadsheetApp.getActiveSpreadsheet().toast(message, title, timeout);
        }
        static getProperty(propType, key) {
            const properties = CSUtils.getProperties(propType);
            return properties.getProperty(key);
        }
    }
    CoverSheets.CSUtils = CSUtils;
})(CoverSheets || (CoverSheets = {}));
var CoverSheets;
(function (CoverSheets) {
    class Range {
        constructor(params) {
            var _a, _b, _c, _d, _e;
            if (params === null || params === void 0 ? void 0 : params.sheetName) {
                this.sheetName = params.sheetName;
                this.worksheet = new CoverSheets.Spreadsheet().getSheetByName(this.sheetName);
            }
            else {
                this.worksheet = CoverSheets.Spreadsheet.getActiveWorksheet();
                this.sheetName = this.worksheet.sheet.getName();
            }
            this.row = (_a = params === null || params === void 0 ? void 0 : params.row) !== null && _a !== void 0 ? _a : 1;
            this.column = (_b = params === null || params === void 0 ? void 0 : params.column) !== null && _b !== void 0 ? _b : 1;
            this.numRows = (_c = params === null || params === void 0 ? void 0 : params.numRows) !== null && _c !== void 0 ? _c : 1;
            this.numColumns = (_d = params === null || params === void 0 ? void 0 : params.numColumns) !== null && _d !== void 0 ? _d : 1;
            this.headerInfo = (_e = params === null || params === void 0 ? void 0 : params.headerInfo) !== null && _e !== void 0 ? _e : { type: "None", headerSize: 1 };
            this.range = this.worksheet.getRange(this.row, this.column, this.numRows, this.numColumns);
        }
        getHeaders() {
            const values = this.range.getValues();
            switch (this.headerInfo.type) {
                case "RowBased":
                    return values.slice(0, this.headerInfo.headerSize);
                case "ColumnBased":
                    return values.map(v => v.slice(0, this.headerInfo.headerSize));
                default:
                    return [];
            }
        }
    }
    CoverSheets.Range = Range;
})(CoverSheets || (CoverSheets = {}));
var CoverSheets;
(function (CoverSheets) {
    class Spreadsheet {
        constructor(spreadsheet) {
            if (!spreadsheet) {
                spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
            }
            this.spreadsheet = spreadsheet;
        }
        static getActiveWorksheet() {
            return new CoverSheets.Worksheet(SpreadsheetApp.getActiveSheet());
        }
        /**
         * Retrieves a Worksheet of the specified name in this spreadheet.
         * @param sheetName The name of the worksheet
         * @returns Worksheet representing the worksheet of the specified name. If no
         * such worksheet is found, returns null
         */
        getSheetByName(sheetName) {
            const sheet = this.spreadsheet.getSheetByName(sheetName);
            if (!sheet) {
                // TODO
                // CSUtils.showWarning(`Worksheet named "${sheetName}" does not exist. Returning active sheet.`)
                return null;
            }
            return new CoverSheets.Worksheet(sheet);
        }
        /**
         *
         * @returns All the Worksheets in this spreadsheet.
         */
        getSheets() {
            return this.spreadsheet.getSheets().map(s => new CoverSheets.Worksheet(s));
        }
        /**
         * Adds a new worksheet of the specified name to the Spreadsheet. If a sheet of
         * the same name already exists, returns that instead.
         * @param sheetName The name of the sheet to add
         * @returns The newly added worksheet. If the sheet already exists, return that instead.
         */
        addSheet(sheetName) {
            const sheet = this.getSheetByName(sheetName);
            return sheet !== null && sheet !== void 0 ? sheet : new CoverSheets.Worksheet(this.spreadsheet.insertSheet(sheetName));
        }
        cloneWorksheet(source, destination, activate = true) {
            const activateSheet = (worksheet) => {
                if (activate) {
                    worksheet.sheet.activate();
                }
            };
            let destinationSheet = this.getSheetByName(destination);
            if (destinationSheet) {
                activateSheet(destinationSheet);
                return destinationSheet;
            }
            const sourceSheet = this.getSheetByName(source);
            if (!sourceSheet) {
                CoverSheets.CSUtils.showError(`Missing worksheet named ${source}`);
                return null;
            }
            const clonedSheet = sourceSheet.sheet.copyTo(this.spreadsheet);
            clonedSheet.setName(destination);
            destinationSheet = new CoverSheets.Worksheet(clonedSheet);
            activateSheet(destinationSheet);
            return destinationSheet;
        }
    }
    CoverSheets.Spreadsheet = Spreadsheet;
})(CoverSheets || (CoverSheets = {}));
var CoverSheets;
(function (CoverSheets) {
    class Worksheet {
        constructor(sheet) {
            if (!sheet) {
                throw new Error('Parameter sheet cannot be null');
            }
            if (typeof sheet === 'string') {
                const worksheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet);
                if (worksheet) {
                    sheet = worksheet;
                }
                else {
                    throw new Error(`No worksheet named "${sheet}" found in current spreadsheet`);
                }
            }
            this.sheet = sheet;
        }
        getRange(row, column, numRows, numColumns) {
            return this.sheet.getRange(row, column, numRows, numColumns);
        }
    }
    CoverSheets.Worksheet = Worksheet;
})(CoverSheets || (CoverSheets = {}));
function range() {
    var range = new CoverSheets.Range({ sheetName: "Test Sheet", numRows: 6, numColumns: 3, headerInfo: { type: "RowBased", headerSize: 3 } });
    Logger.log(range.getHeaders());
    range = new CoverSheets.Range({
        sheetName: "Test Sheet",
        row: 13,
        numRows: 4,
        numColumns: 6,
        headerInfo: { type: "ColumnBased", headerSize: 3 }
    });
    Logger.log(range.getHeaders());
}
function constructorParameterCannotBeNull() {
    try {
        const newWorksheet = new CoverSheets.Worksheet("DoesNotExist");
    }
    catch (e) {
        CoverSheets.CSUtils.log(e, "Toast");
    }
    Logger.log(CoverSheets.CSUtils.getProperty("User", "Logdata"));
}
function newWorksheet() {
    const newWorksheet = new CoverSheets.Worksheet("Test Sheet");
    Logger.log(newWorksheet.sheet.getName());
}
var CSUtils = CoverSheets.CSUtils;
var Range = CoverSheets.Range;
var Spreadsheet = CoverSheets.Spreadsheet;
var Worksheet = CoverSheets.Worksheet