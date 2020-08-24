const db = require('./db/database.js');
const cTable = require('console.table');
const inquirer = require('inquirer');
//inquirer lists getting populated by database
let deptList = [];
let roleList = [];
let empList = [];
let manList = [];
const beginList = [
  'View All Employees',
  'View All Departments',
  'View All Roles',
  'View All Managers',
  'View Utilized Budget By All Departments',
  'View Employees By Department',
  'Add A Department',
  'Add A Role',
  'Add An Employee',
  'Update An Employee Role',
  'Update An Employee Manager',
  'Delete A Department',
  'Delete A Role',
  'Delete An Employee',
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
    roleList = rows;
    console.log(roleList);
  });
}
const startGetEmps = () => {
  const sql = `
  SELECT
    CONCAT(employees.first_name, ' ', employees.last_name) AS name,
    employees.id AS value,
    employees.manager_id AS manager
  FROM employees
  LEFT JOIN employees managers ON managers.id = employees.manager_id
  `
  const params = [];
  db.query(sql, params, (err, rows, fields) => {
    if (err) throw err;
    console.log(`\x1b[33m`, `
    Querying employees...
    `, `\x1b[00m`);
    empList = rows;
    let iterated = []
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].manager === null) {
        iterated.push(rows[i]);
      }
    }
    manList = iterated;
    //console.table(rows);
    //console.log(fields);
    console.log(empList);
    console.log(`\x1b[33m`, `
    Querying managers...
    `, `\x1b[00m`);
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
  setTimeout(promptBeginning, 500);
});

const promptAddDept = () => {
  return inquirer.prompt ([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the department you would like to add?',
      validate: name => {
        console.log(name);
        for (let i = 0; i < deptList.length; i++){
          if (name === deptList[i].name) {
            console.log("\x1b[33m", "Name cannot be a duplicate. Try again.", "\x1b");
            return false;
          }
        }
        return true;
      }
    }
  ])
  .then(deptInfo => {
    console.log(deptInfo);
    addDept(deptInfo);
  })
  .catch(err => err);
}

const promptAddRole = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What would you like this new role to be named?',
      validate: name => {
        for(let i = 0; i < roleList.length; i++) {
          if (name === roleList[i].name){
            console.log("\x1b[33m", "Name cannot be a duplicate. Try again.", "\x1b");
            return false;
          } else {
            return true;
          }
        }
      }
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
      type: 'list',
      name: 'roleId',
      message: `What is this employee's role?`,
      choices: [...roleList]
    },
    {
      type: 'list',
      name: 'managerId',
      message: `Who is this employee's manager? \n If this employee doesn't need a manager select none`,
      //pass manNamesAndIds array of objects which was queried specifically for this prompt
      choices: [...manList, {name: "None", value: null }]
    }
  ])
  .then(empInfo => {
    //console.log(empInfo.managerId);
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
      message: 'Who will be their new manager? \n If this employee will not have a manager select "None"',
      choices: [...manList, {name: "None", value: null}]
    }
  ])
  .then(empMgrUpdateInfo => {
    console.log(empMgrUpdateInfo);
    updateEmpMgr(empMgrUpdateInfo);
  })
  .catch(err => err);
}

const promptDelDept = () => {
  //array of objects that have a property name and value of their id
  return inquirer.prompt ([
    {
      type: 'list',
      name: 'deptId',
      message: 'Which department do you want to delete?',
      choices: deptList
    }
  ])
  .then(delDeptInfo => {
    delDept(delDeptInfo);
    console.log(delDeptInfo);
  })
  .catch(err => err);
}

const promptDelRole = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'roleId',
      message: 'Which role do you want to delete?',
      choices: roleList
    }
  ])
  .then(delRoleInfo => {
    console.log(delRoleInfo);
    delRole(delRoleInfo);
  })
  .catch(err => err);
}

const promptDelEmp = () => {
  return inquirer.prompt ([
    {
      type: 'list',
      name: 'empId',
      message: 'Which employee do you want to delete from the list?',
      choices: empList
    }
  ])
  .then(delEmpInfo => {
    console.log(delEmpInfo);
    delEmp(delEmpInfo);
  })
}

//promptBeginning();
//cant access this function here...but its called in an earlier function at database connect time
// maybe initialization happens at the same time as connection
// which then promptBeginning can be accessed since it was initialized at connection time
// and then invoked inside the connection function...interesting
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
    if (data.queryChoice === 'Delete A Role') {
      promptDelRole();
    }
    if (data.queryChoice === 'Delete An Employee') {
      promptDelEmp();
    }
    if (data.queryChoice === 'View Utilized Budget By All Departments') {
      deptUtil();
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

deptUtil = () => {
  const sql = `
  SELECT 
    SUM(roles.salary) AS employee_total_budget,
    departments.name AS department
  FROM employees, roles, departments
  WHERE employees.role_id = roles.id AND roles.department_id = departments.id
  GROUP BY departments.id
  `
  const params = [];
  console.log(`\x1b[33m`, `
  Checking Budget...
  `, `\x1b[00m`);
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

//function for querying adding a department 
addDept = deptInfo => {
  console.log(deptInfo);
  const sql = ` 
  INSERT INTO departments (name) VALUES (?)
  `;
  //const params = [deptInfo.name];
  console.log(`\x1b[33m`, `
  Querying Add Department...
  `, `\x1b[00m`);
  db.promise().query(sql, deptInfo.name, (err, rows, fields) => {
    console.log(rows);
    if (err) throw err;
  })
  .then(([rows, fields]) => {
    console.log(`
    
    `);
    console.table(rows);
  })
  .then(() =>{
    startGetDepts();
    setTimeout(promptBeginning, 500);
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
    setTimeout(promptBeginning, 500);
  })
  .catch(err => err);
}
//function for querying adding an employee
addEmp = empInfo => {
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
    setTimeout(promptBeginning, 500);
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
    setTimeout(promptBeginning, 500);
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
    setTimeout(promptBeginning, 500);
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
DELETE FROM departments WHERE id = ?
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
  //since role gets deleted on the cascade employee stays but 
  // need to update the roles array too so that the inquirer list doesn't 
  // have roles that got deleted on the cascade
  startGetRoles();
  setTimeout(promptBeginning, 500);
})
.catch(err => err);
}
//role
delRole = delRoleInfo => {
  console.log(delRoleInfo);
  const sql = `
  DELETE FROM roles where id = ?
  `;
  const params = [delRoleInfo.roleId];
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
    setTimeout(promptBeginning, 500);
  })
  .catch(err => err);
}
//employee
delEmp = delEmpInfo => {
  const sql = `
  DELETE FROM employees where id = ?
  `;
  const params = [delEmpInfo.empId];
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
    setTimeout(promptBeginning, 500);
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