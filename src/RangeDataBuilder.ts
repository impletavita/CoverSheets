namespace CoverSheets {
  export class RangeDataBuilder {
    data: undefined[][];
    headerType: string;
    headerSize: number;
    
    constructor(data:undefined[][], headerType: HeaderType, headerSize: number) {
      this.data = data;
      this.headerType = headerType;
      this.headerSize = headerSize;
    }

    getHeaders() : string[] {
      const coaleseHeaders = (headers:string[][]):string[] =>  {
        headers.forEach(d => d.slice(1).forEach((dd,i) => d[i+1] = (dd === '' ? d[i] : dd)));
        return headers.reduce((r, a) => a.map((b, i) => (r[i] ?? '')+ b), []);
      }

      switch(this.headerType) {
        case "RowBased":
          const headerRows = this.data.slice(0, this.headerSize); 
          return coaleseHeaders(headerRows as unknown as string[][]);
        case "ColumnBased":
          let headerColumns = this.data.map(v => v.slice(0, this.headerSize));
          headerColumns = Utils.transpose(headerColumns);
          return coaleseHeaders(headerColumns as unknown as string[][]);
        default:
          return [];
      }
    }

    getDataAsObjects<T extends {}>(): T[] {
      let headers = this.getHeaders();
      let values = this.getValues();
      
      if (this.headerType == "ColumnBased") {
        values = Utils.transpose(values);
      }
      
      return values.map(v => this.getVectorAsObject<T>(v, headers));
    }

    getVectorAsObject<T extends {}>(vector, headers): T {
      const obj = {}

      headers.forEach((h, i) => {
        obj[h] = vector[i];
      })

      return obj as T;
    }

    getValues() {
      let row = 0;
      let column = 0;
      let numRows = this.data.length;
      let numColumns = this.data[0].length;
 
      if (this.headerType == "RowBased") {
        row += this.headerSize;
      } else if (this.headerType == "ColumnBased") {
        column += this.headerSize;
      }

      let values:undefined[][] = [];
      if (numRows > 0 && numColumns > 0) {
        values = this.data.slice(row, numRows).map(e => e.slice(column, numColumns + 1))
      }

      return values;
    }

    addData(data:undefined[][]) {
      // todo: Exception when data.rows/data.columns don't match this.data.length/this.data[0].length
      // todo: Add ablity to modify data to current structure or modify structure to match new data 

      if (this.headerType === "ColumnBased") {
        for (let row = 0; row < this.data.length; row++) {
          this.data[row] = this.data[row].concat(data[row])
        }
      } else {
        for(let row = 0; row < data.length; row++) {
          this.data.push(data[row]);
        }
      }
    }

    /**
     * Add the specified array of objects after the first object that matches
     * the specified matcher. If objects of the specfied keys already exist,
     * merge the data instead.
     */
    
    insertObjects<T>(matcher: (item:T) => boolean, objects:T[], after=true) {
      let values:T[] = this.getDataAsObjects<T>();
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
      ]
    }
    
    addObjects(objects) {
      this.addData(this.convertObjectsToData(objects));
    }

    convertObjectsToData(objects) {
      const headers = this.getHeaders();
      let data:undefined[][] = [];

      headers.forEach(h => {
        const values = objects.map(o => o[h] ?? '')
        data.push(values)
      });

      if (this.headerType == "RowBased") {
        data = Utils.transpose(data);
      }

      return data;
    }
  }
}