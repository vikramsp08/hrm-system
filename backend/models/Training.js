const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide training title']
    },
    description: {
      type: String,
      required: [true, 'Please provide training description']
    },
    date: {
      type: Date,
      required: [true, 'Please provide training date']
    },
    trainer: {
      type: String,
      default: 'TBD'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user is required']
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Training', trainingSchema);
