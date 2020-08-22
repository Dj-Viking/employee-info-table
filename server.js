const db = require('./db/database.js');
const cTable = require('console.table');
const inquirer = require('inquirer');
//inquirer lists getting populated by database
let deptList = [];
let roleList = [];
let empList = [];
let manObjs = [];
let manList = [];
const beginList = [
  'View All Employees',
  'View All Departments',
  'View All Roles',
  'View All Managers',
  'View Employees By Department',
  'Add A Department',
  'Add A Role',
  'Add An Employee',
  'Update An Employee Role',
  'Update An Employee Manager',
  'Delete A Department',
  'Exit'
];
//when querying for the lists.....maybe have to place an array of objects with a name property so that
// and have their unique id's for each employee, department, and role.
// so this way we can ensure that the choice in the list can be included 
// CONVERT ALL OF THE LISTS INTO ARRAYS OF OBJECTS AND NOT JUST STRINGS!!
const startGetDepts = () => {
  const sql = `select departments.name AS name, departments.id AS value from departments ORDER BY id ASC`;
  const params = [];
  db.query(sql, params, function(err, rows, fields) {
    if (err) throw err;
    console.log(`\x1b[33m`, `
    Querying departments...
    `, `\x1b[00m`);
    // for (let i = 0; i < rows.length; i++) {
    //   deptList.push(rows[i]);
    // }
    deptList = rows;
    //console.table(rows);
    console.log(deptList);
  });
}
const startGetRoles = () => {
  const sql =`
  SELECT 
  roles.title AS name, 
  roles.id as value
  FROM roles ORDER BY id ASC
  `
  const params = [];
  db.query(sql, params, function(err, rows, fields) {
    if (err) throw err;
    console.log(`\x1b[33m`, `
    Querying roles...
    `, `\x1b[00m`);
    // for (let i = 0; i < rows.length; i++) {
    //   roleList.push(rows[i]);
    // }
    roleList = rows;
    console.log(roleList);
  });
}
const startGetEmps = () => {
  const sql = `
  SELECT
    CONCAT(employees.first_name, ' ', employees.last_name) AS name,
    employees.id AS value
  FROM employees
  LEFT JOIN employees managers ON managers.id = employees.manager_id
  `
  const params = [];
  db.query(sql, params, (err, rows, fields) => {
    if (err) throw err;
    console.log(`\x1b[33m`, `
    Querying employees...
    `, `\x1b[00m`);
    // for (let i = 0; i < rows.length; i++) {
    //   empList.push(rows[i]);
    // }
    empList = rows;
    let iterated = []
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].value === 1 ||//mike wazowski
          rows[i].value === 3 ||//bruce lee
          rows[i].value === 5 ||// super mario
          rows[i].value === 7) { //sarah marshall
          iterated.push(rows[i]);
      }
    }
    manList = iterated;
    //console.table(rows);
    //console.log(rows);
    console.log(empList);
    // for (let i = 0; i < manObjs.length; i++) {
    //   manList.push(manObjs[i].name);
    // }
    //const nullVal = NaN;
    console.log(`\x1b[33m`, `
    Querying managers...
    `, `\x1b[00m`);
    //manObjs.push(nullVal);
    console.log(manList);
  });
}
db.connect((err) => {
  if (err) throw err;
  console.log("\x1b[33m", `
  mysql connected!
  `, "\x1b[00m" );
  startGetDepts();
  startGetRoles();
  startGetEmps();
  //promptBeginning();
  
  setTimeout(promptBeginning, 1000);
});

const promptAddDept = () => {
  return inquirer.prompt ([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the department you would like to add?'
    }
  ])
  .then(deptInfo => {
    addDept(deptInfo);
  })
  .catch(err => err);
}

