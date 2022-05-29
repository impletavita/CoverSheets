"use strict";
var CoverSheets;
(function (CoverSheets) {
    class Range {
        constructor(params) {
            const paramsWithDefaults = this.initParams(params);
            this.headerType = paramsWithDefaults.headerType;
            this.headerSize = paramsWithDefaults.headerSize;
            this.worksheet = paramsWithDefaults.worksheet;
            if (paramsWithDefaults.range) {
                this.range = paramsWithDefaults.range;
            }
            else {
                this.range = paramsWithDefaults.worksheet.sheet.getRange(paramsWithDefaults.row, paramsWithDefaults.column, paramsWithDefaults.numRows, paramsWithDefaults.numColumns);
            }
        }
        initParams(params) {
            const worksheet = CoverSheets.Spreadsheet.getActiveWorksheet();
            const defaults = {
                range: undefined,
                worksheet: worksheet,
                sheetName: worksheet.sheet.getName(),
                row: 1,
                column: 1,
                numRows: 1,
                numColumns: 1,
                headerType: "None",
                headerSize: 0
            };
            if (params === null || params === void 0 ? void 0 : params.range) {
                params.worksheet = new CoverSheets.Worksheet(params.range.getSheet());
            }
            else if (params === null || params === void 0 ? void 0 : params.worksheet) {
                params.sheetName = params.worksheet.sheet.getName();
            }
            else if (params === null || params === void 0 ? void 0 : params.sheetName) {
                params.worksheet = new CoverSheets.Spreadsheet().getSheetByName(params.sheetName);
            }
            const retVal = Object.assign(Object.assign({}, defaults), params);
            return retVal;
        }
        getHeaders() {
            return new CoverSheets.RangeDataBuilder(this.range.getValues(), this.headerType, this.headerSize).getHeaders();
        }
        /**
         * For the specified header, return all the values as an array
         * @param header the name of the header
         */
        getValuesByHeader(header) {
            let valuesByHeader = [];
            let values = this.getValues();
            if (values.length == 0) {
                return [];
            }
            const headers = this.getHeaders();
            const headerIndex = headers.indexOf(header);
            if (headerIndex > -1) {
                if (this.headerType == "ColumnBased") {
                    valuesByHeader = values[headerIndex];
                }
                else {
                    valuesByHeader = values.map(v => v[headerIndex]);
                }
            }
            return valuesByHeader;
        }
        getValues(includeHeader = false) {
            var _a, _b;
            let values = this.range.getValues();
            if (includeHeader) {
                return values;
            }
            return (_b = (_a = this.getValuesRange().range) === null || _a === void 0 ? void 0 : _a.getValues()) !== null && _b !== void 0 ? _b : [];
        }
        getValuesRange() {
            let row = this.range.getRow();
            let column = this.range.getColumn();
            let numRows = this.range.getNumRows();
            let numColumns = this.range.getNumColumns();
            if (this.headerType == "RowBased") {
                row += this.headerSize;
                numRows -= this.headerSize;
            }
            else if (this.headerType == "ColumnBased") {
                column += this.headerSize;
                numColumns -= this.headerSize;
            }
            const valuesRange = {
                row: row,
                column: column,
                range: undefined,
            };
            if (numRows > 0 && numColumns > 0) {
                valuesRange.range = this.range.getSheet().getRange(row, column, numRows, numColumns);
            }
            return valuesRange;
        }
        /**
         * Replace the data in this range. Range will be resized as necessary.
         * @param data new data to replace with
         * @param preserveHeaders if true, replace values only
         */
        replaceData(data, preserveHeaders = false) {
            var _a;
            let oldRange = this.range;
            let row = this.range.getRow();
            let column = this.range.getColumn();
            if (preserveHeaders) {
                let valuesRange = this.getValuesRange();
                row = valuesRange.row;
                column = valuesRange.column;
                (_a = valuesRange.range) === null || _a === void 0 ? void 0 : _a.clearContent();
            }
            let sheet = this.range.getSheet();
            let numRows = data.length;
            let numColumns = data[0].length;
            let newRange = sheet.getRange(row, column, numRows, numColumns);
            newRange.setValues(data);
            if (preserveHeaders) {
                if (this.headerType === "RowBased") {
                    numRows += this.headerSize;
                }
                else if (this.headerType === "ColumnBased") {
                    numColumns += this.headerSize;
                }
            }
            newRange = sheet.getRange(oldRange.getRow(), oldRange.getColumn(), numRows, numColumns);
            this.range = newRange;
            return newRange;
        }
        /**
         * Add data to the range.
         * If the range is RowBased, new rows will be added. If it is
         * ColumnBased, new columns will be added.
         * @param data data to append to range
         */
        addData(data) {
            let oldRange = this.range;
            let newStartRow = oldRange.getRow() + oldRange.getNumRows();
            let newStartColumn = oldRange.getColumn();
            let rowsToAdd = data.length;
            let columnsToAdd = 0;
            if (this.headerType === "ColumnBased") {
                newStartRow = oldRange.getRow();
                newStartColumn += oldRange.getNumColumns();
                rowsToAdd = 0;
                columnsToAdd = data[0].length;
            }
            const addedRange = oldRange.getSheet().getRange(newStartRow, newStartColumn, data.length, data[0].length);
            addedRange.setValues(data);
            this.range = oldRange.getSheet().getRange(oldRange.getRow(), oldRange.getColumn(), oldRange.getNumRows() + rowsToAdd, oldRange.getNumColumns() + columnsToAdd);
        }
        getDataAsObjects() {
            let headers = this.getHeaders();
            let values = this.getValues();
            if (this.headerType == "ColumnBased") {
                values = CoverSheets.Utils.transpose(values);
            }
            return values.map(v => this.getVectorAsObject(v, headers));
        }
        getVectorAsObject(vector, headers) {
            const obj = {};
            headers.forEach((h, i) => {
                obj[h] = vector[i];
            });
            return obj;
        }
        addObjects(objects) {
            this.addData(this.convertObjectsToData(objects));
        }
        convertObjectsToData(objects) {
            const headers = this.getHeaders();
            let data = [];
            headers.forEach(h => {
                const values = objects.map(o => { var _a; return (_a = o[h]) !== null && _a !== void 0 ? _a : ''; });
                data.push(values);
            });
            if (this.headerType == "RowBased") {
                data = CoverSheets.Utils.transpose(data);
            }
            return data;
        }
        /**
         * Add the specified array of objects after the first object that matches
         * the specified matcher. If objects of the specfied keys already exist,
         * merge the data instead.
         */
        addObjectsAfter(matcher, objects) {
            let values = this.getDataAsObjects();
            let index = values.findIndex(v => matcher(v));
            if (index == -1) {
                this.addObjects(objects);
                return;
            }
        }
        getBuilder() {
            return new CoverSheets.RangeDataBuilder(this.range.getValues(), this.headerType, this.headerSize);
        }
        metadata(range = this.range) {
            return `row: ${range.getRow()}, col: ${range.getColumn()},` +
                `numRows: ${range.getNumRows()}, numColumns: ${range.getNumColumns()}`;
        }
    }
    CoverSheets.Range = Range;
})(CoverSheets || (CoverSheets = {}));
/// <reference path="./Range.ts" />
var CoverSheets;
(function (CoverSheets) {
    class NamedRange extends CoverSheets.Range {
        constructor(rangeName, headerType = "None", headerSize = 1) {
            const namedRange = NamedRange.getNamedRange(rangeName);
            if (!namedRange) {
                throw new Error(`Range named ${rangeName} not found!`);
            }
            super({ range: namedRange === null || namedRange === void 0 ? void 0 : namedRange.getRange(), headerType: headerType, headerSize: headerSize });
            this.rangeName = rangeName;
            this.namedRange = namedRange;
        }
        static getNamedRange(rangeName) {
            const namedRanges = SpreadsheetApp.getActiveSpreadsheet().getNamedRanges();
            // see if there's at least one range that matches the specified rangeName
            let namedRange = namedRanges.find(nr => nr.getName() === rangeName);
            if (namedRange) {
                return namedRange;
            }
            // Handle scenario where named range does not follow <worksheetname>!<rangename> format.
            const rangeNameParts = rangeName.split('!');
            if (rangeNameParts.length == 2) {
                const worksheetName = rangeNameParts[0].replace(/["']/g, '');
                const possibleNames = [rangeNameParts[1], `${worksheetName}!${rangeNameParts[1]}`];
                namedRange = namedRanges.find(nr => possibleNames.includes(nr.getName()));
                if (namedRange && namedRange.getRange().getSheet().getName() === worksheetName) {
                    return namedRange;
                }
                else {
                    namedRange = undefined;
                }
            }
            return namedRange;
        }
        replaceData(data, preserveHeaders = false) {
            var _a;
            this.range = super.replaceData(data, preserveHeaders);
            (_a = this.namedRange) === null || _a === void 0 ? void 0 : _a.setRange(this.range);
            return this.range;
        }
    }
    CoverSheets.NamedRange = NamedRange;
})(CoverSheets || (CoverSheets = {}));
var CoverSheets;
(function (CoverSheets) {
    class RangeDataBuilder {
        constructor(data, headerType, headerSize) {
            this.data = data;
            this.headerType = headerType;
            this.headerSize = headerSize;
        }
        getHeaders() {
            const coaleseHeaders = (headers) => {
                headers.forEach(d => d.slice(1).forEach((dd, i) => d[i + 1] = (dd === '' ? d[i] : dd)));
                return headers.reduce((r, a) => a.map((b, i) => { var _a; return ((_a = r[i]) !== null && _a !== void 0 ? _a : '') + b; }), []);
            };
            switch (this.headerType) {
                case "RowBased":
                    const headerRows = this.data.slice(0, this.headerSize);
                    return coaleseHeaders(headerRows);
                case "ColumnBased":
                    let headerColumns = this.data.map(v => v.slice(0, this.headerSize));
                    headerColumns = CoverSheets.Utils.transpose(headerColumns);
                    return coaleseHeaders(headerColumns);
                default:
                    return [];
            }
        }
        getDataAsObjects() {
            let headers = this.getHeaders();
            let values = this.getValues();
            if (this.headerType == "ColumnBased") {
                values = CoverSheets.Utils.transpose(values);
            }
            return values.map(v => this.getVectorAsObject(v, headers));
        }
        getVectorAsObject(vector, headers) {
            const obj = {};
            headers.forEach((h, i) => {
                obj[h] = vector[i];
            });
            return obj;
        }
        getValues() {
            let row = 0;
            let column = 0;
            let numRows = this.data.length;
            let numColumns = this.data[0].length;
            if (this.headerType == "RowBased") {
                row += this.headerSize;
            }
            else if (this.headerType == "ColumnBased") {
                column += this.headerSize;
            }
            let values = [];
            if (numRows > 0 && numColumns > 0) {
                values = this.data.slice(row, numRows).map(e => e.slice(column, numColumns + 1));
            }
            return values;
        }
        addData(data) {
            // todo: Exception when data.rows/data.columns don't match this.data.length/this.data[0].length
            // todo: Add ablity to modify data to current structure or modify structure to match new data 
            if (this.headerType === "ColumnBased") {
                for (let row = 0; row < this.data.length; row++) {
                    this.data[row] = this.data[row].concat(data[row]);
                }
            }
            else {
                for (let row = 0; row < data.length; row++) {
                    this.data.push(data[row]);
                }
            }
        }
        /**
         * Add the specified array of objects after the first object that matches
         * the specified matcher. If objects of the specfied keys already exist,
         * merge the data instead.
         */
        insertObjects(matcher, objects, after = true) {
            let values = this.getDataAsObjects();
            let index = values.findIndex(v => matcher(v));
            if (index == -1) {
                this.addObjects(objects);
                return;
            }
            index = index + this.headerSize + (after ? 1 : 0);
            this.data = [
                ...this.data.slice(0, index),
                ...this.convertObjectsToData(objects),
                ...this.data.slice(index)
            ];
        }
        addObjects(objects) {
            this.addData(this.convertObjectsToData(objects));
        }
        convertObjectsToData(objects) {
            const headers = this.getHeaders();
            let data = [];
            headers.forEach(h => {
                const values = objects.map(o => { var _a; return (_a = o[h]) !== null && _a !== void 0 ? _a : ''; });
                data.push(values);
            });
            if (this.headerType == "RowBased") {
                data = CoverSheets.Utils.transpose(data);
            }
            return data;
        }
    }
    CoverSheets.RangeDataBuilder = RangeDataBuilder;
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
         * such worksheet is found, returns undefined
         */
        getSheetByName(sheetName) {
            const sheet = this.spreadsheet.getSheetByName(sheetName);
            if (!sheet) {
                // TODO
                // CSUtils.showWarning(`Worksheet named "${sheetName}" does not exist. Returning active sheet.`)
                return undefined;
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
            const range = this.sheet.getRange(row, column, numRows, numColumns);
            return new CoverSheets.Range({ range: range });
        }
        getRangeByName(rangeName, headerType = "None", headerSize = 1) {
            const rangeNameMatch = rangeName.match(/(?:["']?([^!'"]*)["']?!)?(.*)$/);
            let worksheetName = this.sheet.getName();
            if (rangeNameMatch) {
                if (rangeNameMatch[1]) {
                    worksheetName = rangeNameMatch[1];
                    // TODO: should we throw an exception if specified worksheet name 
                    // TODO: does not match this worksheet's name?
                }
                rangeName = `'${worksheetName}'!${rangeNameMatch[2]}`;
            }
            return new CoverSheets.NamedRange(rangeName, headerType, headerSize);
        }
    }
    CoverSheets.Worksheet = Worksheet;
})(CoverSheets || (CoverSheets = {}));
var Range = CoverSheets.Range;
var NamedRange = CoverSheets.NamedRange;
var RangeDataBuilder = CoverSheets.RangeDataBuilder;
var Spreadsheet = CoverSheets.Spreadsheet;
var Utils = CoverSheets.Utils;
var Worksheet = CoverSheets.Worksheet;
var exports = exports || {};
exports.Range = CoverSheets.Range;
exports.NamedRange = CoverSheets.NamedRange;
exports.RangeDataBuilder = CoverSheets.RangeDataBuilder;
exports.Spreadsheet = CoverSheets.Spreadsheet;
exports.Utils = CoverSheets.Utils;
exports.Worksheet = CoverSheets.Worksheet;
