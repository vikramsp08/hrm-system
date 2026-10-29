const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('HR', 'Manager'), createAnnouncement);
router.get('/', protect, getAnnouncements);
router.delete('/:id', protect, authorizeRoles('HR', 'Manager'), deleteAnnouncement);

module.exports = router;
