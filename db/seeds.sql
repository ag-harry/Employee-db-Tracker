-- Seed data for the database
INSERT INTO department (name)
VALUES  ('Confidential'),
        ('Secret'),
        ('Intel');

INSERT INTO role (title, salary, department_id)
VALUES  ('Official', 1000000.00, 1),
        ('Restricted', 100000.00, 2),
        ('Classified', 100000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Sasha', 'Gilbert', 1, 1),
        ('Amy', 'Pisoni', 2, 2),
        ('Grog', 'Lastname', 3, 3);