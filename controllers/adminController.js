const bcrypt = require('bcrypt');
const db = require('../models/db');

// Hardcoded admin for demo (we can also insert in DB)
const adminUsername = 'admin';
const adminPassword = '$2b$10$El45QSoB9ChhnCKTdAUlCOuVzYN97x/IrTO1LXs8kbHNi1Bp2fS62'; // bcrypt of "admin123"

exports.showLoginForm = (req, res) => {
  res.render('admin/login');
};

exports.login = async (req, res) => {
    console.log(req.body);
  const { username, password } = req.body;
  if (username !== adminUsername) return res.send('Admin not found');
  
  const match = await bcrypt.compare(password, adminPassword);
  if (!match) return res.send('Wrong password');

  req.session.admin = true;
  res.redirect('/admin/requests');
};

exports.viewRequests = async (req, res) => {
  if (!req.session.admin) return res.redirect('/admin/login');
  const [requests] = await db.execute(`
    SELECT requests.*, students.name, students.email 
    FROM requests 
    JOIN students ON students.id = requests.student_id
  `);
  res.render('admin/requests', { requests });
};

exports.approveRequest = async (req, res) => {
  const id = req.params.id;
  await db.execute('UPDATE requests SET status = "approved" WHERE id = ?', [id]);
  res.redirect('/admin/requests');
};

exports.rejectRequest = async (req, res) => {
  const id = req.params.id;
  await db.execute('UPDATE requests SET status = "rejected" WHERE id = ?', [id]);
  res.redirect('/admin/requests');
};
