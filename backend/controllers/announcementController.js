const Announcement = require('../models/Announcement');

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private (HR, Manager)
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, targetAudience } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Please provide both title and message' });
    }

    const announcement = await Announcement.create({
      title,
      message,
      targetAudience: targetAudience || 'All',
      createdBy: req.user._id
    });

    const populated = await Announcement.findById(announcement._id).populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Announcement posted successfully',
      data: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get announcements for the current user's role
// @route   GET /api/announcements
// @access  Private (All authenticated users)
const getAnnouncements = async (req, res) => {
  try {
    let filter = { targetAudience: 'All' };

    if (req.user.role === 'HR') {
      filter = {}; // HR sees all announcements
    } else if (req.user.role === 'Manager') {
      filter = { targetAudience: { $in: ['All', 'Managers'] } };
    } else if (req.user.role === 'Employee') {
      filter = { targetAudience: { $in: ['All', 'Employees'] } };
    }

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private (HR, Manager who created it)
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    // HR can delete any, Manager can delete their own
    if (req.user.role !== 'HR' && announcement.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this announcement' });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Announcement removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement
};
