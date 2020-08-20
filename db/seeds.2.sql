use employees_db;

INSERT INTO departments (name)
  VALUES
    ('Marketing'),
    ('Engineering'),
    ('Magic'),
    ('Coffee')
  ;

INSERT INTO roles (title, salary, department_id)
  VALUES
    ('Marketing Lead', 100000, 1),
    ('Marketing Specialist', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Magicks Manager', 60000, 3),
    ('Magician', 30000, 3),
    ('Coffee Team Lead', 50000, 4),
    ('Barista', 40000, 4)
  ;

INSERT INTO employees (first_name, last_name, role_id)
  VALUES
    ('Mike', 'Wazowski', 1),
    ('Bruce', 'Lee', 3),
    ('Super', 'Mario', 5),
    ('Sarah', 'Marshall', 7)
  ;

INSERT INTO managers (first_name, last_name, role_id)
  VALUES
  ('Jackie', 'Chan', 2),
  ('M.', 'Bison', 4),
  ('Bowser', 'Koopa', 6),
  ('Tom', 'Hanks', 8)
