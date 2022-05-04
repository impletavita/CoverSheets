"use strict";
var CoverSheets;
(function (CoverSheets) {
    class Range {
        constructor(params) {
            this.rangeOptions = this.initParams(params);
            if (this.rangeOptions.sheetName) {
                this.rangeOptions.worksheet = new CoverSheets.Spreadsheet().getSheetByName(this.rangeOptions.sheetName);
            }
            this.range = this.rangeOptions.worksheet.getRange(this.rangeOptions.row, this.rangeOptions.column, this.rangeOptions.numRows, this.rangeOptions.numColumns);
        }
        initParams(params) {
            const worksheet = CoverSheets.Spreadsheet.getActiveWorksheet();
            console.log(`Sheet Name: ${typeof worksheet.sheet}`);
            const defaults = {
                worksheet: worksheet,
                sheetName: worksheet.sheet.getName(),
                row: 1,
                column: 1,
                numRows: 1,
                numColumns: 1,
                headerType: "None",
                headerSize: 1
            };
            if (params === null || params === void 0 ? void 0 : params.worksheet) {
                params.sheetName = params.worksheet.sheet.getName();
            }
            else if (params === null || params === void 0 ? void 0 : params.sheetName) {
                params.worksheet = new CoverSheets.Spreadsheet().getSheetByName(params.sheetName);
            }
            const retVal = Object.assign(Object.assign({}, defaults), params);
            return retVal;
        }
        getHeaders() {
            const values = this.range.getValues();
            const coaleseHeaders = (headers) => {
                headers.forEach(d => d.slice(1).forEach((dd, i) => d[i + 1] = (dd === '' ? d[i] : dd)));
                return headers.reduce((r, a) => a.map((b, i) => { var _a; return ((_a = r[i]) !== null && _a !== void 0 ? _a : '') + b; }), []);
            };
            switch (this.rangeOptions.headerType) {
                case "RowBased":
                    return coaleseHeaders(values.slice(0, this.rangeOptions.headerSize));
                case "ColumnBased":
                    let headerData = values.map(v => v.slice(0, this.rangeOptions.headerSize));
                    headerData = CoverSheets.Utils.transpose(headerData);
                    return coaleseHeaders(headerData);
                default:
                    return [];
            }
        }
        /**
         * For the specified header, return all the values as an array
         * @param header the name of the header
         */
        getValuesByHeader(header) {
            let valuesByHeader = [];
            const headers = this.getHeaders();
            const headerIndex = headers.indexOf(header);
            const values = this.range.getValues().slice(this.rangeOptions.headerSize);
            if (headerIndex > -1) {
                valuesByHeader = values.map(v => v[headerIndex]);
            }
            return valuesByHeader;
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
                CoverSheets.Utils.showError(`Missing worksheet named ${source}`);
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
    class Utils {
        static showError(message) {
            SpreadsheetApp.getUi()
                .showModalDialog(HtmlService.createHtmlOutput(message), 'An error occurred');
        }
        static log(message, logType = "Default", key = "Logdata") {
            const addPropertyLog = () => {
                var _a, _b;
                const properties = Utils.getProperties(logType);
                const logs = (_b = (_a = properties.getProperty(key)) === null || _a === void 0 ? void 0 : _a.split(",")) !== null && _b !== void 0 ? _b : [];
                logs.unshift(message);
                properties.setProperty(key, logs.join());
            };
            const logger = {
                Default: () => Logger.log(message),
                Toast: () => Utils.toast(message, key),
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
            const properties = Utils.getProperties(propType);
            return properties.getProperty(key);
        }
        static transpose(array) {
            return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
        }
    }
    CoverSheets.Utils = Utils;
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
var Range = CoverSheets.Range;
var Spreadsheet = CoverSheets.Spreadsheet;
var Utils = CoverSheets.Utils;
var Worksheet = CoverSheets.Worksheet;
var exports = exports || {};
exports.Range = CoverSheets.Range;
exports.Spreadsheet = CoverSheets.Spreadsheet;
exports.Utils = CoverSheets.Utils;
exports.Worksheet = CoverSheets.Worksheet;
