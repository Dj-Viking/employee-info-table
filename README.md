

# Employee Info Table

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node: JS](https://img.shields.io/badge/Node-JS-b7b402.svg)](https://img.shields.io/)
[![Database: MySQL](https://img.shields.io/badge/Database-MySQL-111AFF.svg)](https://img.shields.io/) [![Interface: Inquirer](https://img.shields.io/badge/Interface-Inquirer-00bf34.svg)](https://img.shields.io/) [![console: .table](https://img.shields.io/badge/console-.table-6517D7.svg)](https://img.shields.io/) [![Operation: CRUDeholder](https://img.shields.io/badge/Operation-CRUD-red.svg)](https://img.shields.io/)

## Description 

Using Node.js with node packages: console.table, MySQL2 and Inquirer - Creating a CLI to a database of employee info and simulate a strictly back-end CRUD operation. Using JavaScript to communicate with a MySQL database to read/write, update, and delete information from the database. All with the interface created using Inquirer to easily manage a database.

## Table of Contents
* [Installation](#Installation)
* [Usage](#Usage)
* [Credits](#Credits)
* [Contribute](#Contribute)
* [License](#License)
* [Questions](#Questions)

## Installation
* To install this app, first <code>git clone</code> the repository to your preferred working directory
* Change directory into your repository folder
* Then run this shell script to install dependencies

  <code>npm install</code>

* Once dependencies are successfully installed. Make sure you have MySQL 8 installed onto your computer and have a legacy password set for the root user.

* Connect to the database via your shell with this command

  <code>mysql -u root -p</code>

  - enter your admin password if you need to, and then enter your legacy password you set at MySQL installation.

* If you're able to connect to the database, then you're ready to use this app! because you'll need that password to connect to that database on your local computer from within the code it self
* The video will show explicitly where you need to enter your password into the code itself but here's an example of what it will look like

 ```js script 
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'your legacy password goes here',
  database: 'employees_db'
});

module.exports = db;
```  

* Now you're __really__ ready for operation CRUD! 😎

## Usage
- Check out the walkthrough video here by clicking this badge! 👇
* [![You: Tube](https://img.shields.io/badge/You-Tube-ff0000.svg)](https://youtu.be/ODwdS7HbAdw)


## Credits

* Anders Ackerman
* My Three Cats!

## Contribute

If anybody would like to contribute, please send me an email or submit a pull request with any changes. Or if there are any bugs, feel free to open an issue. Thanks! 👍

## License

Employee Info Table is licensed under the MIT license.

## Questions

If anybody has any questions please reach out to the creator of the project - Anders Ackerman via:
* Email: anders.swedishviking@gmail.com
* GitHub: (https://github.com/dj-viking)
