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
        getValuesRange(defaultRows?: number, defaultColumns?: number): ValuesRange;
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
        insertObjects<T>(matcher: (item: T) => boolean, objects: T[], after?: boolean): void;
        /**
         * Sets the "values" portion of the range. If this is a headered range,
         * the header is not modified.
         * @param values Values to be set in the range
         */
        setValues(values: undefined[][]): void;
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
        addData(data: undefined[][]): RangeDataBuilder;
        /**
         * Add the specified array of objects after or before the first object that matches
         * the specified matcher.
         */
        insertObjects<T>(matcher: (item: T) => boolean, objects: T[], after?: boolean): RangeDataBuilder;
        /**
         * Adds the spcified objects to the end
         * @param objects to add
         * @returns RangeDataBuilder, for chaining
         */
        addObjects(objects: any): RangeDataBuilder;
        /**
         * Updates existing objects, using the matcher to determine equality. Objects
         * with no matches are added to the end.
         * @param matcher predicate used for determining a match to an existing object
         * @param objects Objects to update
         */
        updateObjects<T>(matcher: (existingItem: T, newItem: T) => boolean, objects: T[]): this;
        convertObjectsToData(objects: any): undefined[][];
    }
}
declare namespace CoverSheets {
    type TreeNode<T> = T & {
        children?: T[];
    };
    interface GroupInfo {
        startRow: number;
        numChildren: number;
        depth: number;
    }
    class RowGroup {
        /**
         * Determines grouping information based on the structure of the
         * rootNodes passed in. Groups are not created for the top level
         * rootNodes, only for their descendants.
         * @param rootNodes The tree structure that defines the grouping behavior
         */
        static getGroupData<T>(rootNodes: TreeNode<T>[], startRow?: number, depth?: number): GroupInfo[];
    }
}
declare namespace CoverSheets {
    type SheetNameAndId = Pick<GoogleAppsScript.Sheets.Schema.SheetProperties, "title" | "sheetId">;
    type SheetGroupData = Pick<GoogleAppsScript.Sheets.Schema.Sheet, "rowGroups" | "columnGroups"> & SheetNameAndId;
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
        /**
         *
         * @returns All row and column groups in the Spreadsheet
         */
        static getGroups(): SheetGroupData[];
        static removeAllGroups(): void;
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
