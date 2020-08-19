//const express = require('express');
const mysqlPromise = require('mysql2/promise');
const mysql = require('mysql2');
const dbPromise = mysqlPromise;
//const PORT = process.env.PORT || 3000;
//const app = express();
const inquirer = require('inquirer');
//create connection to mysql2 server
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'root123@',
  database: 'employee_db'
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
      getDept();
    }
  })
  .catch(err => err);
}

const getDept = () => {
  const sql = `SELECT * FROM departments`;
  const params = [];
  console.log("\x1b[33m", "Querying departments...", "\x1b[00m");
  db.promise().query(sql, params, function(err, rows, fields) {
    if (err) {
      throw err;
    }
  })
  .then(([rows, fields]) =>{
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