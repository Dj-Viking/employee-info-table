DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
	name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL UNSIGNED NOT NULL,
  department_id INT UNSIGNED,
  INDEX dep_ind (department_id),
    CONSTRAINT fk_department 
    FOREIGN KEY (department_id) 
    REFERENCES departments(id) 
    ON DELETE CASCADE
);

CREATE TABLE employees (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED,
  INDEX role_ind (role_id),
    CONSTRAINT fk_role 
    FOREIGN KEY (role_id) 
    REFERENCES roles(id) 
    ON DELETE SET NULL,
  manager_id INT UNSIGNED,
  INDEX man_ind (manager_id),
    CONSTRAINT fk_manager 
    FOREIGN KEY (manager_id) 
    REFERENCES employees(id) 
    ON DELETE SET NULL
);