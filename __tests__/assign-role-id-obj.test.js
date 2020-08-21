

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
    if (empInfo.roleTitle === roleList[i]) {//account for the object that has the property title roleList[i].title
      empRoleId = i + 1;
    }
  }
  empInfo.roleId = empRoleId;
  //console.log(parseInt(4));
  expect(empInfo.roleId).toBe(4);

})