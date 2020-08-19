INSERT INTO departments (department_name)
VALUES
  ('Electrical'),
  ('Software'),
  ('Marketing'),
  ('Music'),
  ('Human Resources'),
  ('Security'),
  ('Coffee'),
  ('Networking')
;

INSERT INTO roles (title, salary, department_id)
VALUES 
  ('Engineer', 60000, 1),
  ('Specialist', 50000, 2),
  ('Officer', 40000, 3),
  ('Composer', 100000, 4),
  ('Agent', 80000, 5)
;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Jon', 'Doe', 1, NULL),
  ('Jan', 'Doe', 2, NULL),
  ('Jane', 'Doe', 3, NULL),
  ('Jim', 'Doe', 4, NULL),
  ('Joe', 'Doe', 5, NULL)
;