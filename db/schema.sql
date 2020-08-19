DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;

CREATE TABLE departments (
  id INT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
)ENGINE=INNODB;

CREATE TABLE roles (
  id INT NOT NULL,
  department_id INT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  PRIMARY KEY (id),  
  INDEX dep_ind (department_id),
  FOREIGN KEY (department_id)
      REFERENCES departments(id)
      ON DELETE CASCADE
)ENGINE=INNODB;

CREATE TABLE employees (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED,
  manager_id INT UNSIGNED,
  PRIMARY KEY (id)
);

