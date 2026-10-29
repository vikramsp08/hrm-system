const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getMyAttendance,
  getAttendanceSummary
} = require('../controllers/attendanceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/mark', protect, authorizeRoles('Employee'), markAttendance);
router.get('/my-attendance', protect, authorizeRoles('Employee'), getMyAttendance);
router.get('/summary', protect, authorizeRoles('HR', 'Manager'), getAttendanceSummary);

module.exports = router;
