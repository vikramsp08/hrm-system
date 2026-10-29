const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, applyLeave);
router.get('/my-leaves', protect, getMyLeaves);
router.get('/', protect, authorizeRoles('HR', 'Manager'), getAllLeaves);
router.put('/:id/status', protect, authorizeRoles('HR', 'Manager'), updateLeaveStatus);

module.exports = router;
