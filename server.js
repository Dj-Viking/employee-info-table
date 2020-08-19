const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3000;
const app = express();
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
  console.log("mysql connected!");
  app.listen('3000', () => {
    console.log(`Server started on port ${PORT}!`);
  });
});

promptUser = () => {
  return inquirer.prompt([
    {
      
    }
  ])
}

