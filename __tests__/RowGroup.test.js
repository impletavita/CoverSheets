const CoverSheets = require("../dist/CoverSheets");


test("rootNodes with no children" , () => {
  const rootNodes = [];
  rootNodes.push({},{},{});
  const groups = CoverSheets.RowGroup.getGroupData(rootNodes);
  expect(groups.length).toEqual(0);
})

test("rootNodes with 1 level of children", () => {
  const rootNodes = [
    {
      children: [
        {}, {}, {}
      ]
    }
  ];

  let groups = CoverSheets.RowGroup.getGroupData(rootNodes);
  expect(groups).toMatchObject([
    {
      depth: 1,
      numChildren: 3,
      startIndex: 1,
    }
  ])

  rootNodes.unshift({});

  groups = CoverSheets.RowGroup.getGroupData(rootNodes);
  expect(groups).toMatchObject([
    {
      depth: 1,
      numChildren: 3,
      startIndex: 2,
    }
  ])

  rootNodes.unshift({});

  groups = CoverSheets.RowGroup.getGroupData(rootNodes);
  expect(groups).toMatchObject([
    {
      depth: 1,
      numChildren: 3,
      startIndex: 3,
    }
  ])

  rootNodes.push({
    children: [
      {}, {}
    ]
  });

  groups = CoverSheets.RowGroup.getGroupData(rootNodes);
  expect(groups).toMatchObject([
    {
      startIndex: 3,
      numChildren: 3,
      depth: 1
    },
    {
      startIndex: 7,
      numChildren: 2,
      depth: 1
    }
  ])

})

test("2 levels of children", () => {
  const rootNodes = [
    {
      children: [
        {
          children: [{},{},{}]
        }, 
        {}, 
        {}
      ]
    }
  ];

  let groups = CoverSheets.RowGroup.getGroupData(rootNodes);
  expect(groups).toContainEqual(
    {
      depth: 1,
      numChildren: 6,
      startIndex: 1
    }
  )

  expect(groups).toContainEqual(
    {
      depth: 2,
      numChildren: 3,
      startIndex: 2
    }
  )

})