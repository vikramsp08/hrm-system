const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide employee name']
  },
  email: {
    type: String,
    required: [true, 'Please provide employee email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please provide department']
  },
  position: {
    type: String,
    required: [true, 'Please provide position']
  },
  salary: {
    type: Number,
    required: [true, 'Please provide salary']
  },
  joinDate: {
    type: Date,
    required: [true, 'Please provide join date']
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
