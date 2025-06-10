const mysql = require('mysql2');

// Create the connection pool (better for production)
const pool = mysql.createPool({
  host: 'localhost',      // your MySQL host, usually localhost
  user: 'student',           // your MySQL username
  password: 'Password', // your MySQL password
  database: 'bonafide_db',  // your database name (create this database in MySQL)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise(); // Export promise-based pool for async/await
