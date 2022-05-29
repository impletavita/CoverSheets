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
    type ValuesRange = {
        range?: GoogleAppsScript.Spreadsheet.Range;
        row: number;
        column: number;
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
        getValuesRange(): ValuesRange;
        /**
         * Replace the data in this range. Range will be resized as necessary.
         * @param data new data to replace with
         * @param preserveHeaders if true, replace values only
         */
        replaceData(data: any[], preserveHeaders?: boolean): GoogleAppsScript.Spreadsheet.Range;
        /**
         * Add data to the range.
         * If the range is RowBased, new rows will be added. If it is
         * ColumnBased, new columns will be added.
         * @param data data to append to range
         */
        addData(data: undefined[][]): void;
        getDataAsObjects<T extends {}>(): T[];
        getVectorAsObject<T extends {}>(vector: any, headers: any): T;
        addObjects(objects: any): void;
        convertObjectsToData(objects: any): undefined[][];
        /**
         * Add the specified array of objects after the first object that matches
         * the specified matcher. If objects of the specfied keys already exist,
         * merge the data instead.
         */
        addObjectsAfter<T>(matcher: (item: T) => boolean, objects: T[]): void;
        getBuilder(): RangeDataBuilder;
        metadata(range?: GoogleAppsScript.Spreadsheet.Range): string;
    }
}
declare namespace CoverSheets {
    class NamedRange extends Range {
        rangeName: string;
        namedRange?: GoogleAppsScript.Spreadsheet.NamedRange;
        constructor(rangeName: string, headerType?: HeaderType, headerSize?: number);
        static getNamedRange(rangeName: string): GoogleAppsScript.Spreadsheet.NamedRange | undefined;
        replaceData(data: any[], preserveHeaders?: boolean): GoogleAppsScript.Spreadsheet.Range;
    }
}
declare namespace CoverSheets {
    class RangeDataBuilder {
        data: undefined[][];
        headerType: string;
        headerSize: number;
        constructor(data: undefined[][], headerType: HeaderType, headerSize: number);
        getHeaders(): string[];
        getDataAsObjects<T extends {}>(): T[];
        getVectorAsObject<T extends {}>(vector: any, headers: any): T;
        getValues(): undefined[][];
        addData(data: undefined[][]): void;
        /**
         * Add the specified array of objects after the first object that matches
         * the specified matcher. If objects of the specfied keys already exist,
         * merge the data instead.
         */
        insertObjects<T>(matcher: (item: T) => boolean, objects: T[], after?: boolean): void;
        addObjects(objects: any): void;
        convertObjectsToData(objects: any): undefined[][];
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
