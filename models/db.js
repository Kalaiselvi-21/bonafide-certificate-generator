require("dotenv").config();
const mysql = require('mysql2');

// Create the connection pool (better for production)
// const pool = mysql.createPool({
//   host: 'localhost',      // your MySQL host, usually localhost
//   user: 'student',           // your MySQL username
//   password: 'Password', // your MySQL password
//   database: 'bonafide_db',  // your database name (create this database in MySQL)
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = db.promise(); // Export promise-based pool for async/await
