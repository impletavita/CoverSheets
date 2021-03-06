namespace CoverSheets {
  export type TreeNode<T> = T & { 
    children?: TreeNode<T>[]
  }

  export interface GroupInfo {
    startIndex: number;
    numChildren: number;
    depth: number;
  }
  
  export class RowGroup {
    /**
     * Determines grouping information based on the structure of the 
     * rootNodes passed in. Groups are not created for the top level
     * rootNodes, only for their descendants.
     * @param rootNodes The tree structure that defines the grouping behavior
     */
    static getGroupData<T>(rootNodes:TreeNode<T>[], startRow = 1, depth = 0):GroupInfo[] {
      const groupData:GroupInfo[] = [];

      rootNodes?.forEach(r => {
      
        let numChildren = r.children?.length ?? 0;
        if (numChildren > 0) {
          let descendantGroupData = RowGroup.getGroupData(r.children!, startRow + 1, depth + 1);
          numChildren += descendantGroupData.reduce((a,b) => a + b.numChildren, 0);
          if (descendantGroupData.length > 0) {
            groupData.push(...descendantGroupData);
          }
          groupData.push({startIndex: startRow, numChildren:numChildren, depth:depth + 1})
        }
        startRow += numChildren + 1;
      })

      return groupData;
    }
  }
}