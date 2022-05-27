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

    /**
     * Add the specified array of objects after the first object that matches
     * the specified matcher. If objects of the specfied keys already exist,
     * merge the data instead.
     */
    /* 
    addObjectsAfter<T>(matcher: (item:T) => boolean, objects:T[]) {
      let values:T[] = this.getDataAsObjects<T>();
      let index = values.findIndex(v => matcher(v));
      if (index == -1) {
        this.addObjects(objects);
        return;
      }
    }
    */
  }
}