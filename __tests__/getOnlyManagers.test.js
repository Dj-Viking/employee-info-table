const empList = [
  {
    id: 1,
    name: 'Mike Wazowski',
    title: 'Marketing Lead',
    salary: '100000',
    department: 'Marketing',
    manager: null
  },
  {
    id: 2,
    name: 'Jackie Chan',
    title: 'Marketing Specialist',
    salary: '80000',
    department: 'Marketing',
    manager: 'Mike Wazowski'
  },
  {
    id: 3,
    name: 'Bruce Lee',
    title: 'Lead Engineer',
    salary: '150000',
    department: 'Engineering',
    manager: null
  },
  {
    id: 4,
    name: 'M. Bison',
    title: 'Software Engineer',
    salary: '120000',
    department: 'Engineering',
    manager: 'Bruce Lee'
  },
  {
    id: 5,
    name: 'Super Mario',
    title: 'Magicks Manager',
    salary: '60000',
    department: 'Magic',
    manager: null
  },
  {
    id: 6,
    name: 'Bowser Koopa',
    title: 'Magician',
    salary: '30000',
    department: 'Magic',
    manager: 'Super Mario'
  },
  {
    id: 7,
    name: 'Sarah Marshall',
    title: 'Coffee Team Lead',
    salary: '50000',
    department: 'Coffee',
    manager: null
  },
  {
    id: 8,
    name: 'Tom Hanks',
    title: 'Barista',
    salary: '40000',
    department: 'Coffee',
    manager: 'Sarah Marshall'
  },
  {
    id: 9,
    name: 'jfjf jfjf',
    title: 'Magician',
    salary: '30000',
    department: 'Magic',
    manager: 'Bruce Lee'
  },
  {
    id: 10,
    name: '3833 jj',
    title: 'Magician',
    salary: '30000',
    department: 'Magic',
    manager: 'Bruce Lee'
  }
];
//managers are primary key id's 1, 3, 5, 7
// translates to indexes 0, 2, 4, 6
const manList = [];

test('see if new array contains only the managers from the employee list', () => {

  for (let i = 0; i < empList.length; i++) {
    if (empList[i].manager === null) {
      manList.push(empList[i].name);
    }
  }

  expect(manList).toEqual(['Mike Wazowski', 'Bruce Lee', 'Super Mario', 'Sarah Marshall']);

});