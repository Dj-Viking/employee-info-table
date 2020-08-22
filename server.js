const db = require('./db/database.js');
const cTable = require('console.table');
const inquirer = require('inquirer');
//inquirer lists getting populated by database
const deptList = [];
const roleList = [];
const empList = [];
const manObjs = [];
const manList = [];
const beginList = [
  'View All Departments',
  'View All Roles',
  'View All Employees',
  'Add A Department',
  'Add A Role',
  'Add An Employee',
  'Update An Employee Role',
  'Update An Employee Manager'
];
startGetDepts = () => {
  const sql = `select * from departments ORDER BY id ASC`;
  const params = [];
  db.query(sql, params, function(err, rows, fields) {
    if (err) throw err;
    console.log(`\x1b[33m`, `
    Querying departments...
    `, `\x1b[00m`);
    for (let i = 0; i < rows.length; i++) {
      deptList.push(rows[i].name);
    }
    console.table(rows);
    console.log(deptList);
  });
}
startGetRoles = () => {
  const sql =`
  SELECT roles.title, roles.id, departments.name AS department, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id
  `
  const params = [];
  db.query(sql, params, function(err, rows, fields) {
    if (err) throw err;
    console.log(`\x1b[33m`, `
    Querying roles...
    `, `\x1b[00m`);
    for (let i = 0; i < rows.length; i++) {
      roleList.push(rows[i].title);
    }
    console.table(rows);
    console.log(roleList);
  });
}
startGetEmps = () => {
  const sql = `
  SELECT 
    employees.id, 
    CONCAT(employees.first_name, ' ', employees.last_name) AS name,
    roles.title, 
    roles.salary, 
    departments.name AS department, 
    CONCAT(managers.first_name, ' ', managers.last_name) AS manager,
    employees.id
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees managers ON managers.id = employees.manager_id;
  `
  const params = [];
  db.query(sql, params, (err, rows, fields) => {
    if (err) throw err;
    console.log(`\x1b[33m`, `
    Querying employees...
    `, `\x1b[00m`);
    for (let i = 0; i < rows.length; i++) {
      empList.push(rows[i].name);
    }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].name === 'Mike Wazowski' ||
          rows[i].name === 'Bruce Lee' ||
          rows[i].name === 'Super Mario' ||
          rows[i].name === 'Sarah Marshall') {
        manObjs.push(rows[i]);
      }
    }
    console.table(rows);
    console.log(rows);
    console.log(empList);
    console.log(manObjs);
    for (let i = 0; i < manObjs.length; i++) {
      manList.push(manObjs[i].name);
    }
    const nullVal = NaN;
    manList.push(nullVal);
    console.log(manList);
  })
}
db.connect((err) => {
  if (err) throw err;
  console.log("\x1b[33m", `
  mysql connected!
  `, "\x1b[00m" );
  startGetDepts();
  startGetRoles();
  startGetEmps();
  setTimeout(promptBeginning, 1000);
  // promptBeginning();
});

const promptAddDept = () => {
  return inquirer.prompt ([
    {
      type: 'input',
      name: 'deptName',
      message: 'What is the name of the department you would like to add?'
    }
  ])
  .then(deptInfo => {
    deptList.push(deptInfo.deptName);
    addDept(deptInfo);
  })
  .catch(err => err);
}

const promptAddRole = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'roleTitle',
      message: 'What would you like this new role to be named?'
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: `What is this role's salary?`
    },
    {
      type: 'list',
      name: 'roleDept',
      message: 'Which department is this role a part of?',
      choices: deptList
    }
  ])
  .then(roleInfo => {
    roleList.push(roleInfo.roleTitle);
    let roleDeptId;
    for (let i = 0; i < deptList.length; i++) {
      if (roleInfo.roleDept === deptList[i]) {
        roleDeptId = i + 1;
      }
    }
    roleInfo.roleDeptId = roleDeptId;
    console.log(roleInfo.roleDept);
    addRole(roleInfo);
  })
  .catch(err => err);
}

