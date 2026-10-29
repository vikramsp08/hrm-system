const Attendance = require('../models/Attendance');

// @desc    Mark attendance (Check-in or Check-out)
// @route   POST /api/attendance/mark
// @access  Private (Employee)
const markAttendance = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = new Date().toLocaleTimeString();

    let record = await Attendance.findOne({ user: req.user._id, date: today });

    if (!record) {
      // First check-in of the day
      record = await Attendance.create({
        user: req.user._id,
        date: today,
        checkInTime: currentTime,
        status: 'Present'
      });
      return res.status(201).json({
        success: true,
        message: 'Checked in successfully for today',
        data: record
      });
    } else {
      // Subsequent interaction: Check-out
      if (record.checkOutTime) {
        return res.status(400).json({
          success: false,
          message: 'Attendance already completed (checked out) for today'
        });
      }
      record.checkOutTime = currentTime;
      await record.save();
      return res.status(200).json({
        success: true,
        message: 'Checked out successfully for today',
        data: record
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's attendance records
// @route   GET /api/attendance/my-attendance
// @access  Private (Employee)
const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance summary for all employees
// @route   GET /api/attendance/summary
// @access  Private (HR, Manager)
const getAttendanceSummary = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('user', 'name email department role')
      .sort({ date: -1, createdAt: -1 });

    const totalRecords = records.length;
    const presentCount = records.filter(r => r.status === 'Present').length;
    const halfDayCount = records.filter(r => r.status === 'Half Day').length;
    const absentCount = records.filter(r => r.status === 'Absent').length;

    res.status(200).json({
      success: true,
      summary: {
        totalRecords,
        presentCount,
        halfDayCount,
        absentCount
      },
      data: records
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  markAttendance,
  getMyAttendance,
  getAttendanceSummary
};
