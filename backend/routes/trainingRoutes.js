const express = require('express');
const router = express.Router();
const {
  createTraining,
  getTrainings,
  assignTraining,
  deleteTraining
} = require('../controllers/trainingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('Manager'), createTraining);
router.get('/', protect, getTrainings);
router.put('/:id/assign', protect, authorizeRoles('Manager'), assignTraining);
router.delete('/:id', protect, authorizeRoles('Manager'), deleteTraining);

module.exports = router;
