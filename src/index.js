const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");


// DB connection
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
);

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// Prmpt the user to select an option
function promptQuestions() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "intro",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "View Employee By Department",
          "View Employee By Manager",
          "Add Department",
          "Add Employee",
          "Add Role",
          "Update Employee",
          "Update Employee Manager",
          "Update Employee Role",
          "Delete Departments | Roles | Employees",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.intro) {
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "View Emplyoee By Department":
          viewEmployeeByDepartment();
          break;
        case "View Emplyoee By Manager":
          viewEmployeeByManager();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee":
          updateEmployee();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "Delete Departments | Roles | Employees":
          deleteDepartmentsRolesEmployees();
          break;
        case "Exit":
          console.log("May the Force be with you");
          db.end();
          break;
      }
    });
}

// view all employees
function viewEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id;`;
  db.query(sql, (err, response) => {
    if (err) throw err;
    console.table(response);
    promptQuestions();
  });
}

// view employees by department
const viewEmployeeByDepartment = () => {
  console.log("Showing employee by departments...\n");
  const sql = `SELECT employee.first_name, 
                        employee.last_name, 
                        department.name AS department
                FROM employee 
                LEFT JOIN role ON employee.role_id = role.id 
              LEFT JOIN department ON role.department_id = department.id`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    promptQuestions();
  });
};

// view employees by manager
const viewEmployeeByManager = () => {
  console.log("Showing employee by Managers...\n");
  const sql = `SELECT CONCAT(m.first_name, ' ', m.last_name) AS manager, CONCAT(e.first_name, ' ', e.last_name) AS employee
               FROM employee e
               INNER JOIN employee m ON e.manager_id = m.id
               ORDER BY manager, employee`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    const groupedEmployees = result.reduce((acc, curr) => {
      if (acc[curr.manager]) {
        acc[curr.manager].push(curr.employee);
      } else {
        acc[curr.manager] = [curr.employee];
      }
      return acc;
    }, {});
    const managerEmployeePairs = Object.entries(groupedEmployees).map(
      ([manager, employees]) => ({
        manager,
        employees,
      })
    );
    console.table(managerEmployeePairs);
    promptQuestions();
  });
};

// add employee
function addEmployee() {
  const sql2 = `SELECT * FROM employee`;
  db.query(sql2, (err, response) => {
    if (err) throw err;
    employeeList = response.map((employees) => ({
      name: employees.first_name.concat(" ", employees.last_name),
      value: employees.id,
    }));
    const sql3 = `SELECT * FROM role`;
    db.query(sql3, (err, response) => {
      if (err) throw err;
      roleList = response.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      const sql4 = `SELECT * FROM department`;
      db.query(sql4, (err, response) => {
        if (err) throw err;
        departmentList = response.map((departments) => ({
          name: departments.name,
          value: departments.id,
        }));
        return inquirer
          .prompt([
            {
              type: "input",
              name: "first",
              message: "What is the first name?",
            },
            {
              type: "input",
              name: "last",
              message: "What is the last name?",
            },
            {
              type: "list",
              name: "department",
              message: "Which Department does he/she serve?",
              choices: departmentList,
            },
            {
              type: "list",
              name: "role",
              message: "What is the role?",
              choices: roleList,
            },
          ])
          .then((answers) => {
            const sql = `INSERT INTO employee SET first_name='${answers.first}', last_name= '${answers.last}', role_id= ${answers.role}`;
            db.query(sql, (err, result) => {
              if (err) throw err;
              console.log(
                "Added " +
                answers.first +
                " " +
                answers.last +
                " to the database"
              );
              viewEmployees();
            });
          });
      });
    });
  });
}

// delete employee
const deleteEmployee = () => {
  const employeeSql = `SELECT * FROM employee`;
  db.query(employeeSql, (err, data) => {
    if (err) throw err;
    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Name of termination",
          choices: employees,
        },
      ])
      .then((empChoice) => {
        const employee = empChoice.name;
        const sql = `DELETE FROM employee WHERE id = ?`;
        db.query(sql, employee, (err, result) => {
          if (err) throw err;
          console.log("Employee terminated");
          // showing all the employees
          viewEmployees();
        });
      });
  });
};

// update employee
const updateEmployee = () => {
  const employeeSql = `SELECT * FROM employee`;
  db.query(employeeSql, (err, data) => {
    if (err) throw err;
    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Who do you wish to update?",
          choices: employees,
        },
      ])
      .then((empChoice) => {
        const employee = empChoice.name;
        const params = [];
        params.push(employee);
        const roleSql = `SELECT * FROM role`;
        db.query(roleSql, (err, data) => {
          if (err) throw err;
          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What is his/her new purpose?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              const role = roleChoice.role;
              params.push(role);
              let employee = params[0];
              params[0] = role;
              params[1] = employee;
              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

              db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log("Employee serves a new purpose");
                // showing all the employees
                viewEmployees();
              });
            });
        });
      });
  });
};

// update employee manager
const updateEmployeeManager = () => {
  // get employees from employee table
  const employeeSql = `SELECT * FROM employee`;
  db.query(employeeSql, (err, data) => {
    if (err) throw err;
    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "What is the new manager",
          choices: employees,
        },
      ])
      .then((empChoice) => {
        const employee = empChoice.name;
        const params = [];
        params.push(employee);
        inquirer
          .prompt([
            {
              type: "list",
              name: "manager",
              message: "Who is the new manager",
              choices: employees,
            },
          ])
          .then((managerChoice) => {
            const employee = managerChoice.manager;
            params.push(employee);
            let employee1 = params[0];
            params[0] = employee;
            params[1] = employee1;
            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
            db.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log("He/she serves a new master");
              // showing all the employees
              viewEmployees();
            });
          });
      });
  });
};

// view all roles
function viewRoles() {
  const sql = `SELECT role.id, role.title AS role, role.salary, department.name AS department FROM role INNER JOIN department ON (department.id = role.department_id);`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    promptQuestions();
  });
}

// add role
function addRole() {
  const sql2 = `SELECT * FROM department`;
  db.query(sql2, (err, response) => {
    if (err) throw err;
    departmentList = response.map((departments) => ({
      name: departments.name,
      value: departments.id,
    }));
    return inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the new purpose?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the price of the new purpose?",
        },
        {
          type: "list",
          name: "department",
          message: "Which Department does he/she serve?",
          choices: departmentList,
        },
      ])
      .then((answers) => {
        // remove commas from salary incase of input
        const salary = answers.salary.replace(/,/g, '');
        const sql = `INSERT INTO role SET title='${answers.title}', salary= ${answers.salary}, department_id= ${answers.department};`;
        db.query(sql, (err, result) => {
          if (err) throw err;
          console.log(
            "Added " + answers.title + " to the database"
          );
          viewRoles();
        });
      });
  });
}

// delete role
const deleteRole = () => {
  const job_titleSql = `SELECT * FROM role`;
  db.query(job_titleSql, (err, data) => {
    if (err) throw err;
    const job_title = data.map(({
      title,
      id
    }) => ({
      name: title,
      value: id
    }));
    inquirer.prompt([{
      type: 'list',
      name: 'job_title',
      message: "What the reason for termination?",
      choices: job_title
    }])
      .then(job_titleChoice => {
        const job_title = job_titleChoice.job_title;
        const sql = `DELETE FROM role WHERE id = ?`;
        db.query(sql, job_title, (err, result) => {
          if (err) throw err;
          console.log("Terminated");

          viewRoles();
        });
      });
  });
};

// update role
function updateRole() {
  const sql2 = `SELECT * FROM employee`;
  db.query(sql2, (err, response) => {
    if (err) throw err;
    employeeList = response.map((employees) => ({
      name: employees.first_name.concat(" ", employees.last_name),
      value: employees.id,
    }));
    const sql3 = `SELECT * FROM role`;
    db.query(sql3, (err, response) => {
      if (err) throw err;
      roleList = response.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      return inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee do you want to update?",
            choices: employeeList,
          },
          {
            type: "list",
            name: "role",
            message: "What is his/her new purpose?",
            choices: roleList,
          },
          {
            type: "list",
            name: "manager",
            message: "Who does he/she serve?",
            choices: employeeList,
          },
        ])
        .then((answers) => {
          const sql = `UPDATE employee SET role_id= ${answers.role}, manager_id=${answers.manager} WHERE id =${answers.employee};`;
          db.query(sql, (err, result) => {
            if (err) throw err;
            console.log("He/she serves a new purpose");
            viewEmployees();
          });
        });
    });
  });
}

// view all departments
function viewDepartments() {
  const sql = `SELECT department.id, department.name AS Department FROM department;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    promptQuestions();
  });
}

// add department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department(name) VALUES('${answer.department}');`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Added " + answer.department + " to the database");
        // showing all department
        viewDepartments();
      });
    });
}

// delete department
const deleteDepartment = () => {
  const deptSql = `SELECT * FROM department`;
  db.query(deptSql, (err, data) => {
    if (err) throw err;
    const dept = data.map(({ name, id }) => ({
      name: name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "dept",
          message: "What department do you wish to terminate?",
          choices: dept,
        },
      ])
      .then((deptChoice) => {
        const dept = deptChoice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;
        db.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("Department terminated");
          viewDepartments();
        });
      });
  });
};

// delete departments, roles, employees
function deleteDepartmentsRolesEmployees() {
  inquirer
    .prompt({
      type: "list",
      name: "data",
      message: "Specify the target of termination",
      choices: ["Employee", "Role", "Department"],
    })
    .then((answer) => {
      switch (answer.data) {
        case "Employee":
          deleteEmployee();
          break;
        case "Role":
          deleteRole();
          break;
        case "Department":
          deleteDepartment();
          break;
        default:
          console.log(`Invalid data: ${answer.data}`);
          // restart the application
          promptQuestions();
          break;
      }
    });
};

module.exports = { startApp: promptQuestions };