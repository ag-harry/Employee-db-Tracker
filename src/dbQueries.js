const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password', // replace with your own MySQL password
  database: 'employeeTracker_db',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = connection;
