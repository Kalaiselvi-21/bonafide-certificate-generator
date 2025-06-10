const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
router.get('/register',studentController.showRegisterForm);
router.post('/register',studentController.registerStudent);
router.get('/login',studentController.showLoginForm);
router.post('/login',studentController.loginStudent);
router.get('/dashboard',studentController.studentDashboard);
router.get('/request', studentController.showRequestForm);
router.post('/request', studentController.submitRequest);
router.get('/certificate/:id/download', studentController.downloadCertificate);


module.exports = router;
