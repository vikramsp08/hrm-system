const Training = require('../models/Training');
const User = require('../models/User');

// @desc    Create new training program
// @route   POST /api/trainings
// @access  Private (Manager)
const createTraining = async (req, res) => {
  try {
    const { title, description, date, trainer, assignedTo } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and date'
      });
    }

    const training = await Training.create({
      title,
      description,
      date,
      trainer: trainer || 'TBD',
      createdBy: req.user._id,
      assignedTo: assignedTo || []
    });

    const populated = await Training.findById(training._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email department');

    res.status(201).json({
      success: true,
      message: 'Training program created successfully',
      data: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all trainings or trainings assigned to logged in user
// @route   GET /api/trainings
// @access  Private
const getTrainings = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'Employee') {
      // Employee sees trainings assigned to them or created without specific assignment
      filter = {
        $or: [
          { assignedTo: req.user._id },
          { assignedTo: { $size: 0 } }
        ]
      };
    }

    const trainings = await Training.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email department')
      .sort({ date: 1 });

    res.status(200).json({ success: true, count: trainings.length, data: trainings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign employees to training program
// @route   PUT /api/trainings/:id/assign
// @access  Private (Manager)
const assignTraining = async (req, res) => {
  try {
    const { userIds } = req.body; // Array of User ObjectIds

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ success: false, message: 'Please provide an array of user IDs' });
    }

    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }

    // Merge new assignments without duplicates
    const combined = Array.from(new Set([...training.assignedTo.map(id => id.toString()), ...userIds]));
    training.assignedTo = combined;
    await training.save();

    const updated = await Training.findById(training._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Employees assigned to training successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete training program
// @route   DELETE /api/trainings/:id
// @access  Private (Manager)
const deleteTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }

    await Training.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Training deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTraining,
  getTrainings,
  assignTraining,
  deleteTraining
};
