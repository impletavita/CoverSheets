// Compiled using @impleta/cover-sheets 0.0.1 (TypeScript 4.6.3)
var exports = exports || {};
var module = module || { exports: exports };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spreadsheet = void 0;
//import { CSWorksheet } from "./CSWorksheet";
class CSSpreadsheet {
    constructor(spreadsheet) {
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
    getSheetByName(sheetName) {
        const sheet = this.spreadsheet.getSheetByName(sheetName);
        if (!sheet) {
            // TODO
            // CSUtils.showWarning(`Worksheet named "${sheetName}" does not exist. Returning active sheet.`)
            return null;
        }
        return new CSWorksheet(sheet);
    }
    /**
     *
     * @returns All the Worksheets in this spreadsheet.
     */
    getSheets() {
        return this.spreadsheet.getSheets().map(s => new CSWorksheet(s));
    }
    /**
     * Adds a new worksheet of the specified name to the Spreadsheet. If a sheet of
     * the same name already exists, returns that instead.
     * @param sheetName The name of the sheet to add
     * @returns The newly added worksheet. If the sheet already exists, return that instead.
     */
    addSheet(sheetName) {
        const sheet = this.getSheetByName(sheetName);
        return sheet !== null && sheet !== void 0 ? sheet : new CSWorksheet(this.spreadsheet.insertSheet(sheetName));
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
            Utils.showError(`Missing worksheet named ${source}`);
            return null;
        }
        const clonedSheet = sourceSheet.sheet.copyTo(this.spreadsheet);
        clonedSheet.setName(destination);
        destinationSheet = new CSWorksheet(clonedSheet);
        activateSheet(destinationSheet);
        return destinationSheet;
    }
}
exports.Spreadsheet = CSSpreadsheet;
// Compiled using @impleta/cover-sheets 0.0.1 (TypeScript 4.6.3)
var exports = exports || {};
var module = module || { exports: exports };
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSWorksheet = void 0;
class CSWorksheet {
    constructor(sheet) {
        if (typeof sheet === 'string') {
            const worksheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet);
            if (worksheet) {
                sheet = worksheet;
            }
            else {
                throw new Error(`No worksheet named "${sheet}" found in current spreadsheet`);
            }
        }
        if (!sheet) {
            throw new Error('Parameter sheet cannot be null');
        }
        this.sheet = sheet;
    }
}
exports.CSWorksheet = CSWorksheet;
