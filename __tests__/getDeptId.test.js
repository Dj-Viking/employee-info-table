



const deptList = ['Marketing', 'Engineering', 'Magic', 'Coffee', 'fjfj'];
const roleInfo = {};

test('check if true is true', () => {
  expect(true).toBe(true);
})

test('check if object property is the number of the index of the role in the array', () => {
  roleInfo.deptName = 'Magic';
  let roleDeptId;
  for (let i = 0; i < deptList.length; i++) {
    if (roleInfo.deptName === deptList[i]) {
      roleDeptId = i + 1;
    }
  }
  roleInfo.roleDeptId = roleDeptId;
  expect(roleInfo.roleDeptId).toBe(3);

})