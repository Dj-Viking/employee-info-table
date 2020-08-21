

const roleList = [
  'Marketing Lead',
  'Marketing Specialist',
  'Lead Engineer',
  'Software Engineer',
  'Magicks Manager',
  'Magician',
  'Coffee Team Lead',
  'Barista'
]
const empInfo = {};


test('check if object property is the number of the index of the role in the array', () => {
  empInfo.roleTitle = 'Software Engineer';
  let empRoleId;
  for (let i = 0; i < roleList.length; i++) {
    if (empInfo.roleTitle === roleList[i]) {
      empRoleId = i;
    }
  }
  empInfo.roleId = empRoleId;
  console.log(parseInt(3));
  expect(empInfo.roleId).toBe(3);

})