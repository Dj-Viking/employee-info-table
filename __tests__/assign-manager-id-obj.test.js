



const manList = ['Mike Wazowski', 'Bruce Lee', 'Super Mario', 'Sarah Marshall'];

const empInfo = {};

test('check if object property is the number of the index of the manager in the array', () => {

  empInfo.managerName = 'Bruce Lee';
  let managerId;
  for (let i = 0; i < manList.length; i++) {
    if (empInfo.managerName === manList[i]) {
      managerId = i + 1;
    }
  }
  empInfo.managerId = managerId;

  expect(empInfo.managerId).toBe(2);
});