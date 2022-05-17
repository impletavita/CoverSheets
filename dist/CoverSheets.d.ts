/// <reference types="google-apps-script" />
declare namespace CoverSheets {
    type HeaderType = "None" | "RowBased" | "ColumnBased";
    type RangeOptions = {
        range?: GoogleAppsScript.Spreadsheet.Range;
        worksheet: Worksheet;
        sheetName: string;
        row: number;
        column: number;
        numRows: number;
        numColumns: number;
        headerType: HeaderType;
        headerSize: number;
    };
    class Range {
        headerType: HeaderType;
        headerSize: number;
        worksheet: Worksheet;
        range: GoogleAppsScript.Spreadsheet.Range;
        constructor(params?: Partial<RangeOptions>);
        initParams(params?: Partial<RangeOptions>): RangeOptions;
        getHeaders(): string[];
        /**
         * For the specified header, return all the values as an array
         * @param header the name of the header
         */
        getValuesByHeader(header: string): undefined[];
        getValues(includeHeader?: boolean): any[][];
        /**
         * Replace all the data in this range. Range will be resized as necessary.
         * @param data new data to replace with
         */
        replaceData(data: any[]): void;
        /**
         * Add data to the range.
         * If the range is RowBased, new rows will be added. If it is
         * ColumnBased, new columns will be added.
         * @param data data to append to range
         */
        addData(data: undefined[][]): void;
        getDataAsObjects(): {}[];
        getVectorAsObject(vector: any, headers: any): {};
        addObjects(objects: any): void;
        metadata(range?: GoogleAppsScript.Spreadsheet.Range): string;
    }
}
declare namespace CoverSheets {
    class NamedRange extends Range {
        rangeName: string;
        constructor(rangeName: string, headerType?: HeaderType, headerSize?: number);
    }
}
declare namespace CoverSheets {
    class Spreadsheet {
        static getActiveWorksheet(): Worksheet;
        spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
        constructor(spreadsheet?: GoogleAppsScript.Spreadsheet.Spreadsheet);
        /**
         * Retrieves a Worksheet of the specified name in this spreadheet.
         * @param sheetName The name of the worksheet
         * @returns Worksheet representing the worksheet of the specified name. If no
         * such worksheet is found, returns undefined
         */
        getSheetByName(sheetName: string): Worksheet | undefined;
        /**
         *
         * @returns All the Worksheets in this spreadsheet.
         */
        getSheets(): Worksheet[];
        /**
         * Adds a new worksheet of the specified name to the Spreadsheet. If a sheet of
         * the same name already exists, returns that instead.
         * @param sheetName The name of the sheet to add
         * @returns The newly added worksheet. If the sheet already exists, return that instead.
         */
        addSheet(sheetName: string): Worksheet;
        cloneWorksheet(source: string, destination: string, activate?: boolean): Worksheet | null;
    }
}
declare namespace CoverSheets {
    type PropertiesType = "User" | "Script" | "Document";
    type LogType = "Default" | "Toast" | PropertiesType;
}
declare namespace CoverSheets {
    class Utils {
        static showError(message: string): void;
        static log(message: string, logType?: LogType, key?: string): void;
        static getProperties(propType: PropertiesType): GoogleAppsScript.Properties.Properties;
        /**
         * Displays a "Toast" message on the bottom left
         * @param message message to display.
         * @param title Optional title; default is empty
         * @param timeout Option timeout; default is 5 seconds
         */
        static toast(message: string, title?: string, timeout?: number): void;
        static getProperty(propType: PropertiesType, key: string): string | null;
        static transpose(array: Array<any>): [];
    }
}
declare namespace CoverSheets {
    class Worksheet {
        sheet: GoogleAppsScript.Spreadsheet.Sheet;
        constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet | string);
        getRange(row: number, column: number, numRows: number, numColumns: number): Range;
        getRangeByName(rangeName: string, headerType?: HeaderType, headerSize?: number): NamedRange;
    }
}