const promptAddEmp = () => {
  return inquirer.prompt ([
    {
      type: 'input',
      name: 'firstName',
      message: `What is this employee's first name?`
    },
    {
      type: 'input',
      name: 'lastName',
      message: `What is this employee's last name?`
    },
    {
      //DONE instead of asking to input employee id
      // DONE make a list of available employee roles to choose
      // DONE after making a new role push that into the array
      // then convert the role name into the id to place into the query
      type: 'list',
      name: 'roleTitle',
      message: `What is this employee's role?`,
      choices: roleList
    },
    {
      type: 'list',
      name: 'managerName',
      message: `Who is this employee's manager?`,
      choices: manList
    }
  ])
  .then(empInfo => {
      //convert managerName into a managerId
      let managerId;
      for (let i = 0; i < manList.length; i++) {
        if (empInfo.managerName === manList[i]) {
          if (manList.indexOf(manList[i]) === 0) {
            managerId = i + 1;
          } else if (manList.indexOf(manList[i]) === 1) {
            managerId = i + 2;
          } else if (manList.indexOf(manList[i]) === 2) {
            managerId = i + 3;
          } else if (manList.indexOf(manList[i]) === 3) {
            managerId = i + 4;
          }
        }
      }
      empInfo.managerId = managerId;
    //convert roleTitle into a roleId
    let empRoleId;
    for (let i = 0; i < roleList.length; i++) {
      if (empInfo.roleTitle === roleList[i]) {
        empRoleId = i + 1;
      }
    }
    empInfo.roleId = empRoleId;
    empInfo.fullName = `${empInfo.firstName} ${empInfo.lastName}`
    empList.push(empInfo.fullName);
    addEmp(empInfo);
  })
  .catch(err => err);
}

const promptUpdateRole = () => {
  return inquirer.prompt ([
    {
      type: 'list',
      name: 'updateEmpChoice',
      message: 'Which employee do you want to update?',
      choices: empList
    },
    {
      type: 'list',
      name: 'updateRoleChoice',
      message: 'Which role should this employee be assigned?',
      choices: roleList
    },
  ])
  .then(empRoleUpdateInfo => {
    let firstName;
    let splitName = empRoleUpdateInfo.updateEmpChoice.split(' ');
    firstName = splitName[0];
    empRoleUpdateInfo.firstName = firstName;
    //convert roleTitle into a roleId
    let empRoleId;
    for (let i = 0; i < roleList.length; i++) {
      if (empRoleUpdateInfo.updateRoleChoice === roleList[i]) {
        empRoleId = i + 1;
      }
    }
    empRoleUpdateInfo.empRoleId = empRoleId;
    updateEmpRole(empRoleUpdateInfo);
  })
}

const promptUpdateEmpMgr = () => {
  return inquirer.prompt ([
    {
      type: 'list',
      name: 'updateEmpChoice',
      message: "Which employee do you want to update the manager for?",
      choices: empList
    },
    {
      type: 'list',
      name: 'updateEmpMgrName',
      message: 'Who will be their new manager?',
      choices: manList
    }
  ])
  .then(empMgrUpdateInfo => {
    let firstName;
    let splitName = empMgrUpdateInfo.updateEmpChoice.split(' ');
    firstName = splitName[0];
    empMgrUpdateInfo.firstName = firstName;
    //convert manager name into a manager_id for the query
    let managerId;
    for (let i = 0; i < manList.length; i++) {
      if (empMgrUpdateInfo.updateEmpMgrName === manList[i]) {
        if (manList.indexOf(manList[i]) === 0) {
          managerId = i + 1;
        } else if (manList.indexOf(manList[i]) === 1) {
          managerId = i + 2;
        } else if (manList.indexOf(manList[i]) === 2) {
          managerId = i + 3;
        } else if (manList.indexOf(manList[i]) === 3) {
          managerId = i + 4;
        }
      }
    }
    empMgrUpdateInfo.managerId = managerId;
    updateEmpMgr(empMgrUpdateInfo);
  })
}

const promptBeginning = () => {
  return inquirer.prompt(
    {
      type: 'list',
      name: 'queryChoice',
      message: 'What would you like to do?',
      choices: beginList
    }
  )
  .then(data => {
    console.log(data);
    if (data.queryChoice === 'View All Departments') {
      getDepts();
    }
    if (data.queryChoice === 'View All Roles') {
      getRoles();
    }
    if (data.queryChoice === 'View All Employees') {
      getEmps();
    }
    if (data.queryChoice === 'Add A Department') {
      promptAddDept();
    }
    if (data.queryChoice === 'Add A Role') {
      promptAddRole();
    }
    if (data.queryChoice === 'Add An Employee') {
      promptAddEmp();
    }
    if (data.queryChoice === 'Update An Employee Role') {
      promptUpdateRole();
    }
    if (data.queryChoice === 'Update An Employee Manager') {
      promptUpdateEmpMgr();
    }
  })
  .catch(err => err);
}

