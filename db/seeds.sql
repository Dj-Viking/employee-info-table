INSERT INTO department (name)
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

INSERT INTO role (title, salary, department_id)
VALUES 
  ('Engineer', 60000, 1),
  ('Specialist', 50000, 2),
  ('Officer', 40000, 3),
  ('Composer', 100000, 4),
  ('Agent', 80000, 5)
;

INSERT INTO employee (first_name, last_name, role_id, manager_id)