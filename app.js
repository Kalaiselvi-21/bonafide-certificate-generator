const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const mysql = require('mysql2');

// Database pool connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'student',
  password: 'Password',
  database: 'bonafide_db'
});


module.exports = db; // export db for use in other files

// Import routes
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');

// Middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session setup
app.use(session({
  secret: 'bonafide_secret_key',  // change to strong secret
  resave: false,
  saveUninitialized: true
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from /public
app.use(express.static('public'));

// Routes
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