getDepts = () => {
  const sql = `
  SELECT id, name FROM departments
  `;
  const params = [];
  console.log(`\x1b[33m`, `
  Querying departments...
  `, `\x1b[00m`);
  db.promise().query(sql, params, function(err, rows, fields) {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `)
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}

getRoles = () => {
  const sql = `
  SELECT roles.title, roles.id, departments.name AS department, roles.salary 
  FROM roles
  LEFT JOIN departments ON roles.department_id = departments.id
  `;
  const params = [];
  console.log(`\x1b[33m`, `
  Querying roles...
  `, `\x1b[00m`);
  db.promise().query(sql, params, function(err, rows, fields) {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) => {
    //console.log(fields);
    console.log(`
    
    `)
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}

getEmps = () => {
  // const sql = `
  // SELECT employees.id AS employee_id,
  //        employees.first_name AS first_name, 
  //        employees.last_name AS last_name,
  //        employees.manager_id AS manager_name, 
  //        roles.title
  // FROM employees, manager_name
  // WHERE employees.manager_id = employees.first_name
  // LEFT JOIN employees manager_name ON employees.manager_id > employees.id
  // LEFT JOIN roles ON employees.role_id = roles.id
  // ORDER BY manager_name DESC
  // `;
  // const sql = `
  // SELECT employees.id AS emp_id, employees.first_name AS emp_name,
  //        employees.manager_id AS manager_id, employees.first_name AS manager_name
  //        FROM employees
  //        WHERE employees.id > employees.first_name;
  // `
  // const sql = `
  // SELECT
  //   employees.id, roles.title AS job_title, departments.name AS dept_name,
  //   CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name,
  //   CONCAT(managers.first_name, ' ', managers.last_name) AS Reports_to
  // FROM employees
  // LEFT JOIN managers ON employees.manager_id = managers.role_id
  // LEFT JOIN roles ON employees.role_id = roles.id
  // LEFT JOIN departments ON roles.department_id = departments.id
  // `
  const sql = `
  SELECT 
    employees.id, 
    CONCAT(employees.first_name, ' ', employees.last_name) AS name,
    roles.title AS role, 
    roles.salary, 
    departments.name AS department, 
    CONCAT(managers.first_name, ' ', managers.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees managers ON managers.id = employees.manager_id;
  `
  const params = [];
  console.log(`\x1b[33m`, `
  Querying employees...
  `, `\x1b[00m`);
  db.promise().query(sql, params, function(err, rows, fields) {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `)
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}


//function for querying adding a department 
addDept = deptInfo => {
  const sql = `
  INSERT INTO departments (name) VALUES (?)
  `;
  const params = [deptInfo.deptName];
  console.log(`\x1b[33m`, `
  Querying Add Department...
  `, `\x1b[00m`);
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `)
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}

//function for querying adding a role
addRole = roleInfo => {
  const sql = `
  INSERT INTO roles 
    (title, salary, department_id) 
  VALUES (?, ?, ?)
  `;
  const params = [roleInfo.roleTitle, parseInt(roleInfo.roleSalary, 10), parseInt(roleInfo.roleDeptId, 10)];
  console.log(params);
  console.log(`\x1b[33m`, `
  Querying Add A Role...
  `, `\x1b[00m`);
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `)
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}
//function for querying adding an employee
addEmp = empInfo => {
  //push onto manager array if employee is a manager
  console.log('\x1b[33m', 'empInfo Object', '\x1b[00m');
  console.log(empInfo);
  empInfo.managerId = parseInt(empInfo.managerId, 10);
  console.log(empInfo.managerId);
  const sql = `
  INSERT INTO employees 
    (first_name, last_name, role_id, manager_id) 
  VALUES (?, ?, ?, ?)
  `;
  const params = [empInfo.firstName, empInfo.lastName, parseInt(empInfo.roleId, 10), empInfo.managerId];
  console.log('\x1b[33m', 'query parameters', '\x1b[00m');
  console.log(params);
  console.log(`\x1b[33m`, `
  Querying Add An Employee...
  `, `\x1b[00m`);
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `)
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}
//function for querying updating an employee
updateEmpRole = empRoleUpdateInfo => {
  const sql = `
  UPDATE employees 
    SET role_id = ? 
    WHERE first_name = ?
  `;
  const params = [empRoleUpdateInfo.empRoleId, empRoleUpdateInfo.firstName]
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `);
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}
//function for querying updating employee managers
updateEmpMgr = updateEmpMgrInfo => {
  const sql = `
  UPDATE employees 
  SET manager_id = ? 
  WHERE first_name = ?
  `;
  const params = [updateEmpMgrInfo.managerId, updateEmpMgrInfo.firstName];
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `);
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}


//function for querying viewing employees by only manager

//function for querying viewing employees by department

//functions for querying deleting 
//dept

//role

//employee



//some prompts will execute SQL queries to display the tables
// and then callback into the prompt to loop again what
// else the user would like to do. only if the choice was
// to view a table

//if user chose to change something then callback into
// a separate prompt which will have other inputs


//prompt for view tables

//prompt for editing items in the tables

//prompt for deleting items in the tables

//functions all here with conditional callback structures