const promptAddRole = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What would you like this new role to be named?'
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: `What is this role's salary?`
    },
    {
      type: 'list',
      name: 'roleDeptId',
      message: 'Which department is this role a part of?',
      choices: [...deptList]
    }
  ])
  .then(roleInfo => {
    // let roleDeptId;
    // for (let i = 0; i < deptList.length; i++) {
      //   if (roleInfo.roleDept === deptList[i]) {
        //     roleDeptId = i + 1;
        //   }
        // }
    // roleInfo.roleDeptId = roleDeptId;
    // let newRoleObj = {};
    // newRoleObj = {
    //   name: roleInfo.name,
    //   value: roleList.length + 1
    // }
    // roleList.push(newRoleObj);
    // console.log(roleInfo.roleDept);
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
      name: 'roleId',
      message: `What is this employee's role?`,
      choices: [...roleList]
    },
    {
      type: 'list',
      name: 'managerId',
      message: `Who is this employee's manager? \n    If this employee doesn't need a manager select none`,
      //pass manNamesAndIds array of objects which was queried specifically for this prompt
      choices: [...manList, {name: "None", value: null }]
    }
  ])
  .then(empInfo => {
      //convert managerName into a managerId
      console.log('checking if i can get values from the list array of objects');
      console.log(empInfo.managerId);
      //let managerId;
      // for (let i = 0; i < manObjs.length; i++) {
      //   if (empInfo.managerName === manObjs[i].name) {
      //     if (manObjs.indexOf(manObjs[i].name) === 0) {
      //       managerId = i + 1;
      //     } else if (manObjs.indexOf(manObjs[i].name) === 1) {
      //       managerId = i + 2;
      //     } else if (manObjs.indexOf(manObjs[i].name) === 2) {
      //       managerId = i + 3;
      //     } else if (manObjs.indexOf(manObjs[i].name) === 3) {
      //       managerId = i + 4;
      //     }
      //   }
      // }
      //empInfo.managerId = managerId;
    //convert roleTitle into a roleId
    // let empRoleId;
    // for (let i = 0; i < roleList.length; i++) {
    //   if (empInfo.roleTitle === roleList[i]) {
    //     empRoleId = i + 1;
    //   }
    // }
    // empInfo.roleId = empRoleId;
    //empInfo.name = `${empInfo.firstName} ${empInfo.lastName}`;
    //let newEmpObj = {};
    //newEmpObj = {
    //  name: empInfo.name,
    //  value: empList.length + 1
    //}
    //empList.push(newEmpObj);
    console.log(empList);
    addEmp(empInfo);
  })
  .catch(err => err);
}

const promptUpdateRole = () => {
  return inquirer.prompt ([
    {
      type: 'list',
      name: 'empId',
      message: 'Which employee do you want to update?',
      choices: [...empList]
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Which role should this employee be assigned?',
      choices: [...roleList]
    },
  ])
  .then(empRoleUpdateInfo => {
    console.log(empRoleUpdateInfo.empId);
    // let firstName;
    // let splitName = empRoleUpdateInfo.name.split(' ');
    // firstName = splitName[0];
    // empRoleUpdateInfo.firstName = firstName;
    //convert roleTitle into a roleId
    // let empRoleId;
    // for (let i = 0; i < roleList.length; i++) {
    //   if (empRoleUpdateInfo.role === roleList[i]) {
    //     empRoleId = i + 1;
    //   }
    // }
    // empRoleUpdateInfo.empRoleId = empRoleId;
    console.log(empRoleUpdateInfo);
    updateEmpRole(empRoleUpdateInfo);
  })
  .catch(err => err);
}

const promptUpdateEmpMgr = () => {
  return inquirer.prompt ([
    {
      type: 'list',
      name: 'empId',
      message: "Which employee do you want to update the manager for?",
      choices: [...empList]
    },
    {
      type: 'list',
      name: 'manId',
      message: 'Who will be their new manager? \n   If removing a manager select NaN',
      choices: [...manList, {name: "None", value: null}]
    }
  ])
  .then(empMgrUpdateInfo => {
    console.log(empMgrUpdateInfo);
    // let firstName;
    // let splitName = empMgrUpdateInfo.updateEmpChoice.split(' ');
    // firstName = splitName[0];
    // empMgrUpdateInfo.firstName = firstName;
    //convert manager name into a manager_id for the query
    // let managerId;
    // for (let i = 0; i < manList.length; i++) {
    //   if (empMgrUpdateInfo.updateEmpMgrName === manList[i]) {
    //     if (manList.indexOf(manList[i]) === 0) {
    //       managerId = i + 1;
    //     } else if (manList.indexOf(manList[i]) === 1) {
    //       managerId = i + 2;
    //     } else if (manList.indexOf(manList[i]) === 2) {
    //       managerId = i + 3;
    //     } else if (manList.indexOf(manList[i]) === 3) {
    //       managerId = i + 4;
    //     }
    //   }
    // }
    // empMgrUpdateInfo.managerId = managerId;
    updateEmpMgr(empMgrUpdateInfo);
  })
  .catch(err => err);
}

const promptDelDept = () => {
  //array of objects that have a property name
  return inquirer.prompt ([
    {
      type: 'list',
      name: 'deptId',
      message: 'Which department do you want to delete',
      choices: deptList
    }
  ])
  .then(delDeptInfo => {
    delDept(delDeptInfo);
    console.log(delDeptInfo);

  })
  .catch(err => err);
}

const promptBeginning = () => {
  console.log(`
  
  
  
  
  
  `)
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
      //query database to get only role names and id's 
      promptAddRole();
    }
    if (data.queryChoice === 'Add An Employee') {
      //query database to get only managers names and id's in an array of objects 
      // with properties only name and id
      promptAddEmp();
    }
    if (data.queryChoice === 'Update An Employee Role') {
      //query database to get only managers names and id's in an array of objects
      // with properties only name and id and spread the array in the list [...roleArray]
      promptUpdateRole();
    }
    if (data.queryChoice === 'Update An Employee Manager') {
      //query database to get only managers names and id's in an array of objects
      // with properties only name and id and spread the array in the inquirer list
      promptUpdateEmpMgr();
    }
    if (data.queryChoice === 'View All Managers') {
      getManagers();
    }
    if (data.queryChoice === 'View Employees By Department') {
      viewEmpByDept();
    }
    if (data.queryChoice === 'Delete A Department') {
      //query database to get only department name and id properties in an array of those objects
      promptDelDept();
    }
    if (data.queryChoice === 'Exit') {
      db.end();
    }
  })
  .catch(err => err);
}

