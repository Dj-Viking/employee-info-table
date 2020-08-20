//const express = require('express');
const mysql = require('mysql2');
//const PORT = process.env.PORT || 3000;
//const app = express();
const cTable = require('console.table');
const inquirer = require('inquirer');
//create connection to mysql2 server
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'root123@',
  database: 'employees_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log("\x1b[33m", `

  mysql connected!
  `, "\x1b[00m" );
  promptBeginning();
});

const choiceList = [
  'View All Departments',
  'View All Roles',
  'View All Employees',
  'Add A Department',
  'Add A Role',
  'Add An Employee',
  'Update An Employee Role'
];

const promptBeginning = () => {
  return inquirer.prompt(
    {
      type: 'list',
      name: 'queryChoice',
      message: 'What would you like to do?',
      choices: choiceList
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
  })
  .catch(err => err);
}

getDepts = () => {
  const sql = `
  SELECT id, name FROM departments
  `;
  const params = [];
  console.log("\x1b[33m", "Querying departments...", "\x1b[00m");
  db.promise().query(sql, params, function(err, rows, fields) {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) => {
    console.table(rows);
  })
  .then(() => promptBeginning())
  .catch(err => err);
}

getRoles = () => {
  const sql = `
  SELECT roles.title, roles.id, departments.name AS department_name, roles.salary 
  FROM roles
  LEFT JOIN departments ON roles.department_id = departments.id
  `;
  const params = [];
  console.log("\x1b[33m", "Querying roles...", "\x1b[00m");
  db.promise().query(sql, params, function(err, rows, fields) {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) => {
    //console.log(fields);
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
  const sql = `
  SELECT employees.id AS emp_id, employees.first_name AS emp_name,
         employees.manager_id AS manager_id, employees.first_name AS manager_name
         FROM employees
         WHERE employees.id > employees.first_name;
  `
  const params = [];
  console.log("\x1b[33m", "Querying employees...", "\x1b[00m");
  db.promise().query(sql, params, function(err, rows, fields) {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) => {
    console.table(rows);
  })
  .then(() => promptBeginning())
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