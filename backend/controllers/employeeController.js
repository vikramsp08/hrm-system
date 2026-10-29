const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (HR, Manager)
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('user', 'name email role department');
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('user', 'name email role department');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee record not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in employee's profile
// @route   GET /api/employees/profile/me
// @access  Private (Employee)
const getMyProfile = async (req, res) => {
  try {
    let employee = await Employee.findOne({ user: req.user._id }).populate('user', 'name email role department');
    if (!employee) {
      // Create default employee record if it doesn't exist yet
      employee = await Employee.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        department: req.user.department || 'General',
        position: 'Associate',
        salary: 35000,
        joinDate: new Date()
      });
      employee = await Employee.findById(employee._id).populate('user', 'name email role department');
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create employee record
// @route   POST /api/employees
// @access  Private (HR)
const createEmployee = async (req, res) => {
  try {
    const { name, email, department, position, salary, joinDate, phone, address, password } = req.body;

    if (!name || !email || !department || !position || !salary || !joinDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: 'Employee with this email already exists' });
    }

    // Check or create user account for this employee
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: password || 'Welcome@123',
        role: 'Employee',
        department
      });
    }

    const employee = await Employee.create({
      user: user._id,
      name,
      email,
      department,
      position,
      salary,
      joinDate,
      phone,
      address
    });

    res.status(201).json({ success: true, message: 'Employee created successfully', data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update employee record
// @route   PUT /api/employees/:id
// @access  Private (HR or Employee updating own record)
const updateEmployee = async (req, res) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee record not found' });
    }

    // If role is Employee, ensure they can only update their own record and limited fields (phone, address)
    if (req.user.role === 'Employee') {
      if (employee.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this employee record' });
      }
      employee.phone = req.body.phone !== undefined ? req.body.phone : employee.phone;
      employee.address = req.body.address !== undefined ? req.body.address : employee.address;
      await employee.save();
      return res.status(200).json({ success: true, message: 'Profile updated successfully', data: employee });
    }

    // HR can update all fields
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, message: 'Employee updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete employee record
// @route   DELETE /api/employees/:id
// @access  Private (HR)
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee record not found' });
    }

    // Optionally also remove the User or keep for history; let's delete the employee record
    await Employee.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Employee record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  getMyProfile,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