getDepts = () => {
  const sql = `
  select * from departments ORDER BY id ASC
  `;
  const params = [];
  console.log(`\x1b[33m`, `
  Querying departments...
  `, `\x1b[00m`);
  db.promise().query(sql, params, function(err, rows, fields) {
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
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    //console.log(fields);
    console.log(`
    
    `);
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
  LEFT JOIN employees managers ON managers.id = employees.manager_id
  `
  const params = [];
  console.log(`\x1b[33m`, `
  Querying employees...
  `, `\x1b[00m`);
  db.promise().query(sql, params, function(err, rows, fields) {
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

//function for querying adding a department 
addDept = deptInfo => {
  console.log(deptInfo);
  const sql = `
  INSERT INTO departments (name) VALUES (?)
  `;
  const params = [deptInfo.name];
  console.log(`\x1b[33m`, `
  Querying Add Department...
  `, `\x1b[00m`);
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `);
    console.table(rows);
  })
  .then(() =>{
    startGetDepts();
    setTimeout(promptBeginning, 1000);
  })
  .catch(err => err);
}

//function for querying adding a role
addRole = roleInfo => {
  console.log(roleInfo);
  const sql = `
  INSERT INTO roles 
    (title, salary, department_id) 
  VALUES (?, ?, ?)
  `;
  const params = [roleInfo.name, parseInt(roleInfo.roleSalary, 10), parseInt(roleInfo.roleDeptId, 10)];
  console.log(params);
  console.log(`\x1b[33m`, `
  Querying Add A Role...
  `, `\x1b[00m`);
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `);
    console.table(rows);
  })
  .then(() => {
    startGetRoles();
    setTimeout(promptBeginning, 1000);
  })
  .catch(err => err);
}
//function for querying adding an employee
addEmp = empInfo => {
  //push onto manager array if employee is a manager
  //console.log('\x1b[33m', 'empInfo Object', '\x1b[00m');
  console.log(empInfo);
  //console.log(empInfo.managerId);
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
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `);
    console.table(rows);
  })
  .then(() => {
    startGetEmps();
    setTimeout(promptBeginning, 1000);
  })
  .catch(err => err);
}
//function for querying updating an employee
updateEmpRole = empRoleUpdateInfo => {
  const sql = `
  UPDATE employees 
    SET role_id = ? 
    WHERE id = ?
  `;
  const params = [empRoleUpdateInfo.roleId, empRoleUpdateInfo.empId]
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `);
    console.table(rows);
  })
  .then(() => {
    startGetEmps();
    setTimeout(promptBeginning, 1000);
  })
  .catch(err => err);
}
//function for querying updating employee managers
updateEmpMgr = updateEmpMgrInfo => {
  console.log(updateEmpMgrInfo);
  const sql = `
  UPDATE employees 
  SET manager_id = ? 
  WHERE id = ?
  `;
  const params = [updateEmpMgrInfo.manId, updateEmpMgrInfo.empId];
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `);
    console.table(rows);
  })
  .then(() => {
    startGetEmps();
    setTimeout(promptBeginning, 1000);
  })
  .catch(err => err);
}


//function for querying viewing employees by only manager
getManagers = () => {
  const sql = `
  SELECT 
    employees.id, 
    CONCAT(first_name, ' ', last_name) AS name 
  FROM employees WHERE manager_id IS NULL;
  `
  const params = [];
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}
//function for querying viewing employees by department
viewEmpByDept = () => {
  const sql = `
  SELECT 
    employees.id, 
    CONCAT(employees.first_name, ' ', employees.last_name) AS name,
    departments.name AS department
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  `;
  const params = [];
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}
//functions for querying deleting 
//dept
delDept = delDeptInfo => {
const sql = `
DELETE FROM departments WHERE departments.id = ?;
`;
const params = [delDeptInfo.deptId];
db.promise().query(sql, params, (err, rows, fields) => {
  if (err) throw err;
})
.then(([rows, fields]) => {
  console.log(`

  `);
  console.table(rows);
})
.then(() => {
  startGetDepts();
  setTimeout(promptBeginning, 1000);
})
.catch(err => err);
}
//role
delRole = delRoleInfo => {
  const sql = `

  `;
  const params = [];
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
//employee
delEmp = delEmpInfo => {
  const sql = `
  
  `;
  const params = [];
  db.promise().query(sql, params, (err, rows, fields) => {
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `);
    console.table(rows);
  })
  .then(() => {
    startGetEmps();
    setTimeout(promptBeginning, 1000);
  })
  .catch(err => err);
}


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