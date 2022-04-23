// Compiled using @impleta/cover-sheets 0.0.1 (TypeScript 4.6.3)
var exports = exports || {};
var module = module || { exports: exports };
exports.CSSpreadsheet = void 0;
//import { CSWorksheet } from "./CSWorksheet";
var CSSpreadsheet = /** @class */ (function () {
    function CSSpreadsheet(spreadsheet) {
        if (!spreadsheet) {
            spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        }
        this.spreadsheet = spreadsheet;
    }
    /**
     * Retrieves a Worksheet of the specified name in this spreadheet.
     * @param sheetName The name of the worksheet
     * @returns Worksheet representing the worksheet of the specified name. If no
     * such worksheet is found, returns null
     */
    CSSpreadsheet.prototype.getSheetByName = function (sheetName) {
        var sheet = this.spreadsheet.getSheetByName(sheetName);
        if (!sheet) {
            // TODO
            // CSUtils.showWarning(`Worksheet named "${sheetName}" does not exist. Returning active sheet.`)
            return null;
        }
        return new CSWorksheet(sheet);
    };
    /**
     *
     * @returns All the Worksheets in this spreadsheet.
     */
    CSSpreadsheet.prototype.getSheets = function () {
        return this.spreadsheet.getSheets().map(function (s) { return new CSWorksheet(s); });
    };
    /**
     * Adds a new worksheet of the specified name to the Spreadsheet. If a sheet of
     * the same name already exists, returns that instead.
     * @param sheetName The name of the sheet to add
     * @returns The newly added worksheet. If the sheet already exists, return that instead.
     */
    CSSpreadsheet.prototype.addSheet = function (sheetName) {
        var sheet = this.getSheetByName(sheetName);
        return sheet !== null && sheet !== void 0 ? sheet : new CSWorksheet(this.spreadsheet.insertSheet(sheetName));
    };
    CSSpreadsheet.prototype.cloneWorksheet = function (source, destination, activate) {
        if (activate === void 0) { activate = true; }
        var activateSheet = function (worksheet) {
            if (activate) {
                worksheet.sheet.activate();
            }
        };
        var destinationSheet = this.getSheetByName(destination);
        if (destinationSheet) {
            activateSheet(destinationSheet);
            return destinationSheet;
        }
        var sourceSheet = this.getSheetByName(source);
        if (!sourceSheet) {
            Utils.showError("Missing worksheet named ".concat(source));
            return null;
        }
        var clonedSheet = sourceSheet.sheet.copyTo(this.spreadsheet);
        clonedSheet.setName(destination);
        destinationSheet = new CSWorksheet(clonedSheet);
        activateSheet(destinationSheet);
        return destinationSheet;
    };
    return CSSpreadsheet;
}());
exports.CSSpreadsheet = CSSpreadsheet;
// Compiled using @impleta/cover-sheets 0.0.1 (TypeScript 4.6.3)
var exports = exports || {};
var module = module || { exports: exports };
exports.CSWorksheet = void 0;
var CSWorksheet = /** @class */ (function () {
    function CSWorksheet(sheet) {
        if (typeof sheet === 'string') {
            var worksheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet);
            if (worksheet) {
                sheet = worksheet;
            }
            else {
                throw new Error("No worksheet named \"".concat(sheet, "\" found in current spreadsheet"));
            }
        }
        if (!sheet) {
            throw new Error('Parameter sheet cannot be null');
        }
        this.sheet = sheet;
    }
    return CSWorksheet;
}());
exports.CSWorksheet = CSWorksheet;