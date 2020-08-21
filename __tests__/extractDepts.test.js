




const rows = [
    { id: 1, name: 'Marketing' },
    { id: 2, name: 'Engineering' },
    { id: 3, name: 'Magic' },
    { id: 4, name: 'Coffee' },
    { id: 5, name: 'fjfj' }
];

let deptList = [];

test('checks if deptlist is populated with just the names in order of the index of the array', () => {
  for (let i = 0; i < rows.length; i++) {
    deptList.push(rows[i].name);
  }

  expect(deptList).toEqual(['Marketing', 'Engineering', 'Magic', 'Coffee', 'fjfj']);
})