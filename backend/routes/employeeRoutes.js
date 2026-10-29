const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  getMyProfile,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/profile/me', protect, authorizeRoles('Employee'), getMyProfile);
router.get('/', protect, authorizeRoles('HR', 'Manager'), getEmployees);
router.get('/:id', protect, getEmployeeById);
router.post('/', protect, authorizeRoles('HR'), createEmployee);
router.put('/:id', protect, authorizeRoles('HR', 'Employee'), updateEmployee);
router.delete('/:id', protect, authorizeRoles('HR'), deleteEmployee);

module.exports = router;
