// const express = require('express');
// const router = express.Router();

// router.get('/login', (req, res) => {
//   res.send('Admin login page - coming soon');
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin login
router.get('/login', adminController.showLoginForm);
router.post('/login', adminController.login);

// View all requests
router.get('/requests', adminController.viewRequests);

// Approve request
router.post('/approve/:id', adminController.approveRequest);

// Reject request
router.post('/reject/:id', adminController.rejectRequest);

module.exports = router;
