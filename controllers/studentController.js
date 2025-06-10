// const bcrypt = require('bcrypt');
// const db = require('../models/db');

// // Show registration form
// exports.showRegisterForm = (req, res) => {
//   res.render('register');
// };

// // Handle registration
// exports.registerStudent = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await db.execute(
//       'INSERT INTO students (name, email, password) VALUES (?, ?, ?)',
//       [name, email, hashedPassword]
//     );
//     res.send('Registered successfully! You can now login.');
//   } catch (err) {
//     res.send('Registration error: ' + err.message);
//   }
// };

// // Show login form
// exports.showLoginForm = (req, res) => {
//   res.render('login');
// };

// // Handle login
// exports.loginStudent = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const [rows] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
//     if (rows.length === 0) return res.send('No student found.');

//     const student = rows[0];
//     const match = await bcrypt.compare(password, student.password);
//     if (!match) return res.send('Incorrect password.');

//     // Save login in session
//     req.session.student = student;
//     res.redirect('/student/dashboard');
//   } catch (err) {
//     res.send('Login error: ' + err.message);
//   }
// };
// exports.showRequestForm = (req, res) => {
//   if (!req.session.student) return res.redirect('/student/login');
//   res.render('student/request');
// };

// exports.submitRequest = async (req, res) => {
//   const { purpose } = req.body;
//   const student = req.session.student;

//   await db.execute(
//     'INSERT INTO requests (student_id, purpose) VALUES (?, ?)',
//     [student.id, purpose]
//   );

//   res.send('Request submitted successfully! <a href="/student/dashboard">Back to Dashboard</a>');
// };


// // Dashboard (only if logged in)
// exports.studentDashboard = (req, res) => {
//   if (!req.session.student) return res.redirect('/student/login');
//   res.render('student/dashboard', { student: req.session.student });
// };
const path = require('path');
const fs = require('fs');

const bcrypt = require('bcrypt');
const db = require('../models/db');

// Show registration form
exports.showRegisterForm = (req, res) => {
  res.render('register');
};

// Handle registration
exports.registerStudent = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO students (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.send('Registered successfully! You can now login.');
  } catch (err) {
    res.send('Registration error: ' + err.message);
  }
};

// Show login form
exports.showLoginForm = (req, res) => {
  res.render('login');
};

// Handle login
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM students WHERE email = ?', [email]);
    if (rows.length === 0) return res.send('No student found.');

    const student = rows[0];
    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.send('Incorrect password.');

    // Save login in session
    req.session.student = student;
    res.redirect('/student/dashboard');
  } catch (err) {
    res.send('Login error: ' + err.message);
  }
};

// Show request form
exports.showRequestForm = (req, res) => {
  if (!req.session.student) return res.redirect('/student/login');
  res.render('student/request');
};

// Submit new bonafide request
exports.submitRequest = async (req, res) => {
  const { number, purpose, category, category1, category2} = req.body;
  const student = req.session.student;

  try {
    await db.execute(
  'INSERT INTO requests (student_id, purpose, number, category, category1, category2) VALUES (?, ?, ?, ?, ?, ?)',
  [student.id, purpose, number, category, category1, category2]
);
    res.send('Request submitted successfully! <a href="/student/dashboard">Back to Dashboard</a>');
  } catch (err) {
    res.send('Error submitting request: ' + err.message);
  }
};

// Student dashboard with their requests
exports.studentDashboard = async (req, res) => {
  if (!req.session.student) return res.redirect('/student/login');
  
  const student = req.session.student;
  try {
    // Fetch all requests made by this student, newest first
    const [requests] = await db.execute(
      'SELECT * FROM requests WHERE student_id = ? ORDER BY created_at DESC',
      [student.id]
    );

    // Render dashboard with student info and their requests
    res.render('student/dashboard', { student, requests });
  } catch (err) {
    res.send('Error loading dashboard: ' + err.message);
  }
};
const PDFDocument = require('pdfkit');  // add at the top of the file with other imports

exports.downloadCertificate = async (req, res) => {
  const requestId = req.params.id;
  const student = req.session.student;

  if (!student) return res.redirect('/student/login');

  try {
    const [rows] = await db.execute(
      'SELECT * FROM requests WHERE id = ? AND student_id = ? AND status = "approved"',
      [requestId, student.id]
    );

    if (rows.length === 0) {
      return res.send('Certificate not available or request not approved yet.');
    }

    const request = rows[0];

    const doc = new PDFDocument();

    res.setHeader('Content-Disposition', 'attachment; filename=bonafide_certificate.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);
    //  const signPath = path.join(__dirname, '../public/images/sign.png');
    // const imagePath = path.join(__dirname,'../public/images/logo.png');
    // doc.image(imagePath,{
    //   fit:[100,100],
    //   align:'center',
    //   valign:'center'
    // });
    doc.fontSize(20).text('OFFICE OF THE PRINCIPAL', { align: 'center' });
    doc.fontSize(20).text('GOVERNMENT COLLEGE OF TECHNOLOGY',{align:'center'})
    doc.fontSize(20).text('COIMBATORE-641013',{align:'center'})
    doc.fontSize(18).text('Affiliated to Anna University, Chennai',{align:'center'})
    doc.moveDown();
    doc.fontSize(25).text('BONAFIDE CERTIFICATE', { align: 'center' });
    doc.moveDown();
    doc.moveDown();
    doc.fontSize(16).text(`This is to certify that ${student.name} (RollNo. ${request.number}) is a bonafide student of this college studying in ${request.category} year of Four years ${request.category2} Degree course in ${request.category1} during the academic year 2024-2025`);
    // doc.fontSize(16).text(`This is to certify that ${student.name} is a bonafide student of this college during the academic year  2024-2025`)
     doc.moveDown();
    doc.fontSize(16).text(`This certificate issued with reference to his/her application dated ${new Date().toLocaleDateString()} apply for ${request.purpose}` )
    // doc.text(`Purpose: ${request.para}`);
     doc.moveDown();
    doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`);
  // doc.image(signPath, 400, doc.y + 40, { width: 100 });
   const signPath = path.join(__dirname, '../public/images/sign.jpg');
if (fs.existsSync(signPath)) {
  const y = doc.y + 30;  // leave some gap after the last text
  doc.image(signPath, 400, y, { width: 140 }); // right corner
} else {
  doc.fontSize(12).text('[Signature image missing]', { align: 'right' });
}

    doc.end();

  } catch (err) {
    res.send('Error generating certificate: ' + err.message);
  }
};


