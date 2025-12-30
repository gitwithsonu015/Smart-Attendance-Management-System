const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  qrCode: { type: String },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
