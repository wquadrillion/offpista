const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
  extras: { type: Object }, // JSON field for tags, due date, priority, etc.
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
