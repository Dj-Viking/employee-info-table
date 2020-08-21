const { TestScheduler } = require("jest");

let fullName = 'first_name last_name';


test('check if we can extract first name out of full name string', () => {

  let firstName;
  let splitName = fullName.split(' ');
  console.log(splitName);
  firstName = splitName[0];

  expect(firstName).toBe('first_name')
});