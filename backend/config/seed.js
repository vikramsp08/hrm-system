const User = require('../models/User');
const Employee = require('../models/Employee');
const Announcement = require('../models/Announcement');

const seedInitialData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    console.log('Seeding initial default demo accounts...');

    // 1. HR User
    const hr = await User.create({
      name: 'Eleanor Vance (HR)',
      email: 'hr@company.com',
      password: 'password123',
      role: 'HR',
      department: 'Human Resources'
    });

    // 2. Manager User
    const manager = await User.create({
      name: 'Marcus Brody (Manager)',
      email: 'manager@company.com',
      password: 'password123',
      role: 'Manager',
      department: 'Engineering'
    });

    // 3. Employee User
    const employee = await User.create({
      name: 'Alex Rivera (Employee)',
      email: 'employee@company.com',
      password: 'password123',
      role: 'Employee',
      department: 'Engineering'
    });

    // Employee directory record for Alex
    await Employee.create({
      user: employee._id,
      name: employee.name,
      email: employee.email,
      department: 'Engineering',
      position: 'Full Stack Developer',
      salary: 85000,
      joinDate: new Date('2024-01-15'),
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Springfield'
    });

    // Demo announcement
    await Announcement.create({
      title: 'Welcome to HRM Pro Enterprise',
      message: 'Welcome all team members to our upgraded HRM platform. You can now track attendance, submit leaves, and view announcements directly.',
      createdBy: hr._id,
      targetAudience: 'All'
    });

    console.log('Demo accounts seeded:');
    console.log('  HR:       hr@company.com / password123');
    console.log('  Manager:  manager@company.com / password123');
    console.log('  Employee: employee@company.com / password123');
  } catch (error) {
    console.log('Notice during seed check:', error.message);
  }
};

module.exports = seedInitialData;